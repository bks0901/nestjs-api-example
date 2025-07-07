import { Test } from '@nestjs/testing';
import { BusinessStatusProcessor } from '../business-status.processor';
import { BusinessStatusService } from '@features/business-status/business-status.service';
import { BusinessRepository } from '@models/business/business.repository';
import { ConfigService } from '@nestjs/config';
import { getQueueToken } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { createHashJobId } from '@utils/id/business-status-retry-id';
import { BusinessStatusJobPayload } from '../interfaces/business-status-job-paload.interface';

describe('BusinessStatusProcessor', () => {
  let processor: BusinessStatusProcessor;
  let service: BusinessStatusService;
  let repo: BusinessRepository;
  let queue: Queue;

  const mockQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        BusinessStatusProcessor,
        {
          provide: BusinessStatusService,
          useValue: {
            getStatusForBusinessNumber: jest.fn(),
          },
        },
        {
          provide: BusinessRepository,
          useValue: {
            bulkUpdateStatus: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue(2),
          },
        },
        {
          provide: getQueueToken('business-status-check'),
          useValue: mockQueue,
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue({
        getOrThrow: jest.fn().mockReturnValue(2),
      })
      .compile();

    processor = module.get(BusinessStatusProcessor);
    service = module.get(BusinessStatusService);
    repo = module.get(BusinessRepository);
    queue = module.get<Queue>(getQueueToken('business-status-check'));
  });

  it('should update status if API call succeeds', async () => {
    const job = {
      data: { businessNumbers: ['1234567890'], attempt: 0 },
    } as Job<BusinessStatusJobPayload>;

    const mockResult = [{ businessNumber: '1234567890', status: '계속사업자' }];
    (service.getStatusForBusinessNumber as jest.Mock).mockResolvedValue(mockResult);

    await processor.handleJob(job);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.getStatusForBusinessNumber).toHaveBeenCalledWith(['1234567890']);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.bulkUpdateStatus).toHaveBeenCalledWith(mockResult);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(queue.add).not.toHaveBeenCalled();
  });

  it('should retry if API call fails and attempts < max', async () => {
    const job = {
      data: { businessNumbers: ['1234567890'], attempt: 1 },
    } as Job<BusinessStatusJobPayload>;

    (service.getStatusForBusinessNumber as jest.Mock).mockRejectedValue(new Error('Network fail'));

    await processor.handleJob(job);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(queue.add).toHaveBeenCalledWith(
      'check',
      { businessNumbers: ['1234567890'], attempt: 2 },
      {
        delay: 1000 * 60 * 5,
        jobId: createHashJobId(['1234567890'], 1),
      },
    );
  });

  it('should not retry if attempt exceeds maxAttempts', async () => {
    const job = {
      data: { businessNumbers: ['1234567890'], attempt: 3 },
    } as Job<BusinessStatusJobPayload>;

    (service.getStatusForBusinessNumber as jest.Mock).mockRejectedValue(
      new Error('Too many attempts'),
    );

    await processor.handleJob(job);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(queue.add).not.toHaveBeenCalled();
  });
});
