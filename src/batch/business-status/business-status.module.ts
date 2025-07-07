import { Module } from '@nestjs/common';
import { BusinessStatusBatch } from './business-status.batch';
import { BusinessStatusRunner } from './business-status.runner';
import { InquiryRepositoryModule } from '@models/inquiry/inquiry.module';
import { BusinessStatusModule } from '@features/business-status/business-status.module';
import { BusinessStatusQueueModule } from 'src/queues/business-status-queue/business-status-queue.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    InquiryRepositoryModule,
    BusinessStatusModule,
    BusinessStatusQueueModule,
  ],
  providers: [BusinessStatusBatch, BusinessStatusRunner],
})
export class BusinessStatusBatchModule {}
