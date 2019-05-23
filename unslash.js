/**
 * @overview unslash
 * - удаляет слэши из строки
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = v => v.replace(re, replacer);
const re = /(\\\\)|(\\)/g;
const replacer = (all, v) => v ? '\\' : '';
