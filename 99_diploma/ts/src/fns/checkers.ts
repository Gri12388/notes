export const getStringOrUdf = (value: any) => (typeof value === "string" ? value : undefined);
export const getNumberOrUdf = (value: any) => (typeof value === "number" ? value : undefined);
export const getBooleanOrUdf = (value: any) => (typeof value === "boolean" ? value : undefined);

export const getRecordOrUdf = (value: any) =>
  typeof value === "object" && value !== null ? (value as Record<string, any>) : undefined;

export const getArray = <T>(value: unknown, checker: (value: unknown) => T | undefined) => {
  const result: T[] = [];

  if (Array.isArray(value)) {
    value.forEach((item) => {
      const checkedItem = checker(item);
      if (checkedItem !== undefined) result.push(checkedItem);
    });
  }

  return result;
};
