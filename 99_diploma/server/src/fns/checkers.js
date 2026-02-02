import { AGE } from "../constants.js";
import { isInt } from "./common.js";
export const checkString = (value) => (typeof value === "string" ? value : undefined);
export const checkNumber = (value) => (typeof value === "number" ? value : undefined);
export const checkBoolean = (value) => (typeof value === "boolean" ? value : undefined);
export const checkInt = (value) => (isInt(value) ? Number(value) : undefined);
export const checkRecord = (value) => typeof value === "object" && value !== null ? value : undefined;
export const checkArray = (value, checker) => {
    const result = [];
    if (Array.isArray(value)) {
        value.forEach((item) => {
            const checkedItem = checker(item);
            if (checkedItem !== undefined)
                result.push(checkedItem);
        });
    }
    return result;
};
export const checkSession = (value) => {
    let result;
    if (typeof value === "object" && value !== null) {
        const user = "user" in value ? checkString(value.user) : undefined;
        const expire = "expire" in value ? checkNumber(value.expire) : undefined;
        if (user !== undefined && expire !== undefined)
            result = { user, expire };
    }
    return result;
};
export const checkSessionDb = (value) => {
    let result;
    if (typeof value === "object" && value !== null) {
        const user = "user" in value ? checkString(value.user) : undefined;
        const expire = "expire" in value ? checkString(value.expire) : undefined;
        if (user !== undefined && expire !== undefined)
            result = { user, expire };
    }
    return result;
};
export const getAgeOrUdf = (value) => {
    switch (value) {
        case AGE.allTime:
            return AGE.allTime;
        case AGE.archive:
            return AGE.archive;
        case AGE.oneMonth:
            return AGE.oneMonth;
        case AGE.threeMonth:
            return AGE.threeMonth;
        default:
            return undefined;
    }
};
export const checkList = (value) => {
    let result;
    if (typeof value === "object" && value !== null) {
        const age = "age" in value ? getAgeOrUdf(value.age) : undefined;
        const search = "search" in value ? checkString(value.search) : undefined;
        const page = "page" in value ? checkNumber(value.page) : undefined;
        result = { age: age ?? AGE.allTime, search: search ?? "", page: page ?? 1 };
    }
    return result;
};
export const checkNoteDb = (value) => {
    let result;
    if (typeof value === "object" && value !== null) {
        const id = "id" in value ? checkNumber(value.id) : undefined;
        const user = "user" in value ? checkString(value.user) : undefined;
        const title = "title" in value ? checkString(value.title) : undefined;
        const text = "text" in value ? checkString(value.text) : undefined;
        const is_archived = "is_archived" in value ? checkBoolean(value.is_archived) : undefined;
        const created_at = "created_at" in value ? checkString(value.created_at) : undefined;
        if (id !== undefined &&
            user !== undefined &&
            title !== undefined &&
            text !== undefined &&
            is_archived !== undefined &&
            created_at !== undefined)
            result = { id, user, title, text, is_archived, created_at };
    }
    return result;
};
export const checkCreate = (value) => {
    let result;
    if (typeof value === "object" && value !== null) {
        const title = "title" in value ? checkString(value.title) : undefined;
        const text = "text" in value ? checkString(value.text) : undefined;
        if (title !== undefined && text !== undefined)
            result = { title, text };
    }
    return result;
};
export const checkEdit = (value) => {
    let result;
    if (typeof value === "object" && value !== null) {
        const id = "id" in value ? checkString(value.id) : undefined;
        const title = "title" in value ? checkString(value.title) : undefined;
        const text = "text" in value ? checkString(value.text) : undefined;
        if (id !== undefined && title !== undefined && text !== undefined)
            result = { id, title, text };
    }
    return result;
};
//# sourceMappingURL=checkers.js.map