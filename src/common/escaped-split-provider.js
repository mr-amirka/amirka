/**
 * @overview escapedSplitProvider
 * Разбивает строку на подстроки с учетом экранирования служебного символа
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {isRegExp, escapeRegExp} from 'lodash';
import {slash} from './unslash';

export const escapedSplitProvider = (separator) => {
	if (isRegExp(separator)) {
	  separator = separator.toString();
	  separator = separator.substr(1, separator.length - 2);
	} else {
		separator = escapeRegExp(separator);
	}
	const regexp = new RegExp('(\\\\.)|(' + separator + ')', 'g');
	const escapedSplit = (input, dstSeparators) => unslash(core(input, dstSeparators));
	const core = escapedSplit.core = (input, dstSeparators) => {
		let lastOffset = 0;
		const output = [];
		let v = [];
    input.replace(regexp, function(all, escaped, separator) {
    	const offset = arguments[arguments.length - 2];
    	v.push(input.substr(lastOffset, offset - lastOffset));
			if (escaped) {
				v.push(escaped);
			} else {
				if (dstSeparators) dstSeparators.push(separator);
				output.push(v.join(''));
				v = [];
			}
      lastOffset = offset + all.length;
    });
    v.push(input.substr(lastOffset));
    output.push(v.join(''));
		return output;
	};
	return escapedSplit;
};
