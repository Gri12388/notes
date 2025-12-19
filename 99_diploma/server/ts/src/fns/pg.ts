import { Pg } from "../classes/Pg.js";

export const configTable = async () => {
  let result = false;

  try {
    const db = Pg.getInstance().getPg();

    const isNodes = await db.schema.withSchema("public").hasTable("nodes");

    if (isNodes) result = true;
    else {
      await db.schema.withSchema("public").createTable("nodes", (table) => {
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
