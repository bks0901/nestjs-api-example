import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { BusinessStatusJobPayload } from './interfaces/business-status-job-paload.interface';

@Injectable()
export class BusinessStatusQueueService {
  constructor(
    @InjectQueue('business-status-check')
    private readonly queue: Queue,
  ) {}

  async addBusinessCheckJob(payload: BusinessStatusJobPayload): Promise<void> {
    await this.queue.add('check', payload);
  }
}
