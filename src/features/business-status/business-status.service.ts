import { Injectable } from '@nestjs/common';
import { BusinessStatusApiClient } from './business-status.api';
import { mapStatusCodeToBusinessStatus } from '@utils/mappers/business-status.mapper';
import { IBusinessStatusCheckResult } from './interfcaes/business-status-check-result.interface';
import { stripHyphens } from '@utils/formatter/strip-hyphens';

@Injectable()
export class BusinessStatusService {
  constructor(private readonly apiClient: BusinessStatusApiClient) {}

  async getStatusForBusinessNumber(
    businessNumbers: string[],
  ): Promise<IBusinessStatusCheckResult[]> {
    const resultMap = await this.apiClient.checkStatus(businessNumbers);

    if (!resultMap || !Array.isArray(resultMap.data)) {
      console.log('응답 데이터가 유효하지 않습니다.');
      return [];
    }

    return resultMap.data.map((item) => {
      const { b_no, b_stt_cd, tax_type } = item;
      const status = mapStatusCodeToBusinessStatus(b_stt_cd, tax_type);
      return {
        businessNumber: stripHyphens(b_no),
        status,
      };
    });
  }
}
