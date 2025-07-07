import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { BusinessStatusResponseDto } from './dto/business-status-response.dto';
import { BusinessStatusRequestDto } from './dto/business-status-request.dto';

@Injectable()
export class BusinessStatusApiClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async checkStatus(businessNumbers: string[]): Promise<BusinessStatusResponseDto> {
    const baseUrl = this.configService.getOrThrow<string>('public-api.nts-biz-reg-status.base-url');
    const serviceKey = this.configService.getOrThrow<string>(
      'public-api.nts-biz-reg-status.api-key',
    );

    if (businessNumbers.length > 100) {
      throw new Error('100개 초과 시에는 공공 API에서 Too Large Request Error가 발생합니다');
    }

    const url = `${baseUrl}/status?serviceKey=${serviceKey}`;
    const payload: BusinessStatusRequestDto = { b_no: businessNumbers };

    try {
      const res = await this.axiosInstance.post<BusinessStatusResponseDto>(
        url,
        JSON.stringify(payload),
      );

      return res.data;
    } catch (e) {
      console.log('공공 API 요청 중 에러 발생:', e);
      throw new Error('사업자 상태 조회 실패');
    }
  }
}
