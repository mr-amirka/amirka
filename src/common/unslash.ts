/**
 * @overview unslash
 * - удаляет слэши из строки
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

export const unslash = (v: string) => v.replace(/(\\\\)|(\\)/g, replacer);

const replacer = (all: string, v: string) => v ? '\\' : '';
