import express from "express";

import cookieParser from "cookie-parser";
import nunjucks from "nunjucks";
import { COLLECTIONS, DATABASE, ORIGIN, PORT, ROUTES, USER } from "./src/constants.js";
import { rootRouter } from "./src/routes/root.js";
import { apiRouter } from "./src/routes/dashboard.js";
import { setIndex } from "./src/fns/db.js";

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
  const isCredsOk = await setIndex(COLLECTIONS.creds, USER);
  const isSessionsOk = await setIndex(COLLECTIONS.sessions, USER);

  if (isCredsOk && isSessionsOk) console.log(`Listening on ${ORIGIN}`);
  else process.exit(1);
});
