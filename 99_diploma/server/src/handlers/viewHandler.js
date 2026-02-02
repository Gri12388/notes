import { getUser } from "../fns/getUser.js";
import { checkString } from "../fns/checkers.js";
import { getNote } from "../fns/pg.js";
import { handleApiError } from "./commonHandlers.js";
import { ERRORS } from "../constants.js";
import { getHtml } from "../services/mdService.js";
export const handleView = async (req, res) => {
    const user = await getUser(req, res);
    if (user) {
        const { params } = req;
        const id = checkString(params.id);
        if (id) {
            const note = await getNote(id, user);
            if (note) {
                const html = getHtml(note.text);
                res.status(200).json({ id: note.id, title: note.title, text: note.text, isArchived: note.isArchived, html });
            }
            else
                handleApiError(res, 500, ERRORS.somethingWrong);
        }
        else
            handleApiError(res, 400, ERRORS.badRequest);
    }
};
//# sourceMappingURL=viewHandler.js.map