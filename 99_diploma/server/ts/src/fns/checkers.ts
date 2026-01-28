import { AGE } from "../constants.js";
import type { List, Session, Note } from "../types.js";
import { isInt } from "./common.js";

export const checkString = (value: any) => (typeof value === "string" ? value : undefined);
export const checkNumber = (value: any) => (typeof value === "number" ? value : undefined);
export const checkBoolean = (value: any) => (typeof value === "boolean" ? value : undefined);

export const checkInt = (value: string) => (isInt(value) ? Number(value) : undefined);

export const checkRecord = (value: any) =>
  typeof value === "object" && value !== null ? (value as Record<string, any>) : undefined;

export const checkArray = <T>(value: unknown, checker: (value: unknown) => T | undefined) => {
  const result: T[] = [];

  if (Array.isArray(value)) {
    value.forEach((item) => {
      const checkedItem = checker(item);
      if (checkedItem !== undefined) result.push(checkedItem);
    });
  }

  return result;
};

export const checkSession = (value: unknown) => {
  let result: Session | undefined;

  if (typeof value === "object" && value !== null) {
    const user = "user" in value ? checkString(value.user) : undefined;
    const expire = "expire" in value ? checkNumber(value.expire) : undefined;

    if (user !== undefined && expire !== undefined) result = { user, expire };
  }

  return result;
};

export const getAgeOrUdf = (value: any) => {
  switch (value) {
    case AGE.allTime:
      return AGE.allTime;

    case AGE.archive:
      return AGE.archive;

    case AGE.oneMonth:
      return AGE.oneMonth;

    case AGE.threeMonth:
      return AGE.threeMonth;

    default:
      return undefined;
  }
};

export const checkList = (value: any) => {
  let result: List | undefined;

  if (typeof value === "object" && value !== null) {
    const age = "age" in value ? getAgeOrUdf(value.age) : undefined;
    const search = "search" in value ? checkString(value.search) : undefined;
    const page = "page" in value ? checkNumber(value.page) : undefined;

    result = { age: age ?? AGE.allTime, search: search ?? "", page: page ?? 1 };
  }

  return result;
};

export const checkNote = (value: any) => {
  let result: Note | undefined;

  if (typeof value === "object" && value !== null) {
    const id = "id" in value ? checkNumber(value.id) : undefined;
    const user = "user" in value ? checkString(value.user) : undefined;
    const title = "title" in value ? checkString(value.title) : undefined;
    const text = "text" in value ? checkString(value.text) : undefined;
    const isArchived = "isArchived" in value ? checkBoolean(value.isArchived) : undefined;
    const createdAt = "created_at" in value ? checkNumber(value.created_at) : undefined;

    if (title !== undefined && text !== undefined)
      result = {
        id: id ? id.toString() : "",
        user: user ?? "",
        title,
        text,
        isArchived: isArchived ?? false,
        createdAt: createdAt ?? 0,
      };
  }

  return result;
};
