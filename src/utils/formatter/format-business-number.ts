export function formatBusinessNumber(bizNum: string): string {
  const digits = bizNum.replace(/\D/g, '');
  if (digits.length !== 10) return bizNum;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}
