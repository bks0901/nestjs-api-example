import { mapStatusCodeToBusinessStatus } from '../business-status.mapper';
import { EBusinessStatus } from '../../../constants/business-status.enum';
import { INVALID_TAX_TYPE_MESSAGE } from '../../../constants/public-api.constant';

describe('mapStatusCodeToBusinessStatus', () => {
  it('returns UNKNOWN if taxType is an invalid message', () => {
    const result = mapStatusCodeToBusinessStatus('01', INVALID_TAX_TYPE_MESSAGE);
    expect(result).toBe(EBusinessStatus.UNKNOWN);
  });

  it('returns the correct enum value for valid codes', () => {
    expect(mapStatusCodeToBusinessStatus('01')).toBe(EBusinessStatus.ACTIVE);
    expect(mapStatusCodeToBusinessStatus('02')).toBe(EBusinessStatus.SUSPENDED);
    expect(mapStatusCodeToBusinessStatus('03')).toBe(EBusinessStatus.CLOSED);
  });

  it('returns UNKNOWN when status code is invalid but taxType is valid', () => {
    const result = mapStatusCodeToBusinessStatus('99', '부가가치세 일반과세자');
    expect(result).toBe(EBusinessStatus.UNKNOWN);

    expect(
      mapStatusCodeToBusinessStatus(undefined, '국세청에 등록되지 않은 사업자등록번호입니다'),
    ).toBe(EBusinessStatus.UNKNOWN);
  });

  it('returns UNKNOWN when both code and taxType are undefined', () => {
    expect(mapStatusCodeToBusinessStatus(undefined, undefined)).toBe(EBusinessStatus.UNKNOWN);
  });
});
