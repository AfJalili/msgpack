import { unpack } from './deserializer';
import { pack } from './serializer';
const obj = {a: 1, b:[123]} /*[ 1, true, 2, 3, 4, 'afshin', {a: true, b: [null,false]}]*/
const buf = pack(obj)
// const buf = pack({a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1,k:1,l:1,m:1,n:1,o:1,p:1,q:1,r:1,s:1,t:1,u:1,v:1,w:1,x:1,y:1,z:1})
console.log(buf);

const JSvalue = unpack(buf);
console.log(JSvalue);

console.log(deepEqual(obj , JSvalue))

function deepEqual(a: object, b: object) {
  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (Object.keys(a).length != Object.keys(b).length) return false;
    for (var key in a) if (!deepEqual(a[key], b[key])) return false;
    return true;
  } else return a === b
}