/**
 * @overview escapeQuote
 * Экранирует ковычки
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

module.exports = input => input.replace(/(['"\\])/g, '\\$1');
