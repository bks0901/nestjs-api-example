export function isNotFutureDate(dateStr?: string): boolean {
  if (!dateStr) return true;
  const now = new Date();
  return new Date(dateStr) <= now;
}
