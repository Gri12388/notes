import { ObjectId, type Document, type WithId } from "mongodb";
import type { FindResult, Session } from "../types.js";
import { COLLECTIONS, DATABASE, NOT_FOUND, NOTHING, TECH_ERROR } from "../constants.js";
import { getCollection } from "./common.js";
import { DB } from "../classes/DB.js";
import { getPasswordOrUdf, getSessionOrUdf } from "./checkers.js";

export const createSession = async (session: Session) => {
  let result = NOTHING;

  const mongo = DB.getInstance().getMongo();
  if (mongo) {
    const collection = await getCollection(mongo, DATABASE, COLLECTIONS.sessions);
    const { insertedId } = await collection.insertOne(session);
    result = insertedId.toString();
  }

  return result;
};

export const setCredential = async (login: string, password: string) => {
  let result = false;

  const mongo = DB.getInstance().getMongo();
  if (mongo) {
    try {
      const collection = await getCollection(mongo, DATABASE, COLLECTIONS.creds);
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

export const findPassword = async (user: string) => {
  let result: FindResult<string> = NOT_FOUND;

  const mongo = DB.getInstance().getMongo();
  if (mongo) {
    try {
      const collection = await getCollection(mongo, DATABASE, COLLECTIONS.creds);
      const document = await collection.findOne({ user }, { projection: { password: 1, _id: 0 } });
      if (document) {
        const password = getPasswordOrUdf(document);
        result = password ? { found: password } : TECH_ERROR;
      }
    } catch (error) {
      result = TECH_ERROR;
    } finally {
      await mongo.close();
    }
  }

  return result;
};

export const findSession = async (sessionId: string) => {
  let result: FindResult<Session> = NOT_FOUND;

  const mongo = DB.getInstance().getMongo();
  if (mongo) {
    try {
      const id = new ObjectId(sessionId);
      const collection = await getCollection(mongo, DATABASE, COLLECTIONS.sessions);
      const document = await collection.findOne({ _id: id });
      if (document) {
        const session = getSessionOrUdf(document);
        result = session ? { found: session } : TECH_ERROR;
      }
    } catch (error) {
      result = TECH_ERROR;
    } finally {
      await mongo.close();
    }
  }

  return result;
};

export const findUser = async (user: string) => {
  let result: FindResult<WithId<Document>> = NOT_FOUND;

  const mongo = DB.getInstance().getMongo();
  if (mongo) {
    try {
      const collection = await getCollection(mongo, DATABASE, COLLECTIONS.creds);
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
