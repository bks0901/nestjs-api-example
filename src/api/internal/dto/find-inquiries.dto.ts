import { EInquiryStatus } from '@constants/inquiry-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotFutureDate } from '@utils/decorators/is-not-future-date.decorator';
import { IsValidDateString } from '@utils/decorators/is-valid-date-string.decorator';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindInquiriesDto {
  @ApiProperty({ required: false, type: String, description: '사용자 전화번호' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ required: false, enum: EInquiryStatus, description: '상담 상태 필터' })
  @IsOptional()
  @IsEnum(EInquiryStatus)
  status?: EInquiryStatus;

  @ApiProperty({ required: false, type: Date, description: '조회 시작일 (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  @IsValidDateString()
  @IsNotFutureDate()
  fromDate?: string;

  @ApiProperty({ required: false, type: Date, description: '조회 종료일 (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  @IsValidDateString()
  @IsNotFutureDate()
  toDate?: string;

  @ApiProperty({ required: false, type: Number, description: '페이지 시작 위치' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number;

  @ApiProperty({ required: false, type: Number, description: '페이지당 개수' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
