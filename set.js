/**
 * @overview set
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const isObjectLike = require('./isObjectLike');
const isIndex = require('./isIndex');
const set = module.exports = (ctx, path, value) => path ? base(ctx, ('' + path).split('.'), value) : ctx;
const base = set.base = (ctx, path, value) => {
  const length = path.length;
  const lastIndex = length - 1;
  let nested = ctx, k, nextKey = path[0], i = 0, next;
  while (nested && i < lastIndex) {
    k = nextKey;
    nextKey = path[++i];
    nested = isObjectLike(next = nested[k]) ? next : (nested[k] = isIndex(nextKey) ? [] : {});
  }
  nested[nextKey] = value;
  return ctx;
};
