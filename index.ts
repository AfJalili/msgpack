import { unpack } from './src/deserializer';
import { pack } from './src/serializer';
const obj = [false] /*[ 1, true, 2, 3, 4, 'afshin', {a: true, b: [null,false]}]*/
const buf = pack(obj)

const JS = unpack(buf);

console.log(deepEqual(obj , JS))

function deepEqual(a: object, b: object) {
  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (Object.keys(a).length != Object.keys(b).length) return false;
    for (var key in a) if (!deepEqual(a[key], b[key])) return false;
    return true;
  } else return a === b
}