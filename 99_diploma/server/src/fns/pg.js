import { Pg } from "../classes/Pg.js";
import { LIMIT, SCHEMA, TABLES } from "../constants.js";
import { checkArray, checkNoteDb, checkNumber } from "./checkers.js";
import { getAgeData, getOffset } from "./common.js";
import { mapNote } from "./mappers.js";
export const configNotes = async () => {
    let result = false;
    try {
        const db = Pg.getInstance().getPg();
        const isNotes = await db.schema.withSchema(SCHEMA.public).hasTable(TABLES.notes);
        if (isNotes)
            result = true;
        else {
            await db.schema.withSchema(SCHEMA.public).createTable(TABLES.notes, (table) => {
                table.increments("id").primary();
                table.string("user").notNullable();
                table.string("title").notNullable();
                table.string("text").notNullable();
                table.boolean("is_archived").notNullable();
                table.bigint("created_at").notNullable();
            });
            result = true;
        }
    }
    catch (error) {
        console.error(`[error]: ${error}`);
    }
    return result;
};
export const selectNotes = async (payload, userName) => {
    let result;
    try {
        const db = Pg.getInstance().getPg();
        const { age, page, search } = payload;
        const { isArchived, timestamp } = getAgeData(age);
        const offset = getOffset(page);
        const sql = db(TABLES.notes)
            .withSchema(SCHEMA.public)
            .select("id", "user", "title", "text", "is_archived", "created_at")
            .where("user", userName)
            .andWhere("is_archived", isArchived)
            .andWhere("created_at", ">", timestamp);
        if (search) {
            sql.andWhere("title", "ilike", `%${search}%`);
        }
        const rows = await sql.offset(offset).limit(LIMIT + 1);
        const notes = checkArray(rows, checkNoteDb).reduce((acc, item) => {
            const note = mapNote(item);
            if (note)
                acc.push(note);
            return acc;
        }, []);
        result = notes;
    }
    catch (error) {
        console.log("[error]", error);
    }
    return result;
};
export const archiveNote = async (id) => {
    let result = false;
    try {
        const db = Pg.getInstance().getPg();
        await db(TABLES.notes).withSchema(SCHEMA.public).where({ id }).update({ is_archived: true });
        result = true;
    }
    catch (error) {
        console.log("[error]", error);
    }
    return result;
};
export const createNote = async (payload, userName) => {
    let result = "";
    try {
        const db = Pg.getInstance().getPg();
        const { title, text } = payload;
        const now = Date.now();
        const rows = await db(TABLES.notes)
            .withSchema(SCHEMA.public)
            .insert([
            {
                user: userName,
                title,
                text,
                is_archived: false,
                created_at: now,
            },
        ], ["id"]);
        const id = checkNumber(rows[0]?.id)?.toString();
        if (id)
            result = id;
    }
    catch (error) {
        console.log("[error]", error);
    }
    return result;
};
export const deleteArchived = async (user) => {
    let result = false;
    try {
        const db = Pg.getInstance().getPg();
        await db(TABLES.notes).withSchema(SCHEMA.public).del().where({ user }).andWhere({ is_archived: true });
        result = true;
    }
    catch (error) {
        console.log("[error]", error);
    }
    return result;
};
export const deleteNote = async (id) => {
    let result = false;
    try {
        const db = Pg.getInstance().getPg();
        await db(TABLES.notes).withSchema(SCHEMA.public).del().where({ id });
        result = true;
    }
    catch (error) {
        console.log("[error]", error);
    }
    return result;
};
export const editNote = async (payload) => {
    let result = false;
    try {
        const db = Pg.getInstance().getPg();
        const { id, title, text } = payload;
        await db(TABLES.notes).withSchema(SCHEMA.public).where({ id }).update({
            title,
            text,
        });
        result = true;
    }
    catch (error) {
        console.log("[error]", error);
    }
    return result;
};
export const getNote = async (id, userName) => {
    let result;
    try {
        const db = Pg.getInstance().getPg();
        const rows = await db(TABLES.notes)
            .withSchema(SCHEMA.public)
            .select("id", "user", "title", "text", "is_archived", "created_at")
            .where("user", userName)
            .andWhere("id", id);
        if (rows.length > 0) {
            const note = mapNote(checkNoteDb(rows[0]));
            if (note)
                result = note;
        }
    }
    catch (error) {
        console.log("[error]", error);
    }
    return result;
};
export const unarchiveNote = async (id) => {
    let result = false;
    try {
        const db = Pg.getInstance().getPg();
        await db(TABLES.notes).withSchema(SCHEMA.public).where({ id }).update({ is_archived: false });
        result = true;
    }
    catch (error) {
        console.log("[error]", error);
    }
    return result;
};
//# sourceMappingURL=pg.js.map