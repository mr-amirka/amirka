/**
 * @overview mapperProvider
 * @example
 * const mapper = mapperProvider([ 'name', 'age']);
 * mapper([ 'Вася', 30 ]) //=> {name: 'Вася', age: 30}
 *
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const set = require('./set');
module.exports = (keys) => {
  keys || (keys = []);
  const l = keys.length;
  return (values, dst) => {
    dst || (dst = {});
    if (!values) return dst;
    let i = 0;
    for (; i < l; i++) set(dst, '' + keys[i], values[i] || '');
    return dst;
  };
};
