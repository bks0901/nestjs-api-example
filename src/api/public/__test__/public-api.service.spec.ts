import { PublicApiService } from '../public-api.service';
import { InquiryRepository } from '@models/inquiry/inquiry.repository';
import { BusinessRepository } from '@models/business/business.repository';
import { BusinessStatusQueueService } from '@queues/business-status-queue/business-status-queue.service';
import { CreateInquiryDto } from '../dto/create-inquiry.dto';
import { EIndustryType } from '@constants/industry-type.enum';

describe('PublicApiService', () => {
  let service: PublicApiService;
  let mockInquiryRepo: jest.Mocked<InquiryRepository>;
  let mockBusinessRepo: jest.Mocked<BusinessRepository>;
  let mockQueueService: jest.Mocked<BusinessStatusQueueService>;

  beforeEach(() => {
    mockInquiryRepo = {
      create: jest.fn(),
    } as unknown as jest.Mocked<InquiryRepository>;

    mockBusinessRepo = {
      create: jest.fn(),
    } as unknown as jest.Mocked<BusinessRepository>;

    mockQueueService = {
      addBusinessCheckJob: jest.fn(),
    } as unknown as jest.Mocked<BusinessStatusQueueService>;

    service = new PublicApiService(mockInquiryRepo, mockBusinessRepo, mockQueueService);
  });

  it('should create inquiry without business number', async () => {
    const dto: CreateInquiryDto = {
      phoneNumber: '010-1234-5678',
      industry: '기타업종' as EIndustryType,
      agreeMarketing: true,
    };

    await service.createInquiry(dto);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockBusinessRepo.create).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockInquiryRepo.create).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockQueueService.addBusinessCheckJob).not.toHaveBeenCalled();
  });

  it('should create inquiry with business number and enqueue status check', async () => {
    const dto: CreateInquiryDto = {
      phoneNumber: '010-9876-5432',
      businessNumber: '123-45-67890',
      industry: '교육' as EIndustryType,
      agreeMarketing: false,
    };

    await service.createInquiry(dto);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockBusinessRepo.create).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockInquiryRepo.create).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockQueueService.addBusinessCheckJob).toHaveBeenCalledWith({
      businessNumbers: ['1234567890'],
    });
  });
});
