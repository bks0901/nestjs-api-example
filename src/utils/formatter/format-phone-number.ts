export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  if (/^01[016789]\d{7,8}$/.test(digits)) {
    if (digits.length === 10) {
      // 예: 011-123-4567
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11) {
      // 예: 010-1234-5678
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    }
  }

  return phone;
}
