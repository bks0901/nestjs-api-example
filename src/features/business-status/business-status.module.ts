import { Module } from '@nestjs/common';
import { BusinessStatusApiClient } from './business-status.api';
import { BusinessStatusService } from './business-status.service';

@Module({
  providers: [BusinessStatusApiClient, BusinessStatusService],
  exports: [BusinessStatusService],
})
export class BusinessStatusModule {}
