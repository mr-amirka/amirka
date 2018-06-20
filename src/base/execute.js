/**
 * @overview execute
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

export const execute = (funcs, args, context) => {
  for (let i = 0; i < funcs.length; i++) funcs[i].apply(context, args);
  return true;
};