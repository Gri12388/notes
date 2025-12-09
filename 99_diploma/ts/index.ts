import express from "express";

import nunjucks from "nunjucks";
import { ORIGIN, PORT, ROUTES } from "./src/constants.js";
import { authRouter } from "./src/routes/auth.js";

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");
app.use(express.static("public"));

app.use(ROUTES.auth, authRouter);

app.listen(PORT, () => {
  console.log(`Listening on ${ORIGIN}`);
});
