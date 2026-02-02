import { getUser } from "../fns/getUser.js";
import { checkString } from "../fns/checkers.js";
import { deleteNote } from "../fns/pg.js";
import { handleApiError } from "./commonHandlers.js";
import { ERRORS } from "../constants.js";
export const handleDelete = async (req, res) => {
    const user = await getUser(req, res);
    if (user) {
        const { params } = req;
        const id = checkString(params.id);
        if (id) {
            const isDeleted = await deleteNote(id);
            if (isDeleted)
                res.status(200).json({ status: "success" });
            else
                handleApiError(res, 500, ERRORS.somethingWrong);
        }
        else
            handleApiError(res, 500, ERRORS.badRequest);
    }
};
//# sourceMappingURL=deleteHandler.js.map