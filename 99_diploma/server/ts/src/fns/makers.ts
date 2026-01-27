import { NOTHING } from "../constants.js";
import type { Session } from "../types.js";
import { getIntOrUdf, getStringOrUdf } from "./checkers.js";

export const makeSession = (value: unknown) => {
  let result: Session | undefined;

  if (typeof value === "object" && value !== null) {
    const user = "user" in value ? getStringOrUdf(value.user) : undefined;
    const expire = getIntOrUdf(("expire" in value ? getStringOrUdf(value.expire) : undefined) ?? NOTHING);

    if (user !== undefined && expire !== undefined) result = { user, expire };
  }

  return result;
};
