import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { BusinessEntity } from './business.entity';
import { SqlEntityManager } from '@mikro-orm/sqlite';
import { subDays } from 'date-fns';
import { IBusinessStatusCheckResult } from '@features/business-status/interfcaes/business-status-check-result.interface';

@Injectable()
export class BusinessRepository {
  constructor(
    private readonly em: EntityManager,
    private readonly se: SqlEntityManager,
  ) {}

  async create(inquiry: BusinessEntity): Promise<void> {
    this.em.persist(inquiry);
    await this.em.flush();
  }

  async findAll(): Promise<BusinessEntity[]> {
    return await this.em.find(BusinessEntity, {});
  }

  async findNeedCheckBusinessNumbers(intervalDays: number, batchSize: number): Promise<string[]> {
    const cutoffDate = subDays(new Date(), intervalDays);

    const rows = await this.se
      .createQueryBuilder(BusinessEntity)
      .select(['id', 'business_number as businessNumber'])
      .where({
        $or: [{ lastCheckedAt: { $lt: cutoffDate } }],
      })
      .limit(batchSize)
      .getResult();

    return rows.map((row) => row.businessNumber);
  }

  async bulkUpdateStatus(results: IBusinessStatusCheckResult[]): Promise<void> {
    if (results.length === 0) return;

    const now = new Date();

    const caseWhen = results.map(() => `WHEN ? THEN ?`).join(' ');

    const caseParams = results.flatMap(({ businessNumber, status }) => [businessNumber, status]);
    const businessNumbers = results.map((r) => r.businessNumber);

    const placeholders = businessNumbers.map(() => '?').join(', ');
    const sql = `
      UPDATE business
      SET status = CASE business_number
        ${caseWhen}
        ELSE status
      END,
      last_checked_at = ?
      WHERE business_number IN (${placeholders})
    `;

    await this.se.getConnection().execute(sql, [...caseParams, now, ...businessNumbers]);
  }
}
