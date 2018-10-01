/**
 * @overview eachTry
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

module.exports = (funcs, args, context) => {
	funcs.forEach(fn => {
		try {
			fn.apply(context, args);
		} catch (ex) {
			console.error(ex);
		}
	});
};
