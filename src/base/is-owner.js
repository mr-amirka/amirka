/**
 * @overview isOwner
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

const regexpIsOwner = /object|function/;
export const isOwner = v => v && (typeof v).match(regexpIsOwner);
