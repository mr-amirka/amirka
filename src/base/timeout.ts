/**
 * @overview timeout
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

export const timeout = (fn: fn, delay?: number, args?: any[], ctx?: any) => {
  setTimeout(() => fn && fn.apply(ctx || null, args || []), delay || 0);
  return () => fn = <fn> null;
};