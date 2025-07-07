export interface BusinessStatusResponseDto {
  status_code: string;
  match_cnt: number;
  request_cnt: number;
  data: BusinessStatusItem[];
}

export interface BusinessStatusItem {
  b_no: string;
  b_stt: string;
  b_stt_cd: string;
  tax_type: string;
  tax_type_cd: string;
  end_dt: string;
  utcc_yn: string;
  tax_type_change_dt: string;
  invoice_apply_dt: string;
  rbf_tax_type: string;
  rbf_tax_type_cd: string;
}
