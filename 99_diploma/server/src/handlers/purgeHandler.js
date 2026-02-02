import { getUser } from "../fns/getUser.js";
import { deleteArchived } from "../fns/pg.js";
import { handleApiError } from "./commonHandlers.js";
import { ERRORS } from "../constants.js";
export const handlePurge = async (req, res) => {
    const user = await getUser(req, res);
    if (user) {
        const isDeleted = await deleteArchived(user);
        if (isDeleted)
            res.status(200).json({ status: "success" });
        else
            handleApiError(res, 500, ERRORS.somethingWrong);
    }
};
//# sourceMappingURL=purgeHandler.js.map