import { createHash } from "crypto";
import { subMonths } from "date-fns";
import type { MongoClient } from "mongodb";
import type { Age, AgeData, Creds, UrlOptions } from "../types.js";
import { getRecordOrUdf, getStringOrUdf } from "./checkers.js";
import { AGE } from "../constants.js";

export const getCollection = async (mongo: MongoClient, dbName: string, collectionName: string) => {
  const client = await mongo.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  return collection;
};

export const hashText = (text: string) => createHash("sha256").update(text).digest("hex");

export const getCreds = (data: any) => {
  let result: Creds | undefined;
  const record = getRecordOrUdf(data);

  if (record) {
    const { username, password } = record;
    const temp = { username: getStringOrUdf(username), password: getStringOrUdf(password) };
    if (temp.username && temp.password) {
      result = {
        login: temp.username,
        password: temp.password,
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
    isArchive: false,
    timestamp: 0,
  };

  switch (age) {
    case AGE.archive:
      result.isArchive = true;
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
