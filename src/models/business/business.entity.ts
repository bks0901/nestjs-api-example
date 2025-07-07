import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  OneToMany,
  Collection,
  Index,
  DateType,
} from '@mikro-orm/core';
import { InquiryEntity } from '@models/inquiry/inquiry.entity';
import { EBusinessStatus } from '@constants/business-status.enum';

@Entity({ tableName: 'business' })
@Index({ properties: ['status', 'lastCheckedAt'] })
export class BusinessEntity {
  @PrimaryKey({ name: 'id', autoincrement: true })
  id: number;

  @Property()
  businessNumber!: string;

  @Enum(() => EBusinessStatus)
  @Property({ nullable: true })
  status: EBusinessStatus | null = null;

  @Property()
  lastCheckedAt: Date = new Date(); // 휴폐업 상태 확인 일자

  @OneToMany(() => InquiryEntity, (inquiry) => inquiry.business)
  inquiries = new Collection<InquiryEntity>(this);

  @Property({
    type: DateType,
  })
  createdAt: Date = new Date();
}
