export function isFromDateBeforeToDate(fromDate?: string, toDate?: string): boolean {
  if (!fromDate || !toDate) return true;
  return new Date(fromDate) <= new Date(toDate);
}
