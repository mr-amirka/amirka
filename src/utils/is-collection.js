/**
 * @overview isCollection
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isLength = require('./is-length');
const protoOf = Object.getPrototypeOf;
module.exports = v => v && typeof v === 'object' && (!protoOf(protoOf(v)) || isLength(v.length));
