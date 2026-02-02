import { checkInt } from "./checkers.js";
export const mapSession = (data) => {
    let result;
    if (data) {
        const expire = checkInt(data.expire);
        if (expire !== undefined)
            result = { user: data.user, expire };
    }
    return result;
};
export const mapNote = (data) => {
    let result;
    if (data) {
        const createdAt = checkInt(data.created_at);
        if (createdAt !== undefined) {
            result = {
                id: data.id.toString(),
                user: data.user,
                title: data.title,
                text: data.text,
                isArchived: data.is_archived,
                createdAt,
            };
        }
    }
    return result;
};
//# sourceMappingURL=mappers.js.map