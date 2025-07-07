export const isValidBusinessNumber: (input: unknown) => boolean = (input) => {
  if (typeof input !== 'string') return false;
  return /^\d{3}-\d{2}-\d{5}$/.test(input);
};
