require("dotenv").config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const config = {
  port: 5432,
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
};

module.exports = {
  client: "pg",
  connection: config,
  migrations: {
    tableName: "knex_migrations",
  },
};
