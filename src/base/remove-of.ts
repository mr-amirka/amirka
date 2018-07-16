/**
 * @overview removeOf
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const splice = [].splice;
export const removeOf = <T> (items: T[], v: T) => {
  let length = items.length, i = length;
  for (; i--;) v === items[i] && splice.call(items, i, 1);
  return length - items.length;
};
