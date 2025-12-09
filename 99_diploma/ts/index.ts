import express from "express";

import cookieParser from "cookie-parser";
import nunjucks from "nunjucks";
import { ORIGIN, PORT, ROUTES } from "./src/constants.js";
import { rootRouter } from "./src/routes/root.js";
import { dashboardRouter } from "./src/routes/dashboard.js";

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");
app.use(express.static("public"));
app.use(cookieParser());

app.use(ROUTES.dashboard, dashboardRouter);
app.use(ROUTES.root, rootRouter);

app.listen(PORT, () => {
  console.log(`Listening on ${ORIGIN}`);
});
