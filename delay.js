/**
 * @overview delay
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (fn, delay, args, ctx) => {
  const timeoutId = setTimeout(() => {
    fn.apply(ctx || null, args || []);
  }, delay || 0);
  return () => {
    clearTimeout(timeoutId);
  };
};
