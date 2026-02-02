import ms from "ms";
import { getCreds, hashText } from "../fns/common.js";
import { handleAuthError, handleAuthSuccess } from "./commonHandlers.js";
import { COOKIES, ERRORS, NOT_FOUND, NOTHING, PGERRORS, UNIQUE_VIOLATION } from "../constants.js";
import { findPassword } from "../fns/users.js";
import { delSessionByUser, setSession } from "../fns/sessions.js";
const handleSuccess = (res, id) => {
    res.cookie(COOKIES.sessionId, id.toString(), { httpOnly: true });
    handleAuthSuccess(res, 204);
};
const retryCreateNewSession = async (res, creds) => {
    const user = creds.login;
    const expire = Date.now() + ms("1d");
    const result = await setSession(user, expire);
    switch (result) {
        case NOTHING:
            handleAuthError(res, 500, ERRORS.somethingWrong);
            break;
        case UNIQUE_VIOLATION:
            handleAuthError(res, 500, ERRORS.somethingWrong);
            break;
        default:
            handleSuccess(res, result);
    }
};
const deleteOldSession = async (res, creds) => {
    const { login } = creds;
    const isDeleted = await delSessionByUser(login);
    if (isDeleted)
        await retryCreateNewSession(res, creds);
    else
        handleAuthError(res, 500, ERRORS.somethingWrong);
};
const createNewSession = async (res, creds) => {
    const user = creds.login;
    const expire = Date.now() + ms("1d");
    const result = await setSession(user, expire);
    switch (result) {
        case NOTHING:
            handleAuthError(res, 500, ERRORS.somethingWrong);
            break;
        case UNIQUE_VIOLATION:
            await deleteOldSession(res, creds);
            break;
        default:
            handleSuccess(res, result);
    }
};
const comparePasswords = async (res, found, creds) => {
    const { password } = creds;
    const hash = hashText(password);
    const isMatch = hash === found;
    if (isMatch)
        await createNewSession(res, creds);
    else
        handleAuthError(res, 307, ERRORS.wrongCreds);
};
const findPasswordByUser = async (res, creds) => {
    const { login } = creds;
    const found = await findPassword(login);
    switch (found) {
        case NOT_FOUND:
            handleAuthError(res, 307, ERRORS.wrongCreds);
            break;
        case NOTHING:
            handleAuthError(res, 500, ERRORS.somethingWrong);
            break;
        default:
            await comparePasswords(res, found, creds);
    }
};
export const handleLogin = async (req, res) => {
    const creds = getCreds(req.body);
    if (creds)
        await findPasswordByUser(res, creds);
    else
        handleAuthError(res, 307, ERRORS.noCredentials);
};
//# sourceMappingURL=loginHandler.js.map