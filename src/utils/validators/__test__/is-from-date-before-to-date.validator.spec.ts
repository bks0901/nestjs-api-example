import { isFromDateBeforeToDate } from '../is-from-date-before-to-date.validator';

describe('isFromDateBeforeToDate', () => {
  it('returns true if either date is missing', () => {
    expect(isFromDateBeforeToDate(undefined, '2025-01-01')).toBe(true);
    expect(isFromDateBeforeToDate('2025-01-01', undefined)).toBe(true);
    expect(isFromDateBeforeToDate(undefined, undefined)).toBe(true);
  });

  it('returns true if fromDate is before or equal to toDate', () => {
    expect(isFromDateBeforeToDate('2025-01-01', '2025-01-02')).toBe(true);
    expect(isFromDateBeforeToDate('2025-01-01', '2025-01-01')).toBe(true);
  });

  it('returns false if fromDate is after toDate', () => {
    expect(isFromDateBeforeToDate('2025-01-02', '2025-01-01')).toBe(false);
  });
});
