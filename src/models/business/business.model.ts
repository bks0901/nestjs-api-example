import { EBusinessStatus } from '@constants/business-status.enum';
import { mapStatusCodeToBusinessStatus } from '@utils/mappers/business-status.mapper';
import { IBusinessModel } from './business.interface';
import { BusinessEntity } from './business.entity';

export class BusinessModel {
  private readonly _businessNumber: string;
  private _status: EBusinessStatus | null = null;

  constructor(props: IBusinessModel) {
    this._businessNumber = props.businessNumber;
  }

  setStatus(code: string, textType?: string): void {
    this._status = mapStatusCodeToBusinessStatus(code, textType);
  }

  get businessNumber(): string {
    return this._businessNumber;
  }

  get status(): EBusinessStatus | null {
    return this._status;
  }

  isActivate(): boolean {
    return this._status === EBusinessStatus.ACTIVE;
  }

  isVerified(): boolean {
    return this._status !== null && this._status !== EBusinessStatus.UNKNOWN;
  }

  toEntity(): BusinessEntity {
    const entity = new BusinessEntity();
    entity.businessNumber = this._businessNumber;
    entity.status = this._status ?? null;
    return entity;
  }
}
