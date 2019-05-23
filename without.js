/**
* @overview without
* @author Amir Absolutely <mr.amirka@ya.ru>
*/

/**
* @example
* const src = { name: 'Vasya', age: 10, height: 170, weight: 90};
* without(src, [ 'height', 'weight' ]) => // { name: 'Vasya', age: 10 }
*/
module.exports = (src, without) => {
  const dst = {};
  for (let key in src) without.indexOf(key) < 0 && (dst[key] = src[key]);
  return dst;
};
