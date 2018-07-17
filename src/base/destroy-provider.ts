/**
 * @overview destroyProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { executeEach } from './execute-each';

interface destroyProvider {
	(..._destroyers: any[]): destroy;
}
interface destroy {
	(...args: any[]): destroy;
	add: (fn?: fn) => destroy;
}

export const destroyProvider: destroyProvider = <destroyProvider> function(){
	let destroyers: fn[] = [];
	const instance: destroy = <destroy> function () {
		const _destroyers = destroyers;
		destroyers = []
		executeEach(_destroyers, <any> arguments, this);
		return instance;
	};
	const add = instance.add = (fn?: fn) => {
		if (typeof fn === 'function') destroyers.push(fn);
		return instance;
	};
	[].forEach.call(<any> arguments, add);
	return instance;
};