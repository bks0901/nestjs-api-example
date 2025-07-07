import { formatBusinessNumber } from '../format-business-number';

describe('formatBusinessNumber', () => {
  it('should format 10-digit business number', () => {
    expect(formatBusinessNumber('1234567890')).toBe('123-45-67890');
  });

  it('should strip non-digit characters before formatting', () => {
    expect(formatBusinessNumber('123-45-67890')).toBe('123-45-67890');
  });

  it('should return original input if not 10 digits', () => {
    expect(formatBusinessNumber('123456789')).toBe('123456789');
    expect(formatBusinessNumber('12345678901')).toBe('12345678901');
  });

  it('should handle empty string gracefully', () => {
    expect(formatBusinessNumber('')).toBe('');
  });
});
