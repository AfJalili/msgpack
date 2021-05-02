import { pack } from '../src/serializer';
import { pack as encode } from 'msgpack';
import { generateRandomStr } from './utils';
import { unpack } from '../dist/deserializer';


test('serializer - 1 -  null', () => {
  expect(pack(null)).toStrictEqual(encode(null));
});

test('serializer - 2 - true', () => {
  expect(pack(true)).toStrictEqual(encode(true));
});

test('serializer - 3 - false', () => {
  expect(pack(false)).toStrictEqual(encode(false));
});

test('serializer - 4 - empty string', () => {
  expect(pack('')).toStrictEqual(encode(''));
});

test('serializer - 5 - fixstr', () => {
  const randStr = generateRandomStr(1);
  expect(pack(randStr)).toStrictEqual(encode(randStr));
});

test('serializer - 6 - fixstr', () => {
  const randStr = generateRandomStr(15);
  expect(pack(randStr)).toStrictEqual(encode(randStr));
});

test('serializer - 7 - str8', () => {
  const randStr = generateRandomStr(255);
  expect(pack(randStr)).toStrictEqual(encode(randStr));
});

test('serializer - 8 - str16', () => {
  const randStr = generateRandomStr(256);
  expect(pack(randStr)).toStrictEqual(encode(randStr));
});

/*
test('serializer - 9 - str16', () => {
  expect(pack(generateRandomStr(Math.pow(2, 16) - 1)))
    .toStrictEqual(encode(generateRandomStr(Math.pow(2, 16) - 1)));
})

test('serializer - 10 - str32', () => {
  expect(pack(generateRandomStr(Math.pow(2, 16))))
    .toStrictEqual(encode(generateRandomStr(Math.pow(2, 16))));
})

test('serializer - 11 - str32', () => {
  expect(pack(generateRandomStr(Math.pow(2, 32) - 1)))
    .toStrictEqual(encode(generateRandomStr(Math.pow(2, 32) - 1)));
})

test('serializer - 12 - Int8', () => {
  const num = 0;
  expect(pack(num)).toStrictEqual(encode(num));
});

test('serializer - 13 - Int8', () => {
  const num = -256;
  expect(pack(num)).toStrictEqual(encode(num));
});

test('serializer - 14 - Int8', () => {
  const num = 255;
  expect(pack(num)).toStrictEqual(encode(num));
});

test('serializer - 15 - Int16', () => {
  const num = 256;
  expect(pack(num)).toStrictEqual(encode(num));
});

test('serializer - 16 - Int16', () => {
  const num = -257;
  expect(pack(num)).toStrictEqual(encode(num));
});

test('serializer - 17 - Int16', () => {
  const num = Math.pow(-2, 16);
  expect(pack(num)).toStrictEqual(encode(num));
});

test('serializer - 18 - Int16', () => {
  const num = Math.pow(2, 16) - 1;
  expect(pack(num)).toStrictEqual(encode(num));
});

test('serializer - 19 - Int32', () => {
  const num = Math.pow(2, 16);
  expect(pack(num)).toStrictEqual(encode(num));
});

test('serializer - 20 - Int32', () => {
  const num = Math.pow(2, 32) - 1;
  expect(pack(num)).toStrictEqual(encode(num));
});

test('serializer - 21 - Int32', () => {
  const num = Math.pow(-2, 16) - 1;
  expect(pack(num)).toStrictEqual(encode(num));
});

test('serializer - 22 - Int32', () => {
  const num = Math.pow(-2, 32) + 1;
  expect(pack(num)).toStrictEqual(encode(num));
});

test('serializer - 22 - float32', () => {
  const float = 0.1;
  expect(pack(float)).toStrictEqual(encode(float));
});

test('serializer - 23 - float32', () => {
  const float = -0.1;
  expect(pack(float)).toStrictEqual(encode(float));
});

test('serializer - 24 - float32', () => {
  const float = Math.pow(-2, 15)  + 0.1
  expect(pack(float)).toStrictEqual(encode(float));
});
*/

test('serializer - 25 - fixarray', () => {
  const array = [true, false, null, 'string', ['nested array', true ,false , null, 'string'], { object: 'object in array'}]
  expect(pack(array)).toStrictEqual(encode(array));
});

test('serializer - 26 - fixarray', () => {
  const array = [true , ['nested array', ['another nested array']]]
  expect(pack(array)).toStrictEqual(encode(array));
});

test('serializer - 27 - fixarray', () => {
  const array = [{ object: 'object in array', array: [true, false, null]}]
  expect(pack(array)).toStrictEqual(encode(array));
});

test('serializer - 28 - empty array ', () => {
  expect(pack([])).toStrictEqual(encode([]));
});

test('serializer - 29 - array16', () => {
  const values = [true, false, null, 'str', -128, {a: '12'}, ['a']];
  const array = [...values, ...values ,...values, ...values , [...values], [...values]];
  expect(pack(array)).toStrictEqual(encode(array));
});

test('serializer/deserializer - 30 - empty fixmap ', () => {
  const obj = {}
  const packed = pack(obj);
  expect(packed).toStrictEqual(encode(obj));
  expect(unpack(packed)).toStrictEqual(obj)
});

test('serializer/deserializer - 31 - fixmap ', () => {
  const obj = {}
  const packed = pack(obj);
  expect(packed).toStrictEqual(encode(obj));
  expect(unpack(packed)).toStrictEqual(obj)
});

test('serializer/deserializer - 32 - fixmap ', () => {
  const obj = {a: 'true', b: false, c: null, d: ['array'], e:'string', f: -128, h: {map: 'a'}}
  const packed = pack(obj);
  expect(packed).toStrictEqual(encode(obj));
  expect(unpack(packed)).toStrictEqual(obj)
});

test('serializer/deserializer -  - map16 ', () => {
  const obj = {a: 'true', b: false, c: null, d: ['array'], e:'string', f: -128, h: {map: 'a'},
  g: [{a: -128 }], i: true, j: false, k: [[]], l:[[{}]], m: null, 'n': "undefined", o: [], p: {a: [{a: -128}]}, q: true }
  const packed = pack(obj);
  expect(packed).toStrictEqual(encode(obj));
  expect(unpack(packed)).toStrictEqual(obj)
});


