import { handleAuthError, handleAuthSuccess } from "./commonHandlers.js";
import { COOKIES, ERRORS } from "../constants.js";
import { checkString } from "../fns/checkers.js";
import { delSession } from "../fns/sessions.js";
const handleSuccess = (res) => {
    res.clearCookie(COOKIES.sessionId);
    handleAuthSuccess(res, 307);
};
const deleteSession = async (res, sessionId) => {
    const isDeleted = await delSession(sessionId);
    if (isDeleted)
        handleSuccess(res);
    else
        handleAuthError(res, 500, ERRORS.somethingWrong);
};
export const handleLogout = async (req, res) => {
    const { cookies } = req;
    const sessionId = checkString(cookies?.sessionId);
    if (sessionId !== undefined)
        await deleteSession(res, sessionId);
    else
        handleAuthError(res, 400, ERRORS.noSession);
};
//# sourceMappingURL=logoutHandler.js.map