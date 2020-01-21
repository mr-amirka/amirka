/**
 * @overview isObjectLike
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const regexp = /object|function/;
module.exports = (v) => v && regexp.test(typeof v);
