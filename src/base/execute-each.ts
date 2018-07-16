/**
 * @overview executeEach
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

export const executeEach: callEach = (funcs, args, context) => {
	const length = funcs.length;
  for (let i = 0; i < length; i++) funcs[i].apply(context, args);
  return true;
};