/**
 * @overview isPromise
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 */

const isObject = require('./is-object');
const isFunction = require('./is-function');
module.exports = v => isObject(v) && isFunction(v.then);
