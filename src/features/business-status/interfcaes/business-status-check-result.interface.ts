import { EBusinessStatus } from '@constants/business-status.enum';

export interface IBusinessStatusCheckResult {
  businessNumber: string;
  status: EBusinessStatus;
}
