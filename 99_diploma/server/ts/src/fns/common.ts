import { createHash } from "crypto";
import { subMonths } from "date-fns";
import type { Age, AgeData, Creds, UrlOptions } from "../types.js";
import { checkRecord, checkString } from "./checkers.js";
import { AGE } from "../constants.js";

export const hashText = (text: string) => createHash("sha256").update(text).digest("hex");

export const getCreds = (data: any) => {
  let result: Creds | undefined;
  const record = checkRecord(data);

  if (record) {
    const username = checkString(record.username);
    const password = checkString(record.password);
    if (username && password) {
      result = {
        login: username,
        password,
      };
    }
  }

  return result;
};

export const getUrl = (options: UrlOptions) => {
  const { origin, path, search } = options;
  const url = new URL(path, origin);
  search.forEach((item) => {
    url.searchParams.set(item.name, item.value);
  });

  return url;
};

export const getAgeData = (age: Age) => {
  let result: AgeData = {
    isArchived: false,
    timestamp: 0,
  };

  switch (age) {
    case AGE.archive:
      result.isArchived = true;
      break;

    case AGE.oneMonth:
      result.timestamp = subMonths(Date.now(), 1).getTime();
      break;

    case AGE.threeMonth:
      result.timestamp = subMonths(Date.now(), 3).getTime();
      break;
  }

  return result;
};

export const getOffset = (page: number) => {
  let result = 0;

  if (page > 1) result = page - 1;

  return result;
};

export const isInt = (value: string) => /^\d+$/.test(value);
