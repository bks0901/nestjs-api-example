import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ConfigService } from '@nestjs/config';
import { BusinessStatusRunner } from './business-status.runner';

@Injectable()
export class BusinessStatusBatch implements OnModuleInit {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
    private readonly businessStatusRunner: BusinessStatusRunner,
  ) {}

  // 해당 클래스가 생성된 직후 동작
  onModuleInit() {
    const cronSchedule = this.configService.getOrThrow<string>(
      'public-api.nts-biz-reg-status.cron-schedule',
    );
    const job: CronJob = new CronJob(cronSchedule, async () => {
      await this.businessStatusRunner.execute();
    });

    this.schedulerRegistry.addCronJob('nts-biz-status-check', job);
    job.start();
  }
}
