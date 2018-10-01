/**
 * @overview set
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isObject = require('./is-object');
const isIndex = require('./is-index');
const set = module.exports = (ctx, path, value) => path ? core(ctx, path.split('.'), value) : value;
const core = set.core = (ctx, path, value) => {
  const length = path.length;
  const lastIndex = length - 1;
  let nested = ctx, k, nextKey = path[0], i = 0, next;
  while (nested && i < lastIndex) {
    k = nextKey;
    nextKey = path[++i];
    nested = isObject(next = nested[k]) ? next : (nested[k] = isIndex(nextKey) ? [] : {});
  }
  nested[nextKey] = value;
  return ctx;
};
