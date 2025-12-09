import { createHash } from "crypto";
import type { Document, WithId } from "mongodb";
import { DB } from "../classes/DB.js";
import { COLLECTIONS, DATABASE, NOT_FOUND, TECH_ERROR } from "../constants.js";
import type { Creds, FindResult, UrlOptions } from "../types.js";
import { getRecordOrUdf, getStringOrUdf } from "./checkers.js";

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

export const findUser = async (user: string) => {
  let result: FindResult<WithId<Document>> = NOT_FOUND;

  const mongo = DB.getInstance().getMongo();
  if (mongo) {
    try {
      const client = await mongo.connect();
      const db = client.db(DATABASE);
      const collection = db.collection(COLLECTIONS.creds);
      const document = await collection.findOne({ user });
      if (document) result = { found: document };
    } catch (error) {
      result = TECH_ERROR;
    } finally {
      await mongo.close();
    }
  }

  return result;
};

export const setCredential = async (login: string, password: string) => {
  let result = false;

  const mongo = DB.getInstance().getMongo();
  if (mongo) {
    try {
      await mongo.connect();
      const db = mongo.db(DATABASE);
      const collection = db.collection(COLLECTIONS.creds);
      const data = { user: login, password };
      const { acknowledged } = await collection.insertOne(data);
      result = acknowledged;
    } catch {
      result = false;
    } finally {
      await mongo.close();
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
