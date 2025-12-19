import type { Session } from "../types.js";

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

export const getPasswordOrUdf = (value: unknown) => {
  let result: string | undefined;

  if (typeof value === "object" && value !== null) {
    const password = "password" in value ? getStringOrUdf(value.password) : undefined;

    if (password !== undefined) result = password;
  }

  return result;
};

export const getSessionOrUdf = (value: unknown) => {
  let result: Session | undefined;

  if (typeof value === "object" && value !== null) {
    const user = "user" in value ? getStringOrUdf(value.user) : undefined;
    const expire = "expire" in value ? getNumberOrUdf(value.expire) : undefined;

    if (user !== undefined && expire !== undefined) result = { user, expire };
  }

  return result;
};
