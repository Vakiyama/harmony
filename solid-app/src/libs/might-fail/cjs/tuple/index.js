"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMightFailSync = exports.mightFailSync = exports.makeMightFail = exports.mightFail = void 0;
const mightFail_1 = require("./mightFail");
Object.defineProperty(exports, "mightFail", { enumerable: true, get: function () { return mightFail_1.mightFail; } });
Object.defineProperty(exports, "mightFailSync", { enumerable: true, get: function () { return mightFail_1.mightFailSync; } });
const makeMightFail_1 = require("./makeMightFail");
Object.defineProperty(exports, "makeMightFail", { enumerable: true, get: function () { return makeMightFail_1.makeMightFail; } });
Object.defineProperty(exports, "makeMightFailSync", { enumerable: true, get: function () { return makeMightFail_1.makeMightFailSync; } });
exports.default = { mightFail: mightFail_1.mightFail, makeMightFail: makeMightFail_1.makeMightFail, mightFailSync: mightFail_1.mightFailSync, makeMightFailSync: makeMightFail_1.makeMightFailSync };
//# sourceMappingURL=index.js.map