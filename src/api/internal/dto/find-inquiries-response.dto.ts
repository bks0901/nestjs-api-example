import { EIndustryType } from '@constants/industry-type.enum';
import { EInquiryStatus } from '@constants/inquiry-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { formatBusinessNumber } from '@utils/formatter/format-business-number';
import { formatPhoneNumber } from '@utils/formatter/format-phone-number';

export interface IInquiriesWithBusinessRawQuery {
  id: number;
  status: EInquiryStatus;
  industry: string;
  phoneNumber: string;
  createdAt: number;
  businessNumber: string | null;
}

export class FindInquiriesResponseDto {
  @ApiProperty({ example: 1, description: '문의 ID' })
  id: number;

  @ApiProperty({ example: '010-1234-5678', description: '문의자 연락처' })
  phoneNumber: string;

  @ApiProperty({
    enum: EIndustryType,
    description: '산업군 (도소매, 건설업 등)',
    example: '도소매',
  })
  industry: EIndustryType;

  @ApiProperty({
    enum: EInquiryStatus,
    description: '문의 상태',
    example: 'waiting',
  })
  status: EInquiryStatus;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: '문의 생성일',
    example: '2025-06-20T12:34:56.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '123-45-67890',
    description: '사업자 등록번호',
    nullable: true,
  })
  businessNumber: string | null = null;

  constructor(row: IInquiriesWithBusinessRawQuery) {
    this.id = row.id;
    this.status = row.status;
    this.phoneNumber = formatPhoneNumber(row.phoneNumber);
    this.industry = row.industry as EIndustryType;
    this.createdAt = new Date(row.createdAt);

    if (row.businessNumber) {
      this.businessNumber = formatBusinessNumber(row.businessNumber);
    }
  }
}
