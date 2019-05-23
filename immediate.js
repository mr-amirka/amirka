/**
 * @overview immediate
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const delay = require('./delay');
const defer = require('./defer');
const INTERRUPT_INDEX = 1000;
let index = 0;
module.exports = (fn, args, ctx) => {
  if (index > INTERRUPT_INDEX) {
    index = 0;
    return delay(fn, 0, args, ctx);
  }
  index++;
	return defer(fn, args, ctx);
};
