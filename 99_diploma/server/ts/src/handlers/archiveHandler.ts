import type { Request, Response } from "express";
import { getUser } from "../fns/getUser.js";
import { checkString } from "../fns/checkers.js";
import { archiveNote } from "../fns/pg.js";
import { handleApiError } from "./commonHandlers.js";
import { ERRORS } from "../constants.js";

export const handleArchive = async (req: Request, res: Response) => {
  const user = await getUser(req, res);

  if (user) {
    const { params } = req;
    const id = checkString(params.id);

    if (id) {
      const isArchived = await archiveNote(id);
      if (isArchived) res.status(200).json({ status: "success" });
      else handleApiError(res, 500, ERRORS.somethingWrong);
    } else handleApiError(res, 400, ERRORS.badRequest);
  }
};
