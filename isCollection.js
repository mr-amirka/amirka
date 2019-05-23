/**
 * @overview isCollection
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const isLength = require('./isLength');
const isPlainObject = require('./isPlainObject');
module.exports = v => isPlainObject(v) || v && typeof v === 'object' && isLength(v.length);
