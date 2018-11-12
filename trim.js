/**
 * @overview trim
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */
const trimProvider = require('./trim-provider');

module.exports = (v, pattern) => (pattern ? trimProvider(pattern) : defaultTrim)(v);
const defaultTrim = trimProvider(/\s/);
