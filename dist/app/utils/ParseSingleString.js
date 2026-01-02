"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueryParam = void 0;
/* Helper to get single string from query */
const parseQueryParam = (value) => {
    if (!value)
        return undefined;
    if (Array.isArray(value))
        return value[0];
    if (typeof value === "string")
        return value;
    return undefined;
};
exports.parseQueryParam = parseQueryParam;
