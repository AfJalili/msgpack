import { Format } from './format';

export function pack(value: any): Buffer {
  const valType: string = typeof value;
  if (!value && value !== 0) return parseNil(value);
  if (Array.isArray(value)) return parseArray(value);
  if (valType === 'object') return parseMap(value);
  if (valType === 'string') return parseStr(value);
  if (valType === 'number') return parseNum(value);
  if (valType === 'boolean') return parseBool(value);
}

function parseStr(str: string): Buffer {
  if (inRange(4)) return fixStr(str);
  if (inRange(8)) return str8(str);
  if (inRange(16)) return str16(str);
  if (inRange(32)) return str32(str);
  throw new Error('provided string is too long!');

  function inRange(exp: 4 | 8 | 16 | 32) {
    return str.length < Math.pow(2, exp);
  }
}

function parseNum(num: number): Buffer {
  if (isFloat()) return float32(num);
  if (inRange(8)) return int8(num);
  if (inRange(16)) return int16(num);
  if (inRange(32)) return int32(num);
  throw new Error('provided integer is too long!');

  function inRange(exp: 8 | 16 | 32): boolean {
    return Math.pow(-2, exp - 1) <= num && num < Math.pow(2, exp - 1);
  }

  function isFloat() {
    return num % 1 !== 0;
  }
}

function parseMap(obj: object): Buffer {
  if (inRange(4)) return fixMap(obj);
  if (inRange(16)) return map16(obj);
  if (inRange(32)) return map32(obj);
  throw new Error('provided object has too many properties!');

  function inRange(exp: 4 | 16 | 32) {
    return Object.keys(obj).length < Math.pow(2, exp);
  }
}

function parseArray(arr: any[]): Buffer {
  if (inRange(4)) return fixArray(arr);
  if (inRange(16)) return array16(arr);
  if (inRange(32)) return array32(arr);
  throw new Error('provided array has too many elements!');

  function inRange(exp: 4 | 16 | 32) {
    return arr.length < Math.pow(2, exp);
  }
}

function parseBool(val: boolean): Buffer {
  return val ? Buffer.from(Format.BOOL_TRUE, 'hex') : Buffer.from(Format.BOOL_FALSE, 'hex');
}

function parseNil(val: null | undefined): Buffer {
  return Buffer.from(Format.NIL, 'hex');
}

function fixStr(str: string): Buffer {
  if (str.length > 31) throw new Error('length must be lower than 32');

  const size = Buffer.alloc(1);
  size.writeUInt8(Format.FIX_STR + str.length);
  const value = Buffer.from(str);

  return Buffer.concat([size, value]);
}

function str8(str: string): any {
  const buf = Buffer.alloc(2);
  buf.write(Format.STR_8, 'hex');
  buf.writeUInt8(str.length, 1);
  const value = Buffer.from(str);
  return Buffer.concat([buf, value]);
}

function str16(str: string): any {
  const buf = Buffer.alloc(3);
  buf.write(Format.STR_16, 'hex');
  buf.writeUInt16BE(str.length, 1);
  const value = Buffer.from(str);
  return Buffer.concat([buf, value]);
}

function str32(str: string): any {
  const buf = Buffer.alloc(5);
  buf.write(Format.STR_32, 'hex');
  buf.writeUInt32BE(str.length, 1);
  const value = Buffer.from(str);

  return Buffer.concat([buf, value]);
}

function int8(val: number): Buffer {
  const res = Buffer.alloc(2);
  res.write(Format.INT_8, 'hex');
  res.writeInt8(val, 1);

  return res;
}

function int16(val: number): Buffer {
  const res = Buffer.alloc(3);
  res.write(Format.INT_16, 'hex');
  res.writeInt16BE(val, 1);

  return res;
}

function int32(val: number): Buffer {
  const res = Buffer.alloc(5);
  res.write(Format.INT_32, 'hex');
  res.writeInt32BE(val, 1);

  return res;
}

function bin8(buffer: Buffer): Buffer {
  const buf = Buffer.alloc(2);

  buf.write(Format.BIN_8, 'hex');
  buf.writeUInt8(buffer.length, 1);

  return Buffer.concat([buf, buffer]);
}

function bin16(binStr: string): Buffer {
  const buf = Buffer.alloc(3);

  buf.write(Format.BIN_16, 'hex');
  buf.writeUInt8(binStr.length, 1);

  const valBuf = Buffer.from(binStr, 'binary');

  return Buffer.concat([buf, valBuf]);
}

function bin32(binStr: string): Buffer {
  const buf = Buffer.alloc(5);

  buf.write(Format.BIN_16, 'hex');
  buf.writeUInt8(binStr.length, 1);

  const valBuf = Buffer.from(binStr, 'binary');

  return Buffer.concat([buf, valBuf]);
}

function fixArray(arr: any[]) {
  if (arr.length > 15) throw new Error('number of elements must be lower than 16!');
  let res = Buffer.alloc(1);
  res.writeUInt8(Format.FIX_ARRAY + arr.length);

  for (let element of arr) {
    res = Buffer.concat([res, pack(element)]);
  }

  return res;
}

function array16(arr: any[]): Buffer {
  let res = Buffer.alloc(3);
  res.write(Format.ARRAY_16, 'hex');
  res.writeUInt16BE(arr.length, 1);

  for (let element of arr) {
    res = Buffer.concat([res, pack(element)]);
  }

  return res;
}

function array32(arr: any[]): Buffer {
  let res = Buffer.alloc(5);
  res.write(Format.ARRAY_32, 'hex');
  res.writeUInt16BE(arr.length, 1);

  for (let element of arr) {
    res = Buffer.concat([res, pack(element)]);
  }

  return res;
}

function float32(val: number): Buffer {
  const res = Buffer.alloc(5);
  res.write(Format.FLOAT_32, 'hex');
  res.writeFloatBE(val, 1);

  return res;
}

function fixMap(obj: object): Buffer {
  const propsCount = Object.keys(obj).length;

  let res = Buffer.alloc(1);
  res.writeUInt8(Format.FIX_MAP + propsCount);

  // for ( const key in obj) {
  //   if(obj.hasOwnProperty(key)) {
  //     const value = obj[key];
  //     res = Buffer.concat([res, parseStr(key), pack(value)]);
  //   }
  //
  // }
  for (const [key, value] of Object.entries(obj)) {
    res = Buffer.concat([res, parseStr(key), pack(value)]);
  }

  return res;
}

function map16(obj: object): Buffer {
  const propsCount = Object.keys(obj).length;
  let res = Buffer.alloc(3);

  res.write(Format.MAP_16, 'hex');
  res.writeUInt16BE(propsCount, 1);

  for (const [key, value] of Object.entries(obj)) {
    res = Buffer.concat([res, parseStr(key), pack(value)]);
  }

  return res;
}


function map32(obj: object): Buffer {
  const propsCount = Object.keys(obj).length;
  let res = Buffer.alloc(5);

  res.write(Format.MAP_32, 'hex');
  res.writeUInt32BE(propsCount, 1);

  for (const [key, value] of Object.entries(obj)) {
    res = Buffer.concat([res, parseStr(key), pack(value)]);
  }

  return res;
}

