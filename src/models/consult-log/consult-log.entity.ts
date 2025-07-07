import { DateType, Entity, Enum, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { InquiryEntity } from '@models/inquiry/inquiry.entity';
import { EConsultLogStatus } from '@constants/consult-log-status.enum';

@Entity({ tableName: 'consult_log' })
@Index({ properties: ['status', 'canceledAt'] })
@Index({ properties: ['status', 'scheduledAt'] })
@Index({ properties: ['status', 'completedAt'] })
export class ConsultLogEntity {
  @PrimaryKey({ name: 'id', autoincrement: true })
  id: number;

  @ManyToOne(() => InquiryEntity)
  inquiry: InquiryEntity;

  @Property()
  consultantName: string;

  @Enum(() => EConsultLogStatus)
  status: EConsultLogStatus.PENDING;

  @Property({ nullable: true, index: true, type: DateType })
  scheduledAt?: Date; // SCHEDULED 상태일 때 상담 예정일

  @Property({ nullable: true, index: true, type: DateType })
  completedAt?: Date; // COMPLETED일 때 상담 완료 시점

  @Property({ nullable: true, index: true, type: DateType })
  canceledAt?: Date; // CANCELED 때 상담 완료 시점

  @Property({ nullable: true })
  memo?: string;

  @Property({ type: DateType })
  createdAt: Date = new Date();

  validateStatusConsistency() {
    const status = this.status as EConsultLogStatus;

    if (status === EConsultLogStatus.COMPLETED && !this.completedAt) {
      throw new Error('COMPLETED 상태일 때 completedAt이 필요합니다.');
    }
    if (status === EConsultLogStatus.CANCELED && !this.canceledAt) {
      throw new Error('CANCELED 상태일 때 canceledAt이 필요합니다.');
    }
    if (status === EConsultLogStatus.SCHEDULED && !this.scheduledAt) {
      throw new Error('SCHEDULED 상태일 때 scheduledAt이 필요합니다.');
    }
  }
}
