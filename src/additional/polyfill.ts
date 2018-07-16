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

import {support} from '../base/support';
import {script} from './script';
import {Deal} from '../base/deal';

export const polyfill = (map: {[name: string]: string}) => {
	const tests: Deal[] = [];
	for (let subjectPath in map) support(subjectPath) || tests.push(script(map[subjectPath]));
	return Deal.all(tests);
};