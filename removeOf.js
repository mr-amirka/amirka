/**
 * @overview removeOf
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const __splice = [].splice;
module.exports = (collection, v) => {
  let length = collection.length, i = length;
  while (i--) v === collection[i] && __splice.call(collection, i, 1);
  return length - collection.length;
};
