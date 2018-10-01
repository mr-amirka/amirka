/**
 * @overview get
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */


const get = module.exports = (ctx, path, def) => path ? (ctx ? core(ctx, path.split('.'), def) : def) : ctx;
const core = get.core = (ctx, path, def) => {
	const length = path.length;
	let i = 0;
	while (ctx && i < length) ctx = ctx[path[i++]];
	return i === length ? ctx : def;
}
