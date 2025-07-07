import {
  Collection,
  DateType,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BusinessEntity } from '@models/business/business.entity';
import { ConsultLogEntity } from '@models/consult-log/consult-log.entity';
import { EInquiryStatus } from '@constants/inquiry-status.enum';

@Entity({ tableName: 'inquiry' })
@Index({ properties: ['status', 'createdAt'] })
export class InquiryEntity {
  @PrimaryKey({ name: 'id', autoincrement: true })
  id: number;

  @Property({ index: true })
  phoneNumber: string;

  @ManyToOne(() => BusinessEntity, { nullable: true })
  business?: BusinessEntity;

  @Property()
  industry!: string; // 업종명

  @Property()
  marketingAgreement: boolean;

  @Property({ type: DateType })
  createdAt: Date = new Date();

  @Enum(() => EInquiryStatus)
  status: EInquiryStatus = EInquiryStatus.WAITING;

  @Property({ nullable: true })
  source?: string;

  @OneToMany(() => ConsultLogEntity, (log) => log.inquiry)
  consultLogs = new Collection<ConsultLogEntity>(this);
}
