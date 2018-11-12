/**
 * @overview escapeRegExp
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 */

module.exports = v => v.replace(reRegExpChar, '\\$&');
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
