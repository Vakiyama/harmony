"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fail = exports.Might = exports.makeMightFailSync = exports.mightFailSync = exports.makeMightFail = exports.mightFail = void 0;
const mightFail_1 = require("./mightFail");
Object.defineProperty(exports, "mightFail", { enumerable: true, get: function () { return mightFail_1.mightFail; } });
Object.defineProperty(exports, "mightFailSync", { enumerable: true, get: function () { return mightFail_1.mightFailSync; } });
Object.defineProperty(exports, "Might", { enumerable: true, get: function () { return mightFail_1.Might; } });
Object.defineProperty(exports, "Fail", { enumerable: true, get: function () { return mightFail_1.Fail; } });
const makeMightFail_1 = require("./makeMightFail");
Object.defineProperty(exports, "makeMightFail", { enumerable: true, get: function () { return makeMightFail_1.makeMightFail; } });
Object.defineProperty(exports, "makeMightFailSync", { enumerable: true, get: function () { return makeMightFail_1.makeMightFailSync; } });
const defaultExport = {
    mightFail: mightFail_1.mightFail,
    makeMightFail: makeMightFail_1.makeMightFail,
    mightFailSync: mightFail_1.mightFailSync,
    makeMightFailSync: makeMightFail_1.makeMightFailSync,
    Might: mightFail_1.Might,
    Fail: mightFail_1.Fail
};
exports.default = defaultExport;
//# sourceMappingURL=index.js.map