/**
 * @overview escapeRegExp
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 */

module.exports = v => v.replace(reRegExpChar, '\\$&');
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
