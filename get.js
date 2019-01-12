/**
 * @overview get
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isLength = require('./is-length');

const get = module.exports = (ctx, path, def) => path ? (ctx ? base(ctx, ('' + path).split('.'), def) : def) : ctx;
const base = get.base = (ctx, path, def) => {
	const length = path.length;
	let i = 0;
	while (ctx && i < length) ctx = ctx[path[i++]];
	return i === length ? ctx : def;
};

get.getter = (path) => {
  const type = typeof path;
  return type === 'function' ? path : (
    (type === 'string' ? (path = path.split('.')) : path) && isLength(path.length)
      ? (value => base(value, path))
      : path
  );
};
