/**
 * @overview isPromise
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 */

const isFunction = require('./isFunction');
module.exports = v => v && isFunction(v.then);
