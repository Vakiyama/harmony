"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mightFailFunction = void 0;
const errors_1 = require("./errors");
const createEither_1 = require("./createEither");
const mightFailFunction = async function (promise) {
    try {
        const result = await promise;
        return (0, createEither_1.createEither)({ result, error: undefined });
    }
    catch (err) {
        const error = (0, errors_1.handleError)(err);
        return (0, createEither_1.createEither)({ error, result: undefined });
    }
};
exports.mightFailFunction = mightFailFunction;
//# sourceMappingURL=mightFailFunction.js.map