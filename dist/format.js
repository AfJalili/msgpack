"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Format = void 0;
var Format;
(function (Format) {
    Format[Format["FIX_MAP"] = 128] = "FIX_MAP";
    Format[Format["FIX_ARRAY"] = 144] = "FIX_ARRAY";
    Format[Format["FIX_STR"] = 160] = "FIX_STR";
    Format["NIL"] = "c0";
    Format["BOOL_FALSE"] = "c2";
    Format["BOOL_TRUE"] = "c3";
    Format["BIN_8"] = "c4";
    Format["BIN_16"] = "c5";
    Format["BIN_32"] = "c6";
    Format["FLOAT_32"] = "ca";
    Format["INT_8"] = "d0";
    Format["INT_16"] = "d1";
    Format["INT_32"] = "d2";
    Format["STR_8"] = "d9";
    Format["STR_16"] = "da";
    Format["STR_32"] = "db";
    Format["ARRAY_16"] = "dc";
    Format["ARRAY_32"] = "dd";
    Format["MAP_16"] = "de";
    Format["MAP_32"] = "df";
})(Format = exports.Format || (exports.Format = {}));
//# sourceMappingURL=format.js.map