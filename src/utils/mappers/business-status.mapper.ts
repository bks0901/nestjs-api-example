import { EBusinessStatus } from '../../constants/business-status.enum';
import { INVALID_TAX_TYPE_MESSAGE } from '../../constants/public-api.constant';

// 사업자등록 상태조회 API 참고
// - b_stt_cd(string): 납세자상태 코드
//    01: 계속사업자
//    02: 휴업자
//    03: 폐업자
// - tax_type(string): 과세유형 메시지
//    * 유효하지 않은 번호인 경우: "국세청에 등록되지 않은 사업자등록번호입니다"

export function mapStatusCodeToBusinessStatus(code?: string, taxType?: string): EBusinessStatus {
  if (taxType === INVALID_TAX_TYPE_MESSAGE) {
    return EBusinessStatus.UNKNOWN;
  } else {
    return parseStatusCode(code);
  }
}

function parseStatusCode(code?: string): EBusinessStatus {
  switch (code) {
    case '01':
      return EBusinessStatus.ACTIVE;
    case '02':
      return EBusinessStatus.SUSPENDED;
    case '03':
      return EBusinessStatus.CLOSED;
    default:
      return EBusinessStatus.UNKNOWN;
  }
}
