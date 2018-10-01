/**
 * @overview delayOne
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const delay = require('./delay');
const restart = require('./restart');
module.exports = (fn, _delay) => restart(function() {
	return delay(fn, _delay, arguments, this);
});
