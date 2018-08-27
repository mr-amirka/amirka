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
 * }, window);
 * 
 */

import { get, set, extend } from 'lodash';
import { script } from './script';
import { Deal } from '../base/deal';
import { isPromise } from '../base/is-promise';
import { ready } from './ready';
import { _global as gl } from './_global';

export const polyfill = (_map: {[name: string]: any}, _global?: any) => {
	_global || (_global = gl);
	const map = extend({
		'Promise': Deal
	}, _map);
	const promises: Deal[] = [
		new Deal((resolve) => ready(resolve))
	];
	let value, promise;
	const __set = (k: string, v: any) => v && set(_global, k, v);
	for (let subjectPath in map) {
		if (get(_global, subjectPath)) continue;
		value = map[subjectPath];
		if (!value) continue;
		const type = typeof value;
		if (type === 'function') {
			if (isPromise(promise = value())) {
				promises.push(promise.finally((err: any, v: any) => __set(subjectPath, v)));
				continue;
			}
			__set(subjectPath, promise);
			continue;
		} 
		if (type === 'string') {
			promises.push(script(value));
			continue;
		}
		if (isPromise(value)) {
			promises.push(promise.finally((err: any, v: any) => __set(subjectPath, v)));
			continue;
		}
		set(_global, subjectPath, value);
	}
	return Deal.all(promises);
};