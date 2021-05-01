"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deserializer_1 = require("./deserializer");
var serializer_1 = require("./serializer");
var obj = [false];
var buf = serializer_1.pack(obj);
console.log(buf);
var JSvalue = deserializer_1.unpack(buf);
console.log(JSvalue);
console.log(deepEqual(obj, JSvalue));
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