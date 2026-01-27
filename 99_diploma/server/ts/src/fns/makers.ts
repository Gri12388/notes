import { NOTHING } from "../constants.js";
import type { Session } from "../types.js";
import { checkInt, checkString } from "./checkers.js";

export const makeSession = (value: unknown) => {
  let result: Session | undefined;

  if (typeof value === "object" && value !== null) {
    const user = "user" in value ? checkString(value.user) : undefined;
    const expire = checkInt(("expire" in value ? checkString(value.expire) : undefined) ?? NOTHING);

    if (user !== undefined && expire !== undefined) result = { user, expire };
  }

  return result;
};
