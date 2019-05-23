/**
 * @overview removeOf
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const splice = [].splice;
module.exports = (items, v) => {
  let length = items.length, i = length;
  for (; i--;) v === items[i] && splice.call(items, i, 1);
  return length - items.length;
};
