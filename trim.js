/**
 * @overview trim
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */
const trimProvider = require('./trimProvider');

module.exports = (v, pattern) => (pattern ? trimProvider(pattern) : defaultTrim)(v);
const defaultTrim = trimProvider(/\s/);
