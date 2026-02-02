import { createHash } from "crypto";
import { subMonths } from "date-fns";
import { checkRecord, checkString } from "./checkers.js";
import { AGE } from "../constants.js";
export const hashText = (text) => createHash("sha256").update(text).digest("hex");
export const getCreds = (data) => {
    let result;
    const record = checkRecord(data);
    if (record) {
        const username = checkString(record.username);
        const password = checkString(record.password);
        if (username && password) {
            result = {
                login: username,
                password,
            };
        }
    }
    return result;
};
export const getUrl = (options) => {
    const { origin, path, search } = options;
    const url = new URL(path, origin);
    search.forEach((item) => {
        url.searchParams.set(item.name, item.value);
    });
    return url;
};
export const getAgeData = (age) => {
    let result = {
        isArchived: false,
        timestamp: 0,
    };
    switch (age) {
        case AGE.archive:
            result.isArchived = true;
            break;
        case AGE.oneMonth:
            result.timestamp = subMonths(Date.now(), 1).getTime();
            break;
        case AGE.threeMonth:
            result.timestamp = subMonths(Date.now(), 3).getTime();
            break;
    }
    return result;
};
export const getOffset = (page) => {
    let result = 0;
    if (page > 1)
        result = page - 1;
    return result;
};
export const isInt = (value) => /^\d+$/.test(value);
//# sourceMappingURL=common.js.map