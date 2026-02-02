/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.withSchema("public").createTable("users", (table) => {
    table.string("user").primary();
    table.string("password").notNullable();
  });

  await knex.schema.withSchema("public").createTable("sessions", (table) => {
    table.increments("id").primary();
    table.string("user").notNullable().unique();
    table.bigInteger("expire").notNullable();
  });

  await knex.schema.withSchema("public").createTable("notes", (table) => {
    table.increments("id").primary();
    table.string("user").notNullable();
    table.string("title").notNullable();
    table.string("text").notNullable();
    table.boolean("is_archived").notNullable();
    table.bigint("created_at").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.withSchema("public").dropTable("users");
  await knex.schema.withSchema("public").dropTable("sessions");
  await knex.schema.withSchema("public").dropTable("notes");
};
