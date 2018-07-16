/**
 * @overview isOwner
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

export const isOwner = (v: any): boolean => v && /object|function/.test(typeof v);
