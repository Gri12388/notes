import express from "express";

import cookieParser from "cookie-parser";
import nunjucks from "nunjucks";
import { COLLECTIONS, ORIGIN, PORT, ROUTES, USER } from "./src/constants.js";
import { rootRouter } from "./src/routes/root.js";
import { apiRouter } from "./src/routes/api.js";
import { configCollection } from "./src/fns/mongo.js";
import { configTable } from "./src/fns/pg.js";

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");
app.use(express.static("public"));
app.use(cookieParser());

app.use(ROUTES.api, apiRouter);
app.use(ROUTES.root, rootRouter);

app.listen(PORT, async () => {
  const isCreds = await configCollection(COLLECTIONS.creds, USER);
  const isSessions = await configCollection(COLLECTIONS.sessions, USER);
  const isNodes = await configTable();

  if (isCreds && isSessions && isNodes) console.log(`Listening on ${ORIGIN}`);
  else process.exit(1);
});
