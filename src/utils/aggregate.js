/**
 * @overview aggregate
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

module.exports = (funcs, aggregator) => {
	return function() {
		return aggregator(funcs, arguments, this);
	};
};
