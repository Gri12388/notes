import bodyParser from "body-parser";
import express from "express";
import { findUser, getCreds, getUrl, hashText, setCredential } from "../fns/auth.js";
import { ERRORS, NOT_FOUND, ORIGIN, SEARCHES, TECH_ERROR } from "../constants.js";
import { locale } from "../locale.js";

const ENDPOINTS = {
  auth: "/",
  signup: "/signup",
} as const;

export const authRouter = express.Router();

authRouter.get(ENDPOINTS.auth, (req, res) => {
  const { authError, success } = req.query;
  res.render("index", { index: { authError, success } });
});

authRouter.post(ENDPOINTS.signup, bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const creds = getCreds(req.body);

  if (creds) {
    const { login, password } = creds;
    const found = await findUser(login);
    switch (found) {
      case NOT_FOUND: {
        const hash = hashText(password);
        const isSet = await setCredential(login, hash);
        if (isSet) {
          res.status(204).redirect(
            getUrl({
              origin: ORIGIN,
              path: ENDPOINTS.auth,
              search: [{ name: SEARCHES.success, value: locale.credsSet }],
            }).toString(),
          );
        } else {
          res.status(307).redirect(
            getUrl({
              origin: ORIGIN,
              path: ENDPOINTS.auth,
              search: [{ name: SEARCHES.authError, value: ERRORS.somethingWrong }],
            }).toString(),
          );
        }
        break;
      }

      case TECH_ERROR: {
        res.status(307).redirect(
          getUrl({
            origin: ORIGIN,
            path: ENDPOINTS.auth,
            search: [{ name: SEARCHES.authError, value: ERRORS.somethingWrong }],
          }).toString(),
        );
        break;
      }

      default: {
        res.status(307).redirect(
          getUrl({
            origin: ORIGIN,
            path: ENDPOINTS.auth,
            search: [{ name: SEARCHES.authError, value: ERRORS.userExists }],
          }).toString(),
        );
      }
    }
  } else {
    res.status(307).redirect(
      getUrl({
        origin: ORIGIN,
        path: ENDPOINTS.auth,
        search: [{ name: SEARCHES.authError, value: ERRORS.noCredentials }],
      }).toString(),
    );
  }
});
