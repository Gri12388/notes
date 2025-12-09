import { MongoClient } from "mongodb";
import { CONNECTION_STRING } from "../constants.js";

export class DB {
  private static instance = new DB();

  private mongo = CONNECTION_STRING ? new MongoClient(CONNECTION_STRING) : undefined;

  private constructor() {}

  static getInstance() {
    return DB.instance;
  }

  getMongo() {
    return this.mongo;
  }
}
