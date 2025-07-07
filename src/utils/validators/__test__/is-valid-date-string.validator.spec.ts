import { isValidDateString } from '../is-valid-date-string.validator';

describe('isValidDateString', () => {
  it('returns false for non-strings', () => {
    expect(isValidDateString(undefined)).toBe(false);
    expect(isValidDateString(null as any)).toBe(false);
    expect(isValidDateString(123 as any)).toBe(false);
  });

  it('returns false for wrongly formatted or invalid dates', () => {
    expect(isValidDateString('2025/01/01')).toBe(false);
    expect(isValidDateString('01-01-2025')).toBe(false);
    expect(isValidDateString('invalid-date')).toBe(false);
    expect(isValidDateString('2025-02-30')).toBe(false);
    expect(isValidDateString('2025-13-01')).toBe(false);
  });

  it('returns true for correct YYYY-MM-DD format', () => {
    expect(isValidDateString('2025-01-01')).toBe(true);
    expect(isValidDateString('2000-12-31')).toBe(true);
  });
});
