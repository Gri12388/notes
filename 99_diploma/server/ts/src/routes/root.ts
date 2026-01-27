import bodyParser from "body-parser";
import express from "express";
import { ENDPOINTS, ROUTES } from "../constants.js";
import { handleSignup } from "../handlers/signupHandler.js";
import { handleLogin } from "../handlers/loginHandler.js";
import { handleLogout } from "../handlers/logoutHandler.js";
import { handleRoot } from "../handlers/rootHandler.js";

export const rootRouter = express.Router();

rootRouter.get(ROUTES.root, handleRoot);

rootRouter.get(ENDPOINTS.logout, handleLogout);

rootRouter.post(ENDPOINTS.login, bodyParser.urlencoded({ extended: true }), handleLogin);

rootRouter.post(ENDPOINTS.signup, bodyParser.urlencoded({ extended: true }), handleSignup);
