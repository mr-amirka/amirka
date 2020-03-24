/**
 * @overview isPlainObject
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const protoOf = Object.getPrototypeOf;
module.exports
  = (v) => v && typeof v === 'object' && !((v = protoOf(v)) && protoOf(v));
