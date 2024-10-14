import { type Either } from "./Either";
import { MightFail, NotUndefined } from "../utils/utils.type";
/**
 * Wraps a promise in an Either to safely handle both its resolution and rejection. This function
 * takes a Promise of type T and returns a Promise which resolves with an Either tuple. This tuple
 * either contains the resolved value of type T as the first element and undefined as the second if the promise
 * resolves successfully, or undefined as the first element and an Error as the second if the promise is rejected.
 *

 * @template T The type of the result value.
 * @param {Promise<T>} promise - The promise to be wrapped in an Either. This is an asynchronous operation that
 * should resolve with a value of type T or reject with an Error.
 * @return {Promise<Either<T>>} A Promise that resolves with an Either tuple. This Either is [T, undefined] with
 * the first element set to the value resolved by the promise if successful, and [undefined, Error] in case of failure.
 * The error will always be an instance of Error.
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
 * const [result, error] = await mightFail(fetchData('https://example.com'));
 *
 * if (error) {
 *   console.error('Fetching failed:', error.message);
 *   return;
 * }
 * console.log('Fetched data:', result);
 */
export declare const mightFail: MightFail<"go">;
/**
 * Wraps a synchronous function in an Either type to safely handle exceptions. This function
 * executes a provided function that returns a value of type T, capturing any thrown errors.
 * It returns an Either tuple that either contains the value of type T as the first element and undefined as the second
 * if the function succeeds, or undefined as the first element and an Error as the second if the function throws an error.
 *

 * @template T The type of the result value.
 * @param {() => T} func - A wrapper function that is expected to invoke the throwing function.
 *  That function should return a value of type T or throw an error.
 * @return {Either<T>} An Either tuple that is either [T, undefined] with the first element set to the value returned by `func`,
 *                     or [undefined, Error] with the second element set to the caught error.
 * @example
 * // Example of wrapping a synchronous function that might throw an error:
 * const [result, error] = mightFailSync(() => JSON.parse(""));
 *
 * if (error) {
 *   console.error('Parsing failed:', error);
 *   return;
 * }
 * console.log('Parsed object:', result);
 */
export declare function mightFailSync<T>(func: () => T): Either<T>;
/**
 * A pure constructor function that takes a non-null value and returns an Either object with the value as the result and undefined as the error.
 *
 * @param result
 * @constructor
 */
export declare function Might<T>(result: NotUndefined<T>): Either<T>;
/**
 * A constructor function that takes an error and returns an Either object with undefined as the result and the error as the error.
 *
 * The error will **always** be an instance of Error.
 *
 * @param error
 * @constructor
 */
export declare function Fail(error: unknown): Either<undefined>;
//# sourceMappingURL=mightFail.d.ts.map