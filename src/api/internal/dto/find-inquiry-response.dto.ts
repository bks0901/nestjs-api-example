import { ApiProperty } from '@nestjs/swagger';
import { EIndustryType } from '@constants/industry-type.enum';
import { EInquiryStatus } from '@constants/inquiry-status.enum';
import { BusinessEntity } from '@models/business/business.entity';
import { ConsultLogEntity } from '@models/consult-log/consult-log.entity';
import { InquiryEntity } from '@models/inquiry/inquiry.entity';
import { formatBusinessNumber } from '@utils/formatter/format-business-number';
import { formatPhoneNumber } from '@utils/formatter/format-phone-number';
import { EConsultLogStatus } from '@constants/consult-log-status.enum';
import { EBusinessStatus } from '@constants/business-status.enum';

export class ConsultLogDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ nullable: true, type: String, example: null })
  memo: string | null;

  @ApiProperty({ enum: EConsultLogStatus })
  status: string;

  @ApiProperty({ type: Date, nullable: true })
  scheduledAt: Date | null;

  @ApiProperty({ type: Date, nullable: true })
  completedAt: Date | null;

  @ApiProperty({ type: Date, nullable: true })
  canceledAt: Date | null;

  @ApiProperty({ type: Date })
  createdAt: Date;

  constructor(row: ConsultLogEntity) {
    this.id = row.id;
    this.memo = row.memo || null;
    this.status = row.status;
    this.scheduledAt = row.scheduledAt || null;
    this.completedAt = row.completedAt || null;
    this.canceledAt = row.canceledAt || null;
    this.createdAt = row.createdAt;
  }
}

export class BusinessDto {
  @ApiProperty({
    example: '123-45-67890',
    description: '사업자 등록번호',
  })
  businessNumber: string;

  @ApiProperty({ nullable: true, enum: EBusinessStatus })
  status: string | null;

  @ApiProperty({ type: Date })
  lastCheckedAt: Date;

  @ApiProperty({ type: Date })
  createdAt: Date;

  constructor(row: BusinessEntity) {
    this.businessNumber = formatBusinessNumber(row.businessNumber);
    this.status = row.status;
    this.lastCheckedAt = row.lastCheckedAt;
    this.createdAt = row.createdAt;
  }
}

export class FindInquiryResponseDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ example: '010-1234-5678', description: '문의자 연락처' })
  phoneNumber: string;

  @ApiProperty({ enum: EInquiryStatus })
  status: EInquiryStatus;

  @ApiProperty({ enum: EIndustryType })
  industry: EIndustryType;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: BusinessDto, nullable: true })
  business: BusinessDto | null;

  @ApiProperty({ type: [ConsultLogDto] })
  consultLogs: ConsultLogDto[];

  constructor(row: InquiryEntity) {
    this.id = row.id;
    this.phoneNumber = formatPhoneNumber(row.phoneNumber);
    this.status = row.status;
    this.createdAt = new Date(row.createdAt);
    this.industry = row.industry as EIndustryType;
    this.business = row.business ? new BusinessDto(row.business) : null;
    this.consultLogs = row.consultLogs
      ? row.consultLogs.getItems().map((log) => new ConsultLogDto(log))
      : [];
  }
}
