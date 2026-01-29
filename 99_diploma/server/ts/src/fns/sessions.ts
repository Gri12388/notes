import { DatabaseError } from "pg";
import { Pg } from "../classes/Pg.js";
import { NOT_FOUND, NOTHING, PGERRORS, SCHEMA, TABLES, UNIQUE_VIOLATION } from "../constants.js";
import { locale } from "../locale.js";
import type { Session } from "../types.js";
import { checkNumber, checkSessionDb } from "./checkers.js";
import { mapSession } from "./mappers.js";

export const configSessions = async () => {
  let result = false;

  try {
    const db = Pg.getInstance().getPg();

    const isSessions = await db.schema.withSchema(SCHEMA.public).hasTable(TABLES.sessions);

    if (isSessions) result = true;
    else {
      await db.schema.withSchema(SCHEMA.public).createTable(TABLES.sessions, (table) => {
        table.increments("id").primary();
        table.string("user").notNullable().unique();
        table.bigInteger("expire").notNullable();
      });

      result = true;
    }
  } catch (error) {
    console.error(`[error]: ${error}`);
  }

  return result;
};

export const setSession = async (user: string, expire: number) => {
  let result = NOTHING;

  try {
    const db = Pg.getInstance().getPg();

    const rows = await db(TABLES.sessions).withSchema(SCHEMA.public).insert(
      [
        {
          user,
          expire,
        },
      ],
      ["id"],
    );

    if (rows.length > 0) result = checkNumber(rows[0].id)?.toString() ?? NOTHING;
    else console.warn("[warn", locale.emptyArray);
  } catch (error) {
    if (error instanceof DatabaseError) {
      switch (error.code) {
        case PGERRORS.uniqueViolation:
          result = UNIQUE_VIOLATION;
          break;
      }
    }

    console.error(`[error]: ${error}`);
  }

  return result;
};

export const findSession = async (id: string) => {
  let result: Session | string = NOTHING;

  try {
    const db = Pg.getInstance().getPg();

    const rows = await db(TABLES.sessions).withSchema(SCHEMA.public).select("user", "expire").where("id", id);

    if (rows.length > 0) {
      const sessionDb = checkSessionDb(rows[0]);
      result = mapSession(sessionDb) ?? NOTHING;
    } else result = NOT_FOUND;
  } catch (error) {
    console.error(`[error]: ${error}`);
  }

  return result;
};

export const delSession = async (id: string) => {
  let result = false;

  try {
    const db = Pg.getInstance().getPg();

    await db(TABLES.sessions).withSchema(SCHEMA.public).del().where("id", id);

    result = true;
  } catch (error) {
    console.error(`[error]: ${error}`);
  }

  return result;
};

export const delSessionByUser = async (user: string) => {
  let result = false;

  try {
    const db = Pg.getInstance().getPg();

    await db(TABLES.sessions).withSchema(SCHEMA.public).del().where("user", user);

    result = true;
  } catch (error) {
    console.error(`[error]: ${error}`);
  }

  return result;
};
