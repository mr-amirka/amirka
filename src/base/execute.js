/**
 * @overview execute
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

export const execute = (funcs, args, context) => {
	const length = funcs.length;
  for (let i = 0; i < length; i++) funcs[i].apply(context, args);
  return true;
};
export const executeProvider = execute.provider = (funcs) => {
	return function() {
		return execute(funcs, arguments, this);
	};
};