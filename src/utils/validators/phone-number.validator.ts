export const isValidPhoneNumber: (input: unknown) => boolean = (input) => {
  if (typeof input !== 'string') return false;

  const patterns = [
    /^010-\d{4}-\d{4}$/, // 010-1234-5678
    /^01[16789]-\d{3}-\d{4}$/, // 011/016/017/018/019-123-4567
  ];

  return patterns.some((pattern) => pattern.test(input));
};
