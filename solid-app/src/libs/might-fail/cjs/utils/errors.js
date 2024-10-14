"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
function handleError(error) {
    if (error instanceof Error) {
        return error;
    }
    if (typeof error === "string") {
        return createErrorWithoutMightFailStackTraces(error);
    }
    if (typeof error === "object" && error !== null) {
        if ("message" in error && typeof error.message === "string") {
            return createErrorWithoutMightFailStackTraces(error.message);
        }
        return createErrorWithoutMightFailStackTraces(error);
    }
    return createErrorWithoutMightFailStackTraces("Unknown error");
}
function createErrorWithoutMightFailStackTraces(message) {
    var _a;
    const error = new Error(message);
    const stack = (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split("\n");
    stack === null || stack === void 0 ? void 0 : stack.splice(1, 3);
    error.stack = stack === null || stack === void 0 ? void 0 : stack.join("\n");
    return error;
}
//# sourceMappingURL=errors.js.map