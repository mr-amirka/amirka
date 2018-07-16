/**
 * @overview escapeQuote
 * Экранирует ковычки
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

export const escapeQuote = (input: string) => input.replace(/(['"\\])/g, replacer);
const replacer = (all: string, quote: string) => '\\' + quote;