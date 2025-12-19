import { MongoError, ObjectId, type Document, type WithId } from "mongodb";
import type { CollectionName, FindResult, Session } from "../types.js";
import { COLLECTIONS, DATABASE, NOT_FOUND, NOT_UNIQUE, NOTHING, TECH_ERROR, USER } from "../constants.js";
import { getCollection } from "./common.js";
import { Mongo } from "../classes/Mongo.js";
import { getPasswordOrUdf, getSessionOrUdf } from "./checkers.js";

export const deleteSession = async (sessionId: string) => {
  let result = false;

  const mongo = Mongo.getInstance().getMongo();
  if (mongo) {
    try {
      const id = new ObjectId(sessionId);
      const collection = await getCollection(mongo, DATABASE, COLLECTIONS.sessions);
      const { acknowledged } = await collection.deleteOne({ _id: id });
      result = acknowledged;
    } catch (error) {
      result = false;
    } finally {
      await mongo.close();
    }
  }

  return result;
};

export const setCredential = async (login: string, password: string) => {
  let result = NOTHING;

  const mongo = Mongo.getInstance().getMongo();
  if (mongo) {
    try {
      const collection = await getCollection(mongo, DATABASE, COLLECTIONS.creds);
      const data = { user: login, password };
      const { acknowledged } = await collection.insertOne(data);
      result = acknowledged.toString();
    } catch (error) {
      if (error instanceof MongoError && error.code && error.code.toString() === NOT_UNIQUE) {
        result = NOT_UNIQUE;
      } else {
        result = NOTHING;
      }
    } finally {
      await mongo.close();
    }
  }

  return result;
};

export const findPassword = async (user: string) => {
  let result: FindResult<string> = NOT_FOUND;

  const mongo = Mongo.getInstance().getMongo();
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

  const mongo = Mongo.getInstance().getMongo();
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

  const mongo = Mongo.getInstance().getMongo();
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

export const createSession = async (session: Session) => {
  let result = NOTHING;

  const mongo = Mongo.getInstance().getMongo();
  if (mongo) {
    try {
      const collection = await getCollection(mongo, DATABASE, COLLECTIONS.sessions);
      const document = await collection.findOne({ user: session.user });
      if (document) await collection.deleteOne({ user: session.user });
      const { insertedId } = await collection.insertOne(session);
      result = insertedId.toString();
    } finally {
      await mongo.close();
    }
  }

  return result;
};

export const setIndex = async (collectionName: CollectionName, indexName: string) => {
  let result = false;
  const mongo = Mongo.getInstance().getMongo();
  if (mongo) {
    try {
      const client = await mongo.connect();
      const db = client.db(DATABASE);
      const isCollection = await db.listCollections({ name: collectionName }).hasNext();
      if (isCollection) {
        const collection = db.collection(collectionName);
        const isIndex = await collection.indexExists(USER);
        if (!isIndex) {
          await collection.createIndex({ user: 1 }, { unique: true, name: indexName });
        }
      } else {
        const collection = await db.createCollection(collectionName);
        await collection.createIndex({ user: 1 }, { unique: true, name: indexName });
      }

      result = true;
    } catch (error) {
      console.error("[error]:", error);
    } finally {
      await mongo.close();
    }
  }
  return result;
};
