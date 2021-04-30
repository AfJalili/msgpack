import { Format } from './format';

export function unpack(buffer: Buffer): any {
  const { value } = parseToJS(buffer);
  return value;
}

function parseToJS(buffer: Buffer, start: number = 0): any {
  // todo: validation
  const type = getType(buffer[start]);
  console.log(type)
  return Deserializer[type](buffer, start);
}

function getType(typeNumber: number): string {
  console.log('typeNumber:', typeNumber)
  if (!typeNumber){ throw new Error(` ${typeNumber} is undefined!!!`)}
  if (isFixedType(typeNumber)) {
    return (
      isFixedMap(typeNumber) ? 'fixmap' :
        isFixedArray(typeNumber) ? 'fixarray' :
          'fixstr'
    );
  }
  return typeNumber.toString(16);

  function isFixedType(typeNumber: number) {
    return typeNumber <= 0xBF;
  }

  function isFixedMap(typeNumber: number) {
    return typeNumber <= 0x8F;
  }

  function isFixedArray(typeNumber: number) {
    return typeNumber <= 0x9F;
  }
}

const Deserializer = {


  fixarray: function readFixArray(buffer: Buffer, start: number = 0): result<Array<any>> {
    const length = buffer.readUInt8(start) - 0x90; // 0x90
    console.log('this is buffer: ' +  buffer.toString('hex'))
    console.log('this is length: ' +  length)
    return this.readArray(buffer, length, start + 1);
  },
  [Format.ARRAY_16]: function readArray16(buffer: Buffer, start: number = 0): result<Array<any>> {
    const offset = start + 1;
    let length = buffer.readUInt16BE(offset);
    return this.readArray(buffer, length, offset + 2);
  },
  [Format.ARRAY_32]: function readArray32(buffer: Buffer, start: number = 0): result<Array<any>> {
    const offset = start + 1;
    let length = buffer.readUInt32BE(offset);
    return this.readArray(buffer, length, offset + 4);

  },
  readArray(buffer: Buffer, length: number, next: number): result<Array<any>> {
    const array = [];
    while (length--) {
      console.log(length)
      const it = this.parseElement(buffer, next);
      next = it.next;
      array.push(it.value);
      console.log("array: " + array)
    }

    return { value: array, next };
  },
  parseElement(buffer: Buffer, start: number): result<any> {
    console.log('this is type: ' , start.toString(16) )
    const type = getType(buffer[start])
    return Deserializer[type](buffer, start);
  },

  fixmap: function readFixMap(buffer: Buffer, start: number = 0): result<object> {
    const length = buffer.readUInt8(start) - 0x80;
    return this.readMap(buffer, start + 1, length);

  },
  readMap(buffer: Buffer, next: number,length: number): result<object>  {
    const obj = {};
    let it;
    for (let i = 0; i < length; i++) {
      it = this.readProperty(buffer, next)
      obj[it.value.propName] = it.value.propValue
      next = it.next
    }
    return { value: obj, next };
  },

  readProperty(buffer: Buffer, start: number): result<{ propName: string, propValue: any}> {
    let it = parseToJS(buffer, start);
    const propName = it.value
    it = parseToJS(buffer, it.next)
    const propValue = it.value
    return { value: {propName, propValue}, next: it.next};
  },

  [Format.MAP_16]: function readMap16(buffer: Buffer, start: number = 0): result<object> {
    let length = buffer.readUInt16BE(start + 1);
    return this.readMap(buffer, start + 3, length);

  },

  [Format.MAP_32]: function readMap32(buffer: Buffer, start: number = 0): result<object> {
    let length = buffer.readUInt32BE(start + 1);
    return this.readMap(buffer, start + 5, length);

  },

  [Format.BOOL_FALSE]: function readFalse(buffer: Buffer,start: number = 0): result<boolean> {
    return { value: false, next: ++start };
  },
  [Format.BOOL_TRUE]: function readTrue(buffer: Buffer, start: number = 0): result<boolean> {
    return { value: true, next: ++start };
  },

  [Format.NIL]: function readNil(buffer: Buffer,start: number = 0): result<null> {
    return { value: null, next: ++start };
  },

  fixstr: function readFixString(buffer: Buffer, start: number = 0): result<string> {
    const length = buffer.readUInt8(start) - 0xA0;
    const offset = start + 1;
    return this.readString(buffer, offset, length);
  },
  [Format.STR_8]: function readString8(buffer: Buffer, start: number = 0): result<string> {
    const length = buffer.readUInt8(start + 1);
    const offset = start + 2;

    return this.readString(buffer, offset, length);
  },
  [Format.STR_16]: function readString16(buffer: Buffer, start: number = 0): result<string> {
    const length = buffer.readUInt16BE(start + 1);
    const offset = start + 3;

    return this.readString(buffer, offset, length);
  },
  [Format.STR_32]: function readString32(buffer: Buffer, start: number = 0): result<string> {
    const length = buffer.readUInt32BE(start + 1);
    const offset = start + 5;

    return this.readString(buffer, offset, length);
  },
  readString(buffer: Buffer, offset: number, length: number) {
    const next = offset + length;
    const value = buffer.subarray(offset, next).toString();

    return { value, next };
  },

  [Format.INT_8]: function readInt8(buffer: Buffer, start: number = 0): result<number> {
    return this.readInt(buffer, start, 8);
  },
  [Format.INT_16]: function readInt16(buffer: Buffer, start: number = 0): result<number> {
    return this.readInt(buffer, start, 16);
  },
  [Format.INT_32]: function readInt32(buffer: Buffer, start: number = 0): result<number> {
    return this.readInt(buffer, start, 32);
  },
  readInt(buffer: Buffer, start: number, size: 8 | 16 | 32): result<number> {
    const offset = start + 1;
    return {
      value: (
        size === 8 ? buffer.readInt8(offset) :
          size === 16 ? buffer.readInt16BE(offset) :
            buffer.readInt32BE(offset)
      ),
      next: offset + (size / 8),
    };
  },

  [Format.FLOAT_32]: function readFloat32(buffer: Buffer, start: number = 0): result<number> {
    const offset = start + 1;
    return {
      value: buffer.readFloatBE(offset),
      next: offset + 4,
    };
  },

};


interface result<T> {
  value: T,
  next: number
}