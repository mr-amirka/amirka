/**
 * @overview isLength
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const MAX_SAFE_INTEGER = 9007199254740991;
export const isLength = (v: any) => typeof v == 'number' && v > -1 && v % 1 == 0 && v <= MAX_SAFE_INTEGER;