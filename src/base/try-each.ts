/**
 * @overview tryEach
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

export const tryEach: callEach = (funcs, args, context) => {
	const length = funcs.length;
  for (let i = 0; i < length; i++) {
  	try {
			funcs[i].apply(context, args);
		} catch (ex) {
			console.error(ex);
		}
  }
  return true;
};