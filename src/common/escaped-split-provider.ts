/**
 * @overview escapedSplitProvider
 * Разбивает строку на подстроки с учетом экранирования служебного символа
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {isRegExp, escapeRegExp, map} from 'lodash';
import {unslash} from './unslash';

interface escapedSplit {
	(input: string, dstSeparators?: string[]): string[];
	core: (input: string, dstSeparators?: string[]) => string[];
}

export const escapedSplitProvider = (separator: string | RegExp) => {
	if (isRegExp(separator)) {
	  separator = separator.toString();
	  separator = separator.substr(1, separator.length - 2);
	} else {
		separator = escapeRegExp(separator);
	}
	const regexp = new RegExp('(\\\\.)|(' + separator + ')', 'g');
	const escapedSplit: escapedSplit = <escapedSplit> ((input: string, dstSeparators?: string[]) => map(core(input, dstSeparators), unslash));
	const core = (<any> escapedSplit).core = (input: string, dstSeparators?: string[]) => {
		let lastOffset = 0;
		const output: string[] = [];
		let v: string[] = [];
    input.replace(regexp, function(all: string, escaped: string, separator: string) {
    	const offset: number = arguments[arguments.length - 2];
    	v.push(input.substr(lastOffset, offset - lastOffset));
			if (escaped) {
				v.push(escaped);
			} else {
				if (dstSeparators) dstSeparators.push(separator);
				output.push(v.join(''));
				v = [];
			}
      lastOffset = offset + all.length;
      return '';
    });
    v.push(input.substr(lastOffset));
    output.push(v.join(''));
		return output;
	};
	return escapedSplit;
};
