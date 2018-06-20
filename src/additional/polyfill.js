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

import {support} from './support';
import {scriptLoad} from './script-load';
import {doneAll} from './done-all';

export const polyfill = (map, complete) => {
	const tests = [];
	for (let subjectPath in map) {
		if (support(subjectPath)) continue;
		tests.push(wrap(map[subjectPath]));
	}
	return doneAll(tests, complete);
};
const wrap = (scriptUrl) => {
	return done => scriptLoad(scriptUrl, done);
};