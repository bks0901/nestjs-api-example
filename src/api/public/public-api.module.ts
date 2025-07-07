import { Module } from '@nestjs/common';
import { InquiryRepositoryModule } from '@models/inquiry/inquiry.module';
import { PublicApiController } from './public-api.controller';
import { PublicApiService } from './public-api.service';
import { BusinessRepositoryModule } from '@models/business/business.module';
import { BusinessStatusQueueModule } from 'src/queues/business-status-queue/business-status-queue.module';

@Module({
  imports: [InquiryRepositoryModule, BusinessRepositoryModule, BusinessStatusQueueModule],
  controllers: [PublicApiController],
  providers: [PublicApiService],
})
export class PublicApiModule {}
