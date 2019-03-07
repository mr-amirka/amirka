/**
 * @overview get
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isLength = require('./isLength');

const get = module.exports = (ctx, path, def) => path ? (ctx ? base(ctx, ('' + path).split('.'), def) : def) : ctx;
const base = get.base = (ctx, path, def) => {
	const length = path.length;
	let i = 0;
	while (ctx && i < length) ctx = ctx[path[i++]];
	return i === length ? ctx : def;
};

get.getter = v => (handlers[typeof v] || noopHandle)(v);

const noopHandle = v => v;
const arrayHandle = path => v => base(v, path);
const handlers = {
  'string': v => arrayHandle(v.split('.')),
  'object': v => v && isLength(v.length) ? arrayHandle(v) : v
};
