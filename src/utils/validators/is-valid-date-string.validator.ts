export function isValidDateString(value?: string): boolean {
  if (typeof value !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(value);
  if (isNaN(date.getTime())) return false;

  // 날짜가 실제로 존재하는지 확인
  const [year, month, day] = value.split('-').map(Number);
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month && date.getUTCDate() === day
  );
}
