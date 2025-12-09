import bodyParser from "body-parser";
import express from "express";
import { ENDPOINTS, NOT_FOUND, ORIGIN, ROUTES, TECH_ERROR } from "../constants.js";
import type { Session } from "../types.js";
import ms from "ms";
import { getCreds, getUrl, hashText } from "../fns/common.js";
import { createSession, findPassword, findUser, setCredential } from "../fns/db.js";
import {
  handleCredsSet,
  handleLogin,
  handleNoCredentials,
  handleSomthingWentWrong,
  handleUserExists,
  handleWrongCreds,
} from "../fns/handlers.js";

export const rootRouter = express.Router();

rootRouter.get(ROUTES.root, (req, res) => {
  const { cookies } = req;

  if (cookies && cookies.sessionId) {
    res.status(307).redirect(getUrl({ origin: ORIGIN, path: ROUTES.dashboard, search: [] }).toString());
  } else {
    const { authError, success } = req.query;
    res.render("index", { index: { authError, success } });
  }
});

rootRouter.post(ENDPOINTS.login, bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const creds = getCreds(req.body);

  if (creds) {
    const { login, password } = creds;
    const findData = await findPassword(login);
    switch (findData) {
      case NOT_FOUND:
        handleWrongCreds(res);
        break;

      case TECH_ERROR:
        handleSomthingWentWrong(res);
        break;

      default:
        const hash = hashText(password);
        const isMatch = hash === findData.found;
        if (isMatch) {
          const session: Session = {
            user: login,
            expire: Date.now() + ms("1d"),
          };
          const id = await createSession(session);
          id ? handleLogin(res, id) : handleSomthingWentWrong(res);
        } else handleWrongCreds(res);
    }
  } else handleNoCredentials(res);
});

rootRouter.post(ENDPOINTS.signup, bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const creds = getCreds(req.body);

  if (creds) {
    const { login, password } = creds;
    const found = await findUser(login);
    switch (found) {
      case NOT_FOUND:
        const hash = hashText(password);
        const isSet = await setCredential(login, hash);
        isSet ? handleCredsSet(res) : handleSomthingWentWrong(res);
        break;

      case TECH_ERROR:
        handleSomthingWentWrong(res);
        break;

      default:
        handleUserExists(res);
    }
  } else handleNoCredentials(res);
});
