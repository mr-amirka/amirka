/**
 * @overview variance
 * - парсит строку с альтернативными подстроками, получая массив строк 
 * 
 * @example
 * variance('В(олод|ас)я'); => [ 'Володя', 'Вася' ]
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {unslash} from './unslash';
import {escapedSplitProvider} from './escaped-split-provider';
import {joinArrays} from './join-arrays';

export const variance = (path) => core(path).map(unslash);
//Экранирование служебных символов
const __split = escapedSplitProvider('|').core; //support escape
const regexpScope = /([^)(\\]+|\\.)|([\(\)])/gi;
const __push = [].push;
const __build = variance.build = (childs) => {
	const length = childs.length;
	const output = [];
	let parts, child, end, pi, pl, next, prev = [ '' ], i = 0;
	for (; i < length; i++) {
		child = childs[i];
		parts = __split(child.prefix);
		pl = parts.length;
		end = pl - 1;
		joinArrays(next = [], [ parts[end] ], __build(child.childs));
		if (end) {
			joinArrays(output, prev, [ parts[0] ]);
			prev = next;
			for (pi = 1; pi < end; pi++) {
				output.push(parts[pi]);
			}
		} else {
			prev = joinArrays([], prev, next);
		}
	}
	__push.apply(output, prev);
	return output;
};

const core = variance.core = (path) => {
	const levels = {};
	const childs = levels[0] = [];
	let depth = 0;
	let parts = [];
	path.replace(regexpScope, (haystack, _prefix, scope) => {
		if (_prefix) {
			parts.push(_prefix);
			return;
		}
		let last;
    if (scope == '(') {
    	(levels[depth] || (levels[depth] = [])).push(last = {prefix: parts.join('') });
      depth++;
      levels[depth] = last.childs = []; 
  	} else {
  		levels[depth].push({prefix: parts.join(''), childs: []});
    	if (--depth < 0) depth = 0;
  	}
    parts = [];
	});
	if (parts.length) levels[depth].push({prefix: parts.join(''), childs: []});     
	return __build(childs);
};
