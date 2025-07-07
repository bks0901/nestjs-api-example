import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { Module } from '@nestjs/common';
import { InternalApiModule } from '@api/internal/internal-api.module';
import { PublicApiModule } from '@api/public/public-api.module';
import { InquiryEntity } from '@models/inquiry/inquiry.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@config/configuration';
import { BusinessStatusBatchModule } from '@batch/business-status/business-status.module';
import { BusinessStatusModule } from '@features/business-status/business-status.module';
import { BullModule } from '@nestjs/bull';
import { BusinessStatusQueueModule } from './queues/business-status-queue/business-status-queue.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV || 'development'}`,
      load: [configuration],
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dbName: configService.get<string>('db.name'),
        driver: SqliteDriver,
        allowGlobalContext: true,
        entities: [InquiryEntity],
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        },
      }),
    }),
    ScheduleModule.forRoot(),
    InternalApiModule,
    PublicApiModule,
    BusinessStatusBatchModule,
    BusinessStatusModule,
    BusinessStatusQueueModule,
  ],
})
export class AppModule {}
