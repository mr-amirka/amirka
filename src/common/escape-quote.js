/**
 * @overview escapeQuote
 * Экранирует ковычки
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

export const escapeQuote = (input) => input.replace(regexpQuote, replacer);
const regexpQuote = /(['"\\])/g;
const replacer = (all, quote) => '\\' + quote;