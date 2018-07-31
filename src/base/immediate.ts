/**
 * @overview immediate
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { timeout } from './timeout';

export const immediate = (fn: fn | null, args?: any[], ctx?: any) => {
	try {
		setImmediate(() =>  fn && fn.apply(ctx || null, args || []));
  	return () => fn = null;
	} catch {
		return timeout(fn, 0, args, ctx);
	}
};
