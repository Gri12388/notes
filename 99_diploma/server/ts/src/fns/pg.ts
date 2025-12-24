import { Pg } from "../classes/Pg.js";
import { LIMIT, SCHEMA, TABLES } from "../constants.js";
import type { NoteLite, NotesPayload } from "../types.js";
import { getNoteLiteOrUdf, getNotesLite, getNumberOrUdf } from "./checkers.js";
import { getAgeData, getOffset } from "./common.js";

export const configTable = async () => {
  let result = false;

  try {
    const db = Pg.getInstance().getPg();

    const isNodes = await db.schema.withSchema(SCHEMA.public).hasTable(TABLES.notes);

    if (isNodes) result = true;
    else {
      await db.schema.withSchema(SCHEMA.public).createTable(TABLES.notes, (table) => {
        table.increments("id").primary();
        table.string("user").notNullable();
        table.string("title").notNullable();
        table.string("text").notNullable();
        table.boolean("is_archive").notNullable();
        table.bigint("created_at").notNullable();
        table.bigint("edited_at").notNullable();
      });

      result = true;
    }
  } catch (error) {
    console.error(`[error]: ${error}`);
  }

  return result;
};

export const getNotes = async (payload: NotesPayload, userName: string) => {
  let result: NoteLite[] | undefined;
  try {
    const db = Pg.getInstance().getPg();

    const { age, page, search } = payload;

    const { isArchive, timestamp } = getAgeData(age);
    const offset = getOffset(page);
    const sql = db(TABLES.notes)
      .withSchema(SCHEMA.public)
      .select("id", "title", "text")
      .where("user", userName)
      .andWhere("is_archive", isArchive)
      .andWhere("created_at", ">", timestamp);

    if (search) {
      sql.andWhere("title", "ilike", `%${search}%`).orWhere("text", "ilike", `%${search}%`);
    }

    const rows = await sql.offset(offset).limit(LIMIT + 1);
    result = getNotesLite(rows);
  } catch (error) {
    console.log("[error]", error);
  }

  return result;
};

export const archiveNote = async (id: number) => {
  let result = false;

  try {
    const db = Pg.getInstance().getPg();

    await db(TABLES.notes).withSchema(SCHEMA.public).where({ id }).update({ is_archive: true });
    result = true;
  } catch (error) {
    console.log("[error]", error);
  }

  return result;
};

export const createNote = async (payload: NoteLite, userName: string) => {
  let result = "";

  try {
    const db = Pg.getInstance().getPg();

    const { title, text } = payload;
    const now = Date.now();

    const rows = await db(TABLES.notes)
      .withSchema(SCHEMA.public)
      .insert(
        [
          {
            user: userName,
            title,
            text,
            is_archive: false,
            created_at: now,
            edited_at: now,
          },
        ],
        ["id"],
      );
    const id = getNumberOrUdf(rows[0]?.id)?.toString();
    if (id) result = id;
  } catch (error) {
    console.log("[error]", error);
  }

  return result;
};

export const deleteNote = async (id: number) => {
  let result = false;

  try {
    const db = Pg.getInstance().getPg();

    await db(TABLES.notes).withSchema(SCHEMA.public).del().where({ id });
    result = true;
  } catch (error) {
    console.log("[error]", error);
  }

  return result;
};

export const getNote = async (id: string, userName: string) => {
  let result: NoteLite | undefined;

  try {
    const db = Pg.getInstance().getPg();

    const rows = await db(TABLES.notes)
      .withSchema(SCHEMA.public)
      .select("title", "text", "is_archive")
      .where("user", userName)
      .andWhere("id", id);

    if (rows.length > 0) {
      const note = getNoteLiteOrUdf(rows[0]);
      if (note) result = note;
    }
  } catch (error) {
    console.log("[error]", error);
  }

  return result;
};
