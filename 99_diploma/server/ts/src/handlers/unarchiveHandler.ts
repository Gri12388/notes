import type { Request, Response } from "express";
import { getUser } from "../fns/getUser.js";
import { checkString } from "../fns/checkers.js";
import { unarchiveNote } from "../fns/pg.js";
import { handleApiError } from "./commonHandlers.js";
import { ERRORS } from "../constants.js";

export const handleUnarchive = async (req: Request, res: Response) => {
  const user = await getUser(req, res);

  if (user) {
    const { params } = req;
    const id = checkString(params.id);

    if (id) {
      const isUnarchived = await unarchiveNote(id);
      if (isUnarchived) res.status(200).json({ status: "success" });
      else handleApiError(res, 500, ERRORS.somethingWrong);
    } else handleApiError(res, 400, ERRORS.badRequest);
  }
};
