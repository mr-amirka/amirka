/**
 * @overview subscribleInit
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

export const subscribleInit = (init: fn) => {
	let count = 0, cancel: fn;
	return () => {
		let _count = count;
		count++;
		_count || (cancel = init());
		let called: boolean;
		return () => {
			if (called) return false;
			called = true;
			--count || cancel();
			return true;
		};
	};
};