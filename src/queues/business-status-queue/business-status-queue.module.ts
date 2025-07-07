import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BusinessStatusQueueService } from './business-status-queue.service';
import { BusinessStatusProcessor } from './business-status.processor';
import { BusinessStatusModule } from '@features/business-status/business-status.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'business-status-check',
    }),
    BusinessStatusModule,
  ],
  providers: [BusinessStatusProcessor, BusinessStatusQueueService],
  exports: [BusinessStatusQueueService],
})
export class BusinessStatusQueueModule {}
