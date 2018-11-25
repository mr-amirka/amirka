/**
 * @overview immediate
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const delay = require('./delay');
module.exports = (fn, args, ctx) => {
	try {
		setImmediate(() => fn && fn.apply(ctx || null, args || []));
  	return () => fn = null;
	} catch (ex) {
		return delay(fn, 0, args, ctx);
	}
};
