"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deserializer_1 = require("./src/deserializer");
var serializer_1 = require("./src/serializer");
var msgpack_1 = require("msgpack");
var obj = { a: undefined };
console.log("me pack: ", serializer_1.pack(obj));
console.log("msgpack: ", msgpack_1.pack(obj));
console.log(deepEqual(deserializer_1.unpack(serializer_1.pack(obj)), obj));
function deepEqual(a, b) {
    if (a && b && typeof a == 'object' && typeof b == 'object') {
        if (Object.keys(a).length != Object.keys(b).length)
            return false;
        for (var key in a)
            if (!deepEqual(a[key], b[key]))
                return false;
        return true;
    }
    else
        return a === b;
}
//# sourceMappingURL=index.js.map