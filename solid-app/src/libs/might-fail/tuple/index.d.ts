/**
   * @module
   *
   * This module contains the interface to use the result of mightFail as an error-first tuple.
   *
   * This mimics the behaviour of golang.
   *
   * If you want to use error-first style, use the `/tuple` module.
   *
+  * @example
+  * ```ts
+  * import { mightFail } from "@might/fail/tuple";
+  *
+  * const [result, error] = await mightFail(promise);
+  * ```
   */
import { type Either } from "./Either";
import { mightFail, mightFailSync } from "./mightFail";
import { makeMightFail, makeMightFailSync } from "./makeMightFail";
export { Either, mightFail, makeMightFail, mightFailSync, makeMightFailSync };
declare const _default: {
    mightFail: import("../utils.type").MightFail<"tuple">;
    makeMightFail: typeof makeMightFail;
    mightFailSync: typeof mightFailSync;
    makeMightFailSync: typeof makeMightFailSync;
};
export default _default;
//# sourceMappingURL=index.d.ts.map