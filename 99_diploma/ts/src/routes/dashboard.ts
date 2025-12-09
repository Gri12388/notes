import express from "express";
import { COOKIES, NOT_FOUND, ORIGIN, ROUTES, TECH_ERROR } from "../constants.js";
import { getStringOrUdf } from "../fns/checkers.js";
import { getUrl } from "../fns/common.js";
import { findSession } from "../fns/db.js";
import { handleSomthingWentWrong } from "../fns/handlers.js";

export const dashboardRouter = express.Router();

dashboardRouter.get(ROUTES.root, async (req, res) => {
  const sessionId = req.cookies ? getStringOrUdf(req.cookies.sessionId) : undefined;

  if (sessionId) {
    const session = await findSession(sessionId);
    switch (session) {
      case NOT_FOUND:
        res.clearCookie(COOKIES.sessionId);
        handleSomthingWentWrong(res);
        break;

      case TECH_ERROR:
        res.clearCookie(COOKIES.sessionId);
        handleSomthingWentWrong(res);
        break;

      default:
        const { expire } = session.found;
        const now = Date.now();
        const isEspired = now > expire;
        if (isEspired) {
          res
            .status(307)
            .clearCookie(COOKIES.sessionId)
            .redirect(getUrl({ origin: ORIGIN, path: ROUTES.root, search: [] }).toString());
        } else {
          res.render("dashboard");
        }
    }
  } else {
    res.status(307).redirect(getUrl({ origin: ORIGIN, path: ROUTES.root, search: [] }).toString());
  }
});
