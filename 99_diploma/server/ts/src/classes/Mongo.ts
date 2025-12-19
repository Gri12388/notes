import { MongoClient } from "mongodb";
import { CONNECTION_STRING } from "../constants.js";

export class Mongo {
  private static instance = new Mongo();

  private mongo = CONNECTION_STRING ? new MongoClient(CONNECTION_STRING) : undefined;

  private constructor() {}

  static getInstance() {
    return Mongo.instance;
  }

  getMongo() {
    return this.mongo;
  }
}
