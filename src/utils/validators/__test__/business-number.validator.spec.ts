import { isValidBusinessNumber } from '../business-number.validator';

describe('isValidBusinessNumber', () => {
  it('should return true for valid business number format', () => {
    expect(isValidBusinessNumber('123-45-67890')).toBe(true);
  });

  it('should return false for invalid formats', () => {
    expect(isValidBusinessNumber('1234567890')).toBe(false);
    expect(isValidBusinessNumber('12-345-67890')).toBe(false);
    expect(isValidBusinessNumber('123-456-7890')).toBe(false);
    expect(isValidBusinessNumber('abc-de-fghij')).toBe(false);
  });

  it('should return false for non-string inputs', () => {
    expect(isValidBusinessNumber(1234567890)).toBe(false);
    expect(isValidBusinessNumber(null)).toBe(false);
    expect(isValidBusinessNumber(undefined)).toBe(false);
    expect(isValidBusinessNumber({})).toBe(false);
  });
});
