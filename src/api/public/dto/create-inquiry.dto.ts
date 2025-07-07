import { IsEnum, IsOptional, IsBoolean, ValidateBy, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EIndustryType } from 'src/constants/industry-type.enum';
import { isValidPhoneNumber } from '@utils/validators/phone-number.validator';
import { isValidBusinessNumber } from '@utils/validators/business-number.validator';

export class CreateInquiryDto {
  @ApiProperty({ description: '사업자 등록 번호(10자리 숫자, null 가능' })
  @Transform(({ value }: { value: unknown }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return value;
  })
  @IsOptional()
  @ValidateBy({
    name: 'isValidBusinessNumber',
    validator: {
      validate: isValidBusinessNumber,
      defaultMessage: () => '유효한 사업자 등록번호를 입력해주세요.',
    },
  })
  businessNumber?: string;

  @ApiProperty({ description: '업종 분류' })
  @IsEnum(EIndustryType, { message: '업종 항목이 유효하지 않습니다.' })
  industry: EIndustryType;

  @ApiProperty({ description: '휴대폰 번호' })
  @IsString()
  @ValidateBy({
    name: 'isValidPhoneNumber',
    validator: {
      validate(value: unknown): boolean {
        return isValidPhoneNumber(value);
      },
      defaultMessage: () => '유효한 휴대폰 번호를 입력해주세요.',
    },
  })
  phoneNumber: string;

  @ApiProperty({ description: '마케팅 수신 동의' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  agreeMarketing: boolean;
}
