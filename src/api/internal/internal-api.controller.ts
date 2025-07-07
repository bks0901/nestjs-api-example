import { BadRequestException, Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InternalApiService } from './internal-api.service';
import { FindInquiriesDto } from './dto/find-inquiries.dto';
import { FindInquiriesResponseDto } from './dto/find-inquiries-response.dto';
import { isFromDateBeforeToDate } from '@utils/validators/is-from-date-before-to-date.validator';
import { FindInquiryResponseDto } from './dto/find-inquiry-response.dto';

@ApiTags('Internal API')
@Controller('internal')
export class InternalApiController {
  constructor(private readonly internalApiService: InternalApiService) {}

  @ApiOperation({
    summary: '상담 리스트 조회',
    description: '관리자용 상담 리스트를 조건에 따라 필터링하여 조회합니다.',
  })
  @ApiOkResponse({ type: FindInquiriesResponseDto, isArray: true, description: '조회된 상담 목록' })
  @Get('/inquiries')
  async getInquiries(@Query() dto: FindInquiriesDto) {
    if (dto.fromDate && dto.toDate) {
      if (!isFromDateBeforeToDate(dto.fromDate, dto.toDate)) {
        throw new BadRequestException('조회 시작일은 종료일보다 이전이어야 합니다.');
      }
    }

    return await this.internalApiService.getInquiries(dto);
  }

  @ApiOperation({
    summary: '상담 상세조회',
    description: '문의 ID를 기반으로 문의 내역과 요청자 정보를 상세조회합니다.',
  })
  @ApiOkResponse({ type: FindInquiryResponseDto, description: '문의 상세 조회' })
  @Get(':id')
  async getInquiry(@Param('id', ParseIntPipe) id: number) {
    return await this.internalApiService.getInquryById(id);
  }
}
