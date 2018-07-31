/**
 * @overview polyfill
 * Подгружает полифилы, если нет оригинальной реализации
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 * @example
 * 
 * polyfill({
 *   'CSS.escape': 'assets/standalone-shims/css.escape.shim.js',
 *   'Promise': 'assets/standalone-shims/promise.shim.js'
 * });
 * 
 */

import { support } from '../base/support';
import { script } from './script';
import { Deal } from '../base/deal';
import { isPromise } from '../base/is-promise';

export const polyfill = (map: {[name: string]: string | fn}) => {
	const promises: Deal[] = [];
	let value, promise;
	for (let subjectPath in map) {
		if (support(subjectPath)) continue;
		value = map[subjectPath];
		if (!value) continue;
		if (typeof value === 'function') {
			if (isPromise(promise = value())) {
				promises.push(promise)
			}
			continue;
		}
		promises.push(script(value));
	}
	return Deal.all(promises);
};