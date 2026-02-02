import { getUrl } from "../fns/common.js";
import { ORIGIN, ROUTES, SEARCHES } from "../constants.js";
export const handleAuthError = (res, code, message) => {
    res.status(code).redirect(getUrl({
        origin: ORIGIN,
        path: ROUTES.root,
        search: message ? [{ name: SEARCHES.authError, value: message }] : [],
    }).toString());
};
export const handleAuthSuccess = (res, code, message) => {
    res.status(code).redirect(getUrl({
        origin: ORIGIN,
        path: ROUTES.root,
        search: message ? [{ name: SEARCHES.success, value: message }] : [],
    }).toString());
};
export const handleApiError = (res, code, message) => {
    res.status(code).send(message);
};
//# sourceMappingURL=commonHandlers.js.map