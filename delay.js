/**
 * @overview delay
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

module.exports = (fn, _delay, args, ctx) => {
  const timeoutId = setTimeout(() => fn.apply(ctx || null, args || []), _delay || 0);
  return () => clearTimeout(timeoutId);
};
