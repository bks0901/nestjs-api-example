import { stripHyphens } from '@utils/formatter/strip-hyphens';
import { InquiryEntity } from './inquiry.entity';
import { IInquiryModel } from './inquiry.interface';
import { EIndustryType } from '@constants/industry-type.enum';
import { BusinessModel } from '@models/business/business.model';

export class InquiryModel {
  private readonly phoneNumber: string;
  private readonly _industry: EIndustryType;
  private readonly agreeMarketing: boolean;
  private readonly business?: BusinessModel;

  constructor(props: IInquiryModel) {
    this.phoneNumber = props.phoneNumber;
    this._industry = props.industry;
    this.agreeMarketing = props.agreeMarketing;
    this.business = props.business;
  }

  get phone(): string {
    return stripHyphens(this.phoneNumber);
  }

  get businessNumber(): string | undefined {
    return this.business ? stripHyphens(this.business.businessNumber) : undefined;
  }

  get industry(): string {
    return this._industry;
  }

  get marketingAgreement(): boolean {
    return this.agreeMarketing;
  }

  isBusinessProvided(): boolean {
    return !!this.businessNumber;
  }

  toEntity(): InquiryEntity {
    const entity = new InquiryEntity();

    entity.phoneNumber = this.phoneNumber;
    entity.industry = this.industry;
    entity.marketingAgreement = this.agreeMarketing;

    if (this.business) {
      entity.business = this.business.toEntity();
    }

    return entity;
  }
}
