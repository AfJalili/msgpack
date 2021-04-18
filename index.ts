

function fixstr(str: string): Buffer {
    if ( str.length > 31) throw new Error("length must be lower than 32")

    const size = Buffer.from((str.length + 160).toString(16), 'hex');
    const value = Buffer.from(str);

    return Buffer.concat([size, value]);
}

function str8(str: string): any {
    const typeNum = 'd9' // 0xD9
    const buf = Buffer.alloc(2);
    buf.write(typeNum, 'hex')
    buf.writeUInt8(str.length, 1)
    const value = Buffer.from(str);
    return Buffer.concat([buf, value]);
}

function str16(str: string): any {
    const typeNum = 'da' // 0xDa
    const buf = Buffer.alloc(3);
    buf.write(typeNum, 'hex')
    buf.writeUInt16BE(str.length, 1)
    const value = Buffer.from(str);
    return Buffer.concat([buf, value]);
}

function str32(str: string): any {
    const typeNum = 'db' // 0xDB
    const buf = Buffer.alloc(5);
    buf.write(typeNum, 'hex')
    buf.writeUInt32BE(str.length, 1)
    const value = Buffer.from(str);
    return Buffer.concat([buf, value]);
}

function int8(val: number): Buffer {
    const typeNum = 'd0'; // 0xD1
    const result = Buffer.alloc(2)
    result.write(typeNum, 'hex');
    result.writeInt8(val, 1);
    return result;
}

function int16(val: number): Buffer {
    const typeNum = 'd1'; // 0xD1
    const result = Buffer.alloc(3)
    result.write(typeNum, 'hex');
    result.writeInt16BE(val, 1);
    return result;
}

function int32(val: number): Buffer {
    const typeNum = 'd2'; // 0xD2
    const result = Buffer.alloc(5)
    result.write(typeNum, 'hex');
    result.writeInt32BE(val, 1);
    return result;
}

function bin8(binStr: string): Buffer {
    const typeNum = 'c4'; // 0xC4
    const buf = Buffer.alloc(2);
    buf.write(typeNum, 'hex')
    buf.writeUInt8(binStr.length, 1)

    const valBuf = Buffer.from(binStr, 'binary');

    return Buffer.concat([buf, valBuf]);
}

function fixArray(arr: any[]) {
    if (arr.length > 15) throw new Error('number of elements must be lower than 16!');
    const typeNum = 144 + arr.length; // 0x90 to 0x9f
    let res = Buffer.alloc(1); res.writeUInt8(typeNum);

    for (let element of arr) {
        res = Buffer.concat([res, pack(element)]);
    }
    return res;
}

function array16(arr: any[]): Buffer {
    const typeNum = '0xdc' // 0xDC
    let res = Buffer.alloc(3);
    res.write(typeNum, 'hex')
    res.writeUInt16BE(arr.length, 1);

    for (let element of arr) {
        res = Buffer.concat([res, pack(element)]);
    }
    return res;
}

function array32(arr: any[]): Buffer {
    const typeNum = '0xdd' // 0xDD
    let res = Buffer.alloc(5);
    res.write(typeNum, 'hex')
    res.writeUInt16BE(arr.length, 1);

    for (let element of arr) {
        res = Buffer.concat([res, pack(element)]);
    }
    return res;
}

function float32(val: number): Buffer {
    const typeNum = 'ca'; // 0xCA
    const result = Buffer.alloc(5)
    result.write(typeNum, 'hex');
    result.writeFloatBE(val, 1);
    return result;
}

function fixMap(obj: object): Buffer {
    const propsCount = Object.keys(obj).length
    if (propsCount> 15) throw new Error('number of elements must be lower than 16!');
    const typeNum = 128 + propsCount; // 0x80 to 0x8f
    let res = Buffer.alloc(1); res.writeUInt8(typeNum);

    for (const [key, value] of Object.entries(obj)) {
        res = Buffer.concat([res, parseStr(key), pack(value)])
    }

    return res;
}

function map16(obj: object): Buffer {
    const typeNum = '0xde' // 0xDE
    const propsCount = Object.keys(obj).length
    let res = Buffer.alloc(3);
    res.write(typeNum, 'hex')
    res.writeUInt16BE(propsCount, 1);
    for (const [key, value] of Object.entries(obj)) {
        res = Buffer.concat([res, parseStr(key), pack(value)])
    }

    return res;
}

function map32(obj: object): Buffer {
    const typeNum = '0xde' // 0xDE
    const propsCount = Object.keys(obj).length
    let res = Buffer.alloc(5);
    res.write(typeNum, 'hex')
    res.writeUInt32BE(propsCount, 1);
    for (const [key, value] of Object.entries(obj)) {
        res = Buffer.concat([res, parseStr(key), pack(value)])
    }

    return res;
}

function parseStr(str: string): Buffer {
    if (inRange(4)) return fixstr(str);
    if (inRange(8)) return str8(str);
    if (inRange(16)) return str16(str);
    if (inRange(32)) return str32(str);
    throw new Error('provided string is too long!')

    function inRange(exp: 4 | 8 | 16 | 32) {
        return str.length < Math.pow(2, exp)
    }
}

function parseNum(num: number): Buffer {
    if(isFloat()) return float32(num);
    if (inRange(8)) return int8(num);
    if (inRange(16)) return int16(num);
    if (inRange(32)) return int32(num);
    throw new Error('provided integer is too long!')

    function inRange(exp: 8 | 16 | 32): boolean {
        return Math.pow(-2,exp - 1) <= num && num < Math.pow(2,exp - 1);
    }

    function isFloat() {
        return num % 1 !== 0;
    }
}

function parseMap(obj: object): Buffer {
    if (inRange(4)) return fixMap(obj);
    if (inRange(16)) return map16(obj);
    if (inRange(32)) return map32(obj);
    throw new Error('provided object has too many properties!')

    function inRange(exp: 4 | 16 | 32) {
        return Object.keys(obj).length < Math.pow(2, exp)
    }
}

function parseArray(arr: any[]): Buffer {
    if (inRange(4)) return fixArray(arr);
    if (inRange(16)) return array16(arr);
    if (inRange(32)) return array32(arr);
    throw new Error('provided array has too many elements!')

    function inRange(exp: 4 | 16 | 32) {
        return arr.length < Math.pow(2, exp)
    }
}

function parseBool(val: boolean): Buffer {
    return  val ? Buffer.from('c3', 'hex') : Buffer.from('c2', 'hex');
}

function parseNil(val: null | undefined): Buffer {
    return Buffer.from('c0', 'hex');
}


function pack(value: any ): Buffer {
    const valType: string = typeof value;
    if (!value && value !== 0) return parseNil(value);
    if(Array.isArray(value)) return parseArray(value);
    if(valType === 'object') return parseMap(value);
    if (valType === 'string') return parseStr(value);
    if (valType === 'number') return parseNum(value);
    if (valType === 'boolean') return parseBool(value);
}
console.log(1, pack({a: 12, b: true}))
console.log(2, pack({a: 12, b: null}))
console.log(3, pack({a: 12, b: { c: null}}))
console.log(4, pack({a: [12, { c: [1, 2,3]}], b: true}))
console.log(5, pack([12, { c: [1, 2,3]}]))
console.log(5, pack(null))
console.log(5, pack({}))
console.log(5, pack([]))
console.log(5, pack(5))