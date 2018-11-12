/**
 * @overview aggregate
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const eachApply = require('./each-apply');
module.exports = (funcs, aggregator) => {
  aggregator || (aggregator = eachApply);
	return function() {
		return aggregator(funcs, arguments, this);
	};
};
