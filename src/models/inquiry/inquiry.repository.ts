import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InquiryEntity } from './inquiry.entity';
import { FindInquiriesDto } from '@api/internal/dto/find-inquiries.dto';
import { SqlEntityManager } from '@mikro-orm/sqlite';
import { IInquiriesWithBusinessRawQuery } from '@api/internal/dto/find-inquiries-response.dto';

@Injectable()
export class InquiryRepository {
  constructor(
    private readonly em: EntityManager,
    private readonly se: SqlEntityManager,
  ) {}

  async create(inquiry: InquiryEntity): Promise<void> {
    this.em.persist(inquiry);
    await this.em.flush();
  }

  async findAllByFilter(dto: FindInquiriesDto): Promise<IInquiriesWithBusinessRawQuery[]> {
    const qb = this.se.createQueryBuilder(InquiryEntity, 'i');

    qb.select([
      'i.id as id',
      'i.phone_number as phoneNumber',
      'i.status as status',
      'i.created_at as createdAt',
      'b.business_number as businessNumber',
    ]).leftJoin('i.business', 'b');

    if (dto.fromDate && dto.toDate) {
      qb.andWhere({
        createdAt: {
          $gte: new Date(dto.fromDate),
          $lte: new Date(dto.toDate),
        },
      });
    }

    if (dto.status) {
      qb.andWhere({ status: dto.status });
    }

    if (dto.phoneNumber) {
      qb.andWhere({ phoneNumber: dto.phoneNumber });
    }

    return await qb
      .orderBy({ createdAt: 'DESC' })
      .limit(dto.limit || 100)
      .offset(dto.offset || 0)
      .execute();
  }

  async findByIdWithBizAndLog(id: number): Promise<InquiryEntity> {
    const inquiry = await this.se.findOne(
      InquiryEntity,
      { id },
      {
        populate: ['business', 'consultLogs'],
      },
    );

    if (!inquiry) {
      throw new NotFoundException('해당 ID의 문의를 찾을 수 없습니다.');
    }

    return inquiry;
  }
}
