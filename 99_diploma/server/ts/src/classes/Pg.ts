import knex from "knex";
import { PGCONFIG } from "../constants.js";

export class Pg {
  private static instance = new Pg();

  private pg = knex({
    client: "pg",
    connection: PGCONFIG,
  });

  private constructor() {}

  static getInstance() {
    return Pg.instance;
  }

  getPg() {
    return this.pg;
  }
}
