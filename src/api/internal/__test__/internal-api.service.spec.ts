import { InquiryRepository } from '@models/inquiry/inquiry.repository';
import { InternalApiService } from '../internal-api.service';
import { Test, TestingModule } from '@nestjs/testing';
import { FindInquiriesDto } from '../dto/find-inquiries.dto';
import { EInquiryStatus } from '@constants/inquiry-status.enum';
import { InquiryEntity } from '@models/inquiry/inquiry.entity';
import { FindInquiryResponseDto } from '../dto/find-inquiry-response.dto';
import { NotFoundException } from '@nestjs/common';
import { Collection } from '@mikro-orm/core';
import { ConsultLogEntity } from '@models/consult-log/consult-log.entity';

describe('InternalApiService', () => {
  let service: InternalApiService;
  let inquiryRepository: jest.Mocked<InquiryRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InternalApiService,
        {
          provide: InquiryRepository,
          useValue: {
            findAllByFilter: jest.fn(),
            findByIdWithBizAndLog: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(InternalApiService);
    inquiryRepository = module.get(InquiryRepository);
  });

  describe('getInquiries', () => {
    it('should return formatted inquiries list', async () => {
      const dto: FindInquiriesDto = {
        phoneNumber: '010-1234-5678',
        fromDate: '2024-01-01',
        toDate: '2024-01-02',
      };
      inquiryRepository.findAllByFilter.mockResolvedValueOnce([
        {
          id: 1,
          phoneNumber: '01012345678',
          status: 'waiting' as EInquiryStatus,
          industry: '도소매',
          createdAt: Date.now(),
          businessNumber: '1234567890',
        },
      ]);

      const result = await service.getInquiries(dto);
      expect(result).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(inquiryRepository.findAllByFilter).toHaveBeenCalledWith(
        // expected,
        {
          ...dto,
          phoneNumber: '01012345678',
          fromDate: expect.any(String) as string,
          toDate: expect.any(String) as string,
        },
      );
    });
  });

  describe('getInquiryById', () => {
    it('should return inquiry if found', async () => {
      const entity = new InquiryEntity();
      entity.id = 1;
      entity.phoneNumber = '01012345678';
      entity.status = 'waiting' as EInquiryStatus;
      entity.industry = '도소매';
      entity.createdAt = new Date();
      entity.business = undefined;
      entity.consultLogs = {
        getItems: () => [],
      } as unknown as Collection<ConsultLogEntity>;

      inquiryRepository.findByIdWithBizAndLog.mockResolvedValueOnce(entity);
      const result = await service.getInquryById(1);

      expect(result).toBeInstanceOf(FindInquiryResponseDto);
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException if inquiry is not found', async () => {
      inquiryRepository.findByIdWithBizAndLog.mockRejectedValueOnce(new NotFoundException());
      await expect(service.getInquryById(999)).rejects.toThrow(NotFoundException);
    });
  });
});
