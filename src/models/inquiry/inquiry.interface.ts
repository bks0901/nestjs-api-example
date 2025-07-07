import { EIndustryType } from '@constants/industry-type.enum';
import { BusinessModel } from '@models/business/business.model';

export interface IInquiryModel {
  phoneNumber: string;
  industry: EIndustryType;
  agreeMarketing: boolean;
  business?: BusinessModel;
}
