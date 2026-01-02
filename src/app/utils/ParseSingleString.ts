/* Helper to get single string from query */
export const parseQueryParam = (value: any): string | undefined => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value[0];
  if (typeof value === "string") return value;
  return undefined;
};