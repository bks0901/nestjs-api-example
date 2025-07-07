import { BusinessStatusService } from '@features/business-status/business-status.service';
import { BusinessStatusApiClient } from '../business-status.api';
import { EBusinessStatus } from '@constants/business-status.enum';
import { INVALID_TAX_TYPE_MESSAGE } from '@constants/public-api.constant';

jest.mock('@utils/mappers/business-status.mapper', () => ({
  mapStatusCodeToBusinessStatus: jest.fn((code: string, taxType: string) => {
    if (taxType.includes(INVALID_TAX_TYPE_MESSAGE)) return EBusinessStatus.UNKNOWN;
    if (code === '01') return EBusinessStatus.ACTIVE;
    if (code === '02') return EBusinessStatus.SUSPENDED;
    if (code === '03') return EBusinessStatus.CLOSED;
    return EBusinessStatus.UNKNOWN;
  }),
}));

describe('BusinessStatusService - Parsing', () => {
  let service: BusinessStatusService;
  let apiClient: jest.Mocked<BusinessStatusApiClient>;

  beforeEach(() => {
    apiClient = {
      checkStatus: jest.fn(),
    } as unknown as jest.Mocked<BusinessStatusApiClient>;

    service = new BusinessStatusService(apiClient);
  });

  it('should parse API result into business status list', async () => {
    const mockResponse = [
      {
        b_no: '1111111111',
        b_stt_cd: '01',
        tax_type: '일반과세자',
        b_stt: '',
        tax_type_cd: '',
        end_dt: '',
        utcc_yn: 'Y',
        tax_type_change_dt: '',
        invoice_apply_yn: '',
        invoice_apply_dt: '',
        rbf_tax_type: '',
        rbf_tax_type_cd: '',
      },
      {
        b_no: '2222222222',
        b_stt_cd: '02',
        tax_type: '간이과세자',
        b_stt: '',
        tax_type_cd: '',
        end_dt: '',
        utcc_yn: 'N',
        tax_type_change_dt: '',
        invoice_apply_yn: '',
        invoice_apply_dt: '',
        rbf_tax_type: '',
        rbf_tax_type_cd: '',
      },
      {
        b_no: '3333333333',
        b_stt_cd: '03',
        tax_type: '면세사업자',
        b_stt: '',
        tax_type_cd: '',
        end_dt: '',
        utcc_yn: 'Y',
        tax_type_change_dt: '',
        invoice_apply_yn: '',
        invoice_apply_dt: '',
        rbf_tax_type: '',
        rbf_tax_type_cd: '',
      },
      {
        b_no: '4444444444',
        b_stt_cd: '',
        tax_type: '국세청에 등록되지 않은 사업자등록번호입니다',
        b_stt: '',
        tax_type_cd: '',
        end_dt: '',
        utcc_yn: 'Y',
        tax_type_change_dt: '',
        invoice_apply_yn: '',
        invoice_apply_dt: '',
        rbf_tax_type: '',
        rbf_tax_type_cd: '',
      },
    ];

    apiClient.checkStatus.mockResolvedValue({
      status_code: '',
      match_cnt: 0,
      request_cnt: 0,
      data: mockResponse,
    });

    const result = await service.getStatusForBusinessNumber([
      '1111111111',
      '2222222222',
      '3333333333',
      '4444444444',
    ]);

    expect(result).toEqual([
      { businessNumber: '1111111111', status: EBusinessStatus.ACTIVE },
      { businessNumber: '2222222222', status: EBusinessStatus.SUSPENDED },
      { businessNumber: '3333333333', status: EBusinessStatus.CLOSED },
      { businessNumber: '4444444444', status: EBusinessStatus.UNKNOWN },
    ]);
  });
});
