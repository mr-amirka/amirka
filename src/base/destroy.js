/**
 * @overview destroy
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

export const destroy = (funcs, args, context) => {
  context || (context = null);
  args || (args = []);
  for(;funcs.length;)(funcs.pop()).apply(context, args);
  return true;
};