/**
 * @overview escapeQuote
 * Экранирует ковычки
 *
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = input => input.replace(/(['"\\])/g, '\\$1');
