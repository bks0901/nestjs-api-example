import { formatPhoneNumber } from '../format-phone-number';

describe('formatPhoneNumber', () => {
  it('should format 010 number correctly (4-4 split)', () => {
    expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678');
  });

  it('should format 011/016/017/018/019 numbers correctly (3-4 split)', () => {
    expect(formatPhoneNumber('0111234567')).toBe('011-123-4567');
    expect(formatPhoneNumber('0199876543')).toBe('019-987-6543');
  });

  it('should ignore hyphens and format properly', () => {
    expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678');
    expect(formatPhoneNumber('011-123-4567')).toBe('011-123-4567');
  });

  it('should return original input if format is invalid', () => {
    expect(formatPhoneNumber('01212345678')).toBe('01212345678');
    expect(formatPhoneNumber('010-123-4567')).toBe('010-123-4567');
  });

  it('should handle empty string gracefully', () => {
    expect(formatPhoneNumber('')).toBe('');
  });
});
