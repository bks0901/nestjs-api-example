import { Injectable } from '@nestjs/common';
import { InquiryRepository } from '@models/inquiry/inquiry.repository';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { stripHyphens } from '@utils/formatter/strip-hyphens';
import { BusinessModel } from '@models/business/business.model';
import { InquiryModel } from '@models/inquiry/inquiry.model';
import { BusinessRepository } from '@models/business/business.repository';
import { BusinessEntity } from '@models/business/business.entity';
import { BusinessStatusQueueService } from '@queues/business-status-queue/business-status-queue.service';

@Injectable()
export class PublicApiService {
  constructor(
    private readonly inquiryRepository: InquiryRepository,
    private readonly businessRepository: BusinessRepository,
    private readonly businessStatusQueueService: BusinessStatusQueueService,
  ) {}

  async createInquiry(dto: CreateInquiryDto): Promise<void> {
    const { phoneNumber, businessNumber, industry, agreeMarketing } = dto;

    const strippedPhone = stripHyphens(phoneNumber);
    let businessModel: BusinessModel | undefined = undefined;

    if (businessNumber !== undefined) {
      const strippedBusiness = stripHyphens(businessNumber);
      businessModel = new BusinessModel({ businessNumber: strippedBusiness });
    }

    const inquiryModel = new InquiryModel({
      phoneNumber: strippedPhone,
      industry,
      agreeMarketing,
      business: businessModel,
    });

    let businessEntity: BusinessEntity | undefined;

    if (businessModel) {
      businessEntity = businessModel.toEntity();
      await this.businessRepository.create(businessEntity);
    }

    const inquiryEntity = inquiryModel.toEntity();
    if (businessEntity) {
      inquiryEntity.business = businessEntity;
    }

    await this.inquiryRepository.create(inquiryEntity);

    if (businessEntity) {
      await this.businessStatusQueueService.addBusinessCheckJob({
        businessNumbers: [businessEntity.businessNumber],
      });
    }
  }
}
