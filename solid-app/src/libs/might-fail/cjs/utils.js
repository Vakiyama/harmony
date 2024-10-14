"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeProxyHandler = void 0;
exports.handleError = handleError;
function handleError(error) {
    if (error instanceof Error) {
        return error;
    }
    if (typeof error === "string") {
        return new Error(error);
    }
    if (typeof error === "object" && error !== null) {
        if ("message" in error && typeof error.message === "string") {
            return new Error(error.message);
        }
        return new Error(error);
    }
    return new Error("Unknown error");
}
const makeProxyHandler = (mightFailFunction) => ({
    get(_, property) {
        if (Object.getOwnPropertyDescriptor(Promise, property) === undefined) {
            return mightFailFunction(Promise.reject(new Error(`property ${property} not found on Promise`)));
        }
        const value = Promise[property];
        if (typeof value !== "function") {
            return mightFailFunction(Promise.reject(new Error(`property ${property} is not a Promise method`)));
        }
        return function (...args) {
            const promise = value.apply(Promise, args);
            return mightFailFunction(promise);
        };
    },
});
exports.makeProxyHandler = makeProxyHandler;
//# sourceMappingURL=utils.js.map