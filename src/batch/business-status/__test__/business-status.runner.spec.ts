import { BusinessStatusRunner } from '../business-status.runner';
import { BusinessRepository } from '@models/business/business.repository';
import { ConfigService } from '@nestjs/config';
import { BusinessStatusQueueService } from '@queues/business-status-queue/business-status-queue.service';

describe('BusinessStatusRunner', () => {
  let runner: BusinessStatusRunner;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockBusinessRepo: jest.Mocked<BusinessRepository>;
  let mockQueueService: jest.Mocked<BusinessStatusQueueService>;

  beforeEach(() => {
    mockConfigService = {
      getOrThrow: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    mockBusinessRepo = {
      findNeedCheckBusinessNumbers: jest.fn(),
    } as unknown as jest.Mocked<BusinessRepository>;

    mockQueueService = {
      addBusinessCheckJob: jest.fn(),
    } as unknown as jest.Mocked<BusinessStatusQueueService>;

    runner = new BusinessStatusRunner(mockConfigService, mockBusinessRepo, mockQueueService);
  });

  it('should exit early if no business numbers are returned', async () => {
    mockConfigService.getOrThrow.mockReturnValueOnce(7).mockReturnValueOnce(50);
    mockBusinessRepo.findNeedCheckBusinessNumbers.mockResolvedValue([]);

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await runner.execute();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockBusinessRepo.findNeedCheckBusinessNumbers).toHaveBeenCalledWith(7, 50);
    expect(logSpy).toHaveBeenCalledWith('조회 대상 사업자가 없습니다');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockQueueService.addBusinessCheckJob).not.toHaveBeenCalled();

    logSpy.mockRestore();
  });

  it('should add job to the queue if business numbers exist', async () => {
    mockConfigService.getOrThrow.mockReturnValueOnce(7).mockReturnValueOnce(50);
    const businessNumbers = ['1234567890', '1111111111'];
    mockBusinessRepo.findNeedCheckBusinessNumbers.mockResolvedValue(businessNumbers);

    await runner.execute();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockQueueService.addBusinessCheckJob).toHaveBeenCalledWith({ businessNumbers });
  });
});
