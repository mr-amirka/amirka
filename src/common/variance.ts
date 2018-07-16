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

interface variance {
	(exp: string): string[];
	readonly core: (exp: string) => string[];
	readonly build: (ast: varianceAst[]) => string[]
}
interface varianceAst {
	prefix: string;
	childs?: varianceAst[];
}


export const variance = <variance> ((exp: string): string[] => core(exp).map(unslash));
//Экранирование служебных символов
const __split = escapedSplitProvider('|').core; //support escape
const regexpScope = /([^)(\\]+|\\.)|([\(\)])/gi;
const __push = [].push;
const __build = (<any> variance).build = (childs: varianceAst[]) => {
	const length = childs.length;
	const output: string[] = [];
	let parts: string[];
	let child: varianceAst;
	let end: number, pi: number, pl: number, i = 0;
	let next: string[], prev = [ '' ];
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

const core = (<any> variance).core = (exp: string) => {
	const levels = {};
	const childs: varianceAst[] = levels[0] = [];
	let depth = 0;
	let parts: string[] = [];
	exp.replace(regexpScope, (haystack: string, _prefix: string, scope: string) => {
		if (_prefix) {
			parts.push(_prefix);
			return '';
		}
		let last: varianceAst;
    if (scope == '(') {
    	(levels[depth] || (levels[depth] = [])).push(last = {prefix: parts.join('') });
      depth++;
      levels[depth] = last.childs = []; 
  	} else {
  		levels[depth].push({prefix: parts.join(''), childs: []});
    	if (--depth < 0) depth = 0;
  	}
    parts = [];
    return '';
	});
	if (parts.length) levels[depth].push({prefix: parts.join(''), childs: []});     
	return __build(childs);
};
