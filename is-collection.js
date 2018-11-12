/**
 * @overview isCollection
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isLength = require('./is-length');
const isPlainObject = require('./is-plain-object');
module.exports = v => isPlainObject(v) || v && typeof v === 'object' && isLength(v.length);
