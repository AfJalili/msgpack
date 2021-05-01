export enum format {
  fixmap = 128,
  fixarray = 144,
  fixstr = 160,

  nil = 'c0',

  false = 'c2',
  true = 'c3',

  float32 = 'ca',

  int8 = 'd0',
  int16 = 'd1',
  int32 = 'd2',

  str8 = 'd9',
  str16 = 'da',
  str32 = 'db',

  array16 = 'dc',
  array32 = 'dd',

  map16 = 'de',
  map32 = 'df',
}