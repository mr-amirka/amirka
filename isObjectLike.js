/**
 * @overview isObjectLike
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

 module.exports = v => v && /object|function/.test(typeof v);
