import { createHash } from 'crypto';

/**
 * 동일한 businessNumbers 조합에 대해 고정된 jobId를 생성
 */
export function createHashJobId(businessNumbers: string[], attempt: number): string {
  const base = [...businessNumbers].sort().join(',');
  const hash = createHash('sha256').update(base).digest('hex');
  return `retry-${attempt}-${hash}`;
}
