/**
 * @overview unslash
 * - удаляет слэши из строки
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

export const unslash = v => v.replace(regexp, replacer);

const replacer = (all, v) => v ? '\\' : '';
const regexp = /(\\\\)|(\\)/g;