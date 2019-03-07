/**
 * @overview remove
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isObject = require('./isObject');
const remove = module.exports = (ctx, path) => path ? base(ctx, path.split('.')) : ctx;
const base = remove.base = (ctx, path) => {
  const length = path.length;
  const lastIndex = length - 1;
  let nested = ctx, k, nextKey = path[0], i = 0, next;
  while (nested && i < lastIndex) {
    k = nextKey;
    nextKey = path[++i];
    if (!isObject(next = nested[k])) return ctx;
    nested = next;
  }
  delete nested[nextKey];
  return ctx;
};
