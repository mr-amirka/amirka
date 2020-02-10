/**
* @overview without
* @author Amir Absalyamov <mr.amirka@ya.ru>
*/

const indexOf = require('./indexOf');

/**
* @example
* const src = { name: 'Vasya', age: 10, height: 170, weight: 90};
* without(src, [ 'height', 'weight' ]) => // { name: 'Vasya', age: 10 }
*/

module.exports = (src, without, dst) => {
  dst = dst || {};
  let key;
  for (key in src) indexOf(without, key) < 0 && (dst[key] = src[key]); //eslint-disable-line
  return dst;
};
