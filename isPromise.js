/**
 * @overview isPromise
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 */

const isObject = require('./isObject');
const isFunction = require('./isFunction');
module.exports = v => isObject(v) && isFunction(v.then);
