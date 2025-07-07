import { Injectable } from '@nestjs/common';
import { BusinessRepository } from '@models/business/business.repository';
import { ConfigService } from '@nestjs/config';
import { BusinessStatusQueueService } from '@queues/business-status-queue/business-status-queue.service';

@Injectable()
export class BusinessStatusRunner {
  constructor(
    private readonly configService: ConfigService,
    private readonly businessRepo: BusinessRepository,
    private readonly businessStatusQueueService: BusinessStatusQueueService,
  ) {}

  async execute() {
    const intervalDays = this.configService.getOrThrow<number>(
      'public-api.nts-biz-reg-status.interval-days',
    );
    const batchSize = this.configService.getOrThrow<number>(
      'public-api.nts-biz-reg-status.batch-size',
    );

    const businessNumbers = await this.businessRepo.findNeedCheckBusinessNumbers(
      intervalDays,
      batchSize,
    );

    if (businessNumbers.length === 0) {
      console.log('조회 대상 사업자가 없습니다');
      return;
    }

    await this.businessStatusQueueService.addBusinessCheckJob({ businessNumbers: businessNumbers });
  }
}
