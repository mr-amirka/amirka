/**
 * @overview aggregate
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

export const aggregate = (funcs: fn[], aggregator: callEach): fn => {
	return function() {
		return aggregator(funcs, <any> arguments, this);
	};
};