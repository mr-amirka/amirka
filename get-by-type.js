/**
 * @overview getByType
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

module.exports = (args, map, dst) => {
	dst || (dst = {});
	let tmp = {}, i, v, k, keys, l = args.length;
	for (k in map) tmp[k] = map[k].slice().reverse();
	for (i = 0; i < l; i++) {
		(keys = tmp[ typeof(v = args[i]) ]) && keys.length && (dst[ keys.pop() ] = v);
	}
	return dst;
};
