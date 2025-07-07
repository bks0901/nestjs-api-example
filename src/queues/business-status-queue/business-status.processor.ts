import { BusinessStatusService } from '@features/business-status/business-status.service';
import { BusinessRepository } from '@models/business/business.repository';
import { InjectQueue, OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { BusinessStatusJobPayload } from './interfaces/business-status-job-paload.interface';
import { ConfigService } from '@nestjs/config';
import { createHashJobId } from '@utils/id/business-status-retry-id';

@Processor('business-status-check')
export class BusinessStatusProcessor {
  constructor(
    private readonly businessStatusService: BusinessStatusService,
    private readonly businessRepo: BusinessRepository,
    private readonly configService: ConfigService,
    @InjectQueue('business-status-check') private readonly queue: Queue,
  ) {}

  @Process('check')
  async handleJob(job: Job<BusinessStatusJobPayload>) {
    const { businessNumbers, attempt = 0 } = job.data;
    const maxAttempts = this.configService.getOrThrow<number>(
      'public-api.nts-biz-reg-status.retry.max-attempts',
    );

    try {
      const results = await this.businessStatusService.getStatusForBusinessNumber(businessNumbers);

      if (!results || results.length === 0) {
        throw new Error('응답 결과가 비어 있음');
      }

      await this.businessRepo.bulkUpdateStatus(results);
      console.log(`업데이트 완료: ${results.length}건 상태 갱신`);
    } catch (error: unknown) {
      console.error(
        'API 요청 전체 실패:',
        error instanceof Error ? error.message : JSON.stringify(error),
      );

      if (attempt < maxAttempts) {
        const jobId = createHashJobId(businessNumbers, attempt);

        console.warn(
          `전체 요청 실패 → 재시도 예약 (${attempt + 1}/${maxAttempts}): ${businessNumbers.length}건`,
        );

        await this.queue.add(
          'check',
          {
            businessNumbers,
            attempt: attempt + 1,
          },
          {
            delay: 1000 * 60 * 5, // 5분 후 재시도
            backoff: { type: 'fixed', delay: 60 * 1000 }, // 1분 간격
            timeout: 10000, // 10초 내 응답 없으면 timeout
            jobId,
          },
        );
      } else {
        console.error(`최대 재시도 초과로 실패한 번호들: ${businessNumbers.join(', ')}`);
      }
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log('✅ Active Job:', job.id);
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    console.error('❌ Job Failed:', job.id, err.message);
  }
}
