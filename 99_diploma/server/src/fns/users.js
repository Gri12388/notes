import { Pg } from "../classes/Pg.js";
import { NOT_FOUND, NOTHING, PGERRORS, SCHEMA, TABLES, TRUE, UNIQUE_VIOLATION } from "../constants.js";
import { checkString } from "./checkers.js";
import { DatabaseError } from "pg";
export const configUsers = async () => {
    let result = false;
    try {
        const db = Pg.getInstance().getPg();
        const isUsers = await db.schema.withSchema(SCHEMA.public).hasTable(TABLES.users);
        if (isUsers)
            result = true;
        else {
            await db.schema.withSchema(SCHEMA.public).createTable(TABLES.users, (table) => {
                table.string("user").primary();
                table.string("password").notNullable();
            });
            result = true;
        }
    }
    catch (error) {
        console.error(`[error]: ${error}`);
    }
    return result;
};
export const setCredential = async (user, password) => {
    let result = NOTHING;
    try {
        const db = Pg.getInstance().getPg();
        await db(TABLES.users).withSchema(SCHEMA.public).insert([
            {
                user,
                password,
            },
        ]);
        result = TRUE;
    }
    catch (error) {
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
export const findPassword = async (user) => {
    let result = NOTHING;
    try {
        const db = Pg.getInstance().getPg();
        const rows = await db(TABLES.users).withSchema(SCHEMA.public).select("password").where("user", user);
        if (rows.length > 0)
            result = checkString(rows[0].password) ?? NOTHING;
        else
            result = NOT_FOUND;
    }
    catch (error) {
        console.error(`[error]: ${error}`);
    }
    return result;
};
//# sourceMappingURL=users.js.map