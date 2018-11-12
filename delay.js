/**
 * @overview delay
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

module.exports = (fn, _delay, args, ctx) => {
  setTimeout(() => fn && fn.apply(ctx || null, args || []), _delay || 0);
  return () => fn = null;
};
