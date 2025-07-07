export const stripHyphens = (phone: string): string => {
  return phone.replace(/-/g, '');
};
