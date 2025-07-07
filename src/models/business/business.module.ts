import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { BusinessEntity } from './business.entity';
import { BusinessRepository } from './business.repository';

@Global()
@Module({
  imports: [MikroOrmModule.forFeature([BusinessEntity])],
  providers: [BusinessRepository],
  exports: [BusinessRepository],
})
export class BusinessRepositoryModule {}
