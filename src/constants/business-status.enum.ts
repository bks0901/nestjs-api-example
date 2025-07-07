export enum EBusinessStatus {
  ACTIVE = 'active', // 영업중
  SUSPENDED = 'suspended', // 휴업
  CLOSED = 'closed', // 폐업
  UNKNOWN = 'unknown', // 실존하지 않거나 조회 실패. 재검증 대상으로 활용하거나, 잦은 경우 허위탐지 리포트에 할용된다
}
