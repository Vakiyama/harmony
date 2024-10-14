"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fail = exports.Might = exports.mightFailSync = exports.mightFail = void 0;
const staticMethodsProxy_1 = require("./utils/staticMethodsProxy");
const errors_1 = require("./utils/errors");
const createEither_1 = require("./utils/createEither");
const mightFailFunction_1 = require("./utils/mightFailFunction");
/**
 * Wraps a promise in an Either to safely handle both its resolution and rejection. This function
 * takes a Promise of type T and returns a Promise which resolves with an object. This object
 * either contains a 'result' of type T if the promise resolves successfully, or an 'error' of type Error
 * if the promise is rejected.
 *
 * @template T The type of the result value.
 * @param {Promise<T>} promise - The promise to be wrapped in an Either. This is an asynchronous operation that
 * should resolve with a value of type T or reject with an Error.
 * @return {Promise<Either<T>>} A Promise that resolves with an Either. This Either is a `Success<T>` with
 * the 'result' property set to the value resolved by the promise if successful, and 'error' as undefined.
 * In case of failure, it's a `Failure` with 'result' as undefined and 'error' of type Error. `error` will **always** be an instance of Error.
 *
 * @example
 * // Example of wrapping an async function that might fail:
 * async function fetchData(url: string): Promise<string> {
 *   const response = await fetch(url);
 *   if (!response.ok) {
 *     throw new Error('Network response was not ok');
 *   }
 *   return response.text();
 * }
 *
 * const {error, result} = await mightFail(fetchData('https://example.com'));
 *
 * if (error) {
 *   console.error('Fetching failed:', error.message);
 *   return;
 * }
 * console.log('Fetched data:', result);
 */
exports.mightFail = new Proxy(mightFailFunction_1.mightFailFunction, (0, staticMethodsProxy_1.makeProxyHandler)(mightFailFunction_1.mightFailFunction));
/**
 * Wraps a synchronous function in an Either type to safely handle exceptions. This function
 * executes a provided function that returns a value of type T, capturing any thrown errors.
 * It returns an object that either contains a 'result' of type T if the function succeeds,
 * or an 'error' of type Error if the function throws an error.
 *
 * @template T The type of the result value.◊
 * @param {() => T} func - A wrapper function that is expected to invoke the throwing function.
 *  That function should return a value of type T or throw an error.
 * @return {Either<T>} An object that is either a `Success<T>` with the result property set to the value returned by `func`,
 *                     or a `Failure` with the error property set to the caught error. `Success<T>` has a 'result' of type T
 *                     and 'error' as null. `Failure` has 'result' as null and 'error' of type Error.
 * @example
 * // Example of wrapping a synchronous function that might throw an error:
 * const {error, result} = mightFailSync(() => JSON.parse(""));
 *
 * if (error) {
 *   console.error('Parsing failed:', error);
 *   return;
 * }
 * console.log('Parsed object:', result);
 */
const mightFailSync = function mightFailSync(func) {
    try {
        const result = func();
        return (0, createEither_1.createEither)({ error: undefined, result });
    }
    catch (err) {
        const error = (0, errors_1.handleError)(err);
        return (0, createEither_1.createEither)({ error, result: undefined });
    }
};
exports.mightFailSync = mightFailSync;
/**
 * A pure constructor function that takes a non-null value and returns an `Either` object with the value as the result and undefined as the error.
 *
 * @param result
 */
const Might = function Might(result) {
    return (0, createEither_1.createEither)({ result, error: undefined });
};
exports.Might = Might;
/**
 * A constructor function that takes an error and returns an `Either` object with undefined as the result and the error as the error.
 *
 * The error will **always** be an instance of Error.
 *
 * @param error
 */
const Fail = function Fail(error) {
    return (0, createEither_1.createEither)({ result: undefined, error: (0, errors_1.handleError)(error) });
};
exports.Fail = Fail;
//# sourceMappingURL=mightFail.js.map