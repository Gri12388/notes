import type { Request, Response } from "express";
import { getUser } from "../fns/getUser.js";
import { checkString } from "../fns/checkers.js";
import { getNote } from "../fns/pg.js";
import { handleApiError } from "./commonHandlers.js";
import { ERRORS } from "../constants.js";
import { getHtml } from "../services/mdService.js";
import { getPdf } from "../services/pdfService.js";

export const handlePdf = async (req: Request, res: Response) => {
  const user = await getUser(req, res);

  if (user) {
    const { params } = req;
    const id = checkString(params.id);

    if (id) {
      const note = await getNote(id, user);
      if (note) {
        const { text, title } = note;
        const encodedTitle = encodeURI(title);
        const html = getHtml(text);
        const pdf = await getPdf(html);
        if (pdf) {
          res
            .set({ "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename=${encodedTitle}` })
            .end(pdf);
        } else handleApiError(res, 500, ERRORS.somethingWrong);
      } else handleApiError(res, 500, ERRORS.somethingWrong);
    } else handleApiError(res, 400, ERRORS.badRequest);
  }
};
