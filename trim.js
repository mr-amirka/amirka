/**
 * @overview trim
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */
const trimProvider = require('./trimProvider');

module.exports = (v, pattern) =>
  (pattern ? trimProvider(pattern) : defaultTrim)(v);
const defaultTrim = trimProvider(/\s/);
