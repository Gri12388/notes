import { checkString } from "./checkers.js";
import { getUrl } from "./common.js";
import { COOKIES, ORIGIN, ROUTES, SESSIONS } from "../constants.js";
import { delSession } from "./sessions.js";
const redirectTo = (res, status, path, search = []) => {
    res
        .status(status)
        .clearCookie(COOKIES.sessionId)
        .redirect(getUrl({ origin: ORIGIN, path, search }).toString());
};
const deleteSession = async (res, sessionId) => {
    SESSIONS.delete(sessionId);
    await delSession(sessionId);
    redirectTo(res, 307, ROUTES.root);
};
export const getUser = async (req, res) => {
    let result = "";
    const sessionId = req.cookies ? checkString(req.cookies.sessionId) : undefined;
    if (sessionId) {
        const session = SESSIONS.get(sessionId);
        if (session) {
            const { expire, user } = session;
            const now = Date.now();
            if (expire > now) {
                result = user;
            }
            else
                await deleteSession(res, sessionId);
        }
        else
            redirectTo(res, 307, ROUTES.root);
    }
    else
        redirectTo(res, 307, ROUTES.root);
    return result;
};
//# sourceMappingURL=getUser.js.map