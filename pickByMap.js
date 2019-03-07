/**
 * @overview pickByMap
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

 module.exports = (src, _map, dst) => {
   dst || (dst = {});
   let value;
   for (let key in _map) (value = src[key]) === undefined || (dst[key] = value);
   return dst;
 };
