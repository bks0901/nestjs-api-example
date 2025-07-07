import { isValidPhoneNumber } from '../phone-number.validator';

describe('isValidPhoneNumber', () => {
  it('should return true for valid 010 format', () => {
    expect(isValidPhoneNumber('010-1234-5678')).toBe(true);
  });

  it('should return true for valid 011 format', () => {
    expect(isValidPhoneNumber('011-123-4567')).toBe(true);
  });

  it('should return false for wrong digit grouping', () => {
    expect(isValidPhoneNumber('010-123-4567')).toBe(false);
    expect(isValidPhoneNumber('010-12345-678')).toBe(false);
    expect(isValidPhoneNumber('010-123-45678')).toBe(false);
    expect(isValidPhoneNumber('010-1234-567')).toBe(false);
    expect(isValidPhoneNumber('010-1234-56789')).toBe(false);
  });

  it('should return false for non-string input', () => {
    expect(isValidPhoneNumber(null)).toBe(false);
    expect(isValidPhoneNumber(undefined)).toBe(false);
    expect(isValidPhoneNumber(1234567890)).toBe(false);
  });

  it('should return false for local number formats', () => {
    expect(isValidPhoneNumber('02-123-4567')).toBe(false);
  });

  it('should return false for numeric only input', () => {
    expect(isValidPhoneNumber('01012345678')).toBe(false);
  });
});
