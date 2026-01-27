import express from "express";

import cookieParser from "cookie-parser";
import nunjucks from "nunjucks";
import { ORIGIN, PORT, ROUTES } from "./src/constants.js";
import { rootRouter } from "./src/routes/root.js";
import { apiRouter } from "./src/routes/api.js";
import { configTable } from "./src/fns/pg.js";
import { configUsers } from "./src/fns/users.js";
import { configSessions } from "./src/fns/sessions.js";

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
  const isUsers = await configUsers();
  const isSessions = await configSessions();
  const isNodes = await configTable();

  if (isSessions && isNodes && isUsers) console.log(`Listening on ${ORIGIN}`);
  else process.exit(1);
});
