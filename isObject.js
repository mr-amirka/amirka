/**
 * @overview isObject
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const re = /object|function/;
module.exports = v => v && re.test(typeof v);
