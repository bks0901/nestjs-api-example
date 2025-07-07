import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicApiService } from './public-api.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@ApiTags('Public API')
@Controller('public')
export class PublicApiController {
  constructor(private readonly publicApiService: PublicApiService) {}

  @ApiOperation({
    summary: '구매 상담 등록',
    description: '사용자가 입력한 정보로 새로운 구매 상담을 등록합니다.',
  })
  @ApiBody({ type: CreateInquiryDto })
  @ApiCreatedResponse({ description: '상담 등록 성공' })
  @Post('/inquiry')
  @HttpCode(201)
  async createInquiry(@Body() dto: CreateInquiryDto) {
    await this.publicApiService.createInquiry(dto);
  }
}
