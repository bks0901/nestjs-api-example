import { stripHyphens } from '../strip-hyphens';

describe('stripHyphens', () => {
  it('removes hyphens from a phone number', () => {
    expect(stripHyphens('010-1234-5678')).toBe('01012345678');
    expect(stripHyphens('123-456')).toBe('123456');
  });

  it('returns the original string if no hyphens are present', () => {
    expect(stripHyphens('01012345678')).toBe('01012345678');
  });

  it('returns an empty string if input is empty', () => {
    expect(stripHyphens('')).toBe('');
  });
});
