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

export const variance = (path) => core(path).map(unslash);
//Экранирование служебных символов
const __split = escapedSplitProvider('|').core; //support escape
const regexpScope = /([^)(\\]+)|(\\.)|([\(\)])/gi;
const __push = [].push;
const __prefix = variance.prefix = (output, values, prefix) => {
	for (let i = 0, l = values.length; i < l; i++) output.push(prefix + values[i]);
	return output;
};
const	__suffix = variance.suffix = (output, values, suffix) =>{
	for (let i = 0, l = values.length; i < l; i++) output.push(values[i] + suffix);
	return output;
};
const __join = (output, prefixes, suffixes) => {
  for (let i = 0, si, l = prefixes.length, sl = suffixes.length, prefix; i < l; i++) {
    prefix = prefixes[i];
    for (si = 0; si < sl; si++) output.push(prefix + suffixes[si]);
	}
	return output;
};
const __parse = variance.parse = (prefixParts, childs) => {
	if (childs.length < 1) return prefixParts;
  const output = [], l = childs.length;
  __push.apply(output, prefixParts);
	let parts, i = 1, child = childs[0], inner = [], prefix = output.pop() || '';
	let prev = __parse(__split(child.prefix), child.childs);
	for (; i < l; i++) {
		child = childs[i];
		parts = __split(child.prefix);
		if (parts.length < 2) {
			prev = __join([], prev, __parse(parts, child.childs));
		} else {
			__suffix(inner, prev, parts.shift() || '');	
			prev = __parse(parts, child.childs);
		} 		
	}
	__push.apply(inner, prev);
	__prefix(output, inner, prefix);
	return output;
};

const core = variance.core = (path) => {
	const levels = {};
	const childs = levels[0] = [];
	let depth = 0;
	let parts = [];
	path.replace(regexpScope, (haystack, _prefix, slash, scope) => {
		//console.log({ _prefix, slash, scope });
		if (slash) {
			parts.push(slash);
			return;
		}
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
	const output = __parse([ '' ], childs);
	return output;
};
	