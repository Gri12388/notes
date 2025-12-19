import { createHash } from "crypto";
import type { MongoClient } from "mongodb";
import type { Creds, UrlOptions } from "../types.js";
import { getRecordOrUdf, getStringOrUdf } from "./checkers.js";

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
