import { Injectable, NotFoundException } from '@nestjs/common';
import { InquiryRepository } from '@models/inquiry/inquiry.repository';
import { FindInquiriesDto } from './dto/find-inquiries.dto';
import { FindInquiriesResponseDto } from './dto/find-inquiries-response.dto';
import { FindInquiryResponseDto } from './dto/find-inquiry-response.dto';

@Injectable()
export class InternalApiService {
  constructor(private readonly inquiryRepository: InquiryRepository) {}

  async getInquiries(dto: FindInquiriesDto): Promise<FindInquiriesResponseDto[]> {
    const phoneNumber = dto.phoneNumber?.replace(/-/g, '');
    const from = dto.fromDate ? new Date(dto.fromDate + 'T00:00:00.000Z').toISOString() : undefined;
    const to = dto.toDate ? new Date(dto.toDate + 'T23:59:59.999Z').toISOString() : undefined;

    const results = await this.inquiryRepository.findAllByFilter({
      ...dto,
      phoneNumber,
      fromDate: from,
      toDate: to,
    });

    return results.map((inquiry) => new FindInquiriesResponseDto(inquiry));
  }

  async getInquryById(id: number): Promise<FindInquiryResponseDto> {
    const inquiry = await this.inquiryRepository.findByIdWithBizAndLog(id);
    if (!inquiry) throw new NotFoundException('해당 ID 관련 정보를 찾을 수 없습니다.');

    return new FindInquiryResponseDto(inquiry);
  }
}
