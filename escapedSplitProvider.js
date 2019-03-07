/**
 * @overview escapedSplitProvider
 * Разбивает строку на подстроки с учетом экранирования служебного символа
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isRegExp = require('./isRegExp');
const escapeRegExp = require('./escapeRegExp');
const unslash = require('./unslash');
module.exports = (separator) => {
	separator = isRegExp(separator)
		? (separator = separator.toString()).substr(1, separator.length - 2)
		: escapeRegExp(separator);
	const regexp = new RegExp('(\\\\.)|(' + separator + ')', 'g');
	const escapedSplit = (input, dstSeparators) => core(input, dstSeparators).map(unslash);
	const core = escapedSplit.base = (input, dstSeparators) => {
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
	   	return '';
	  });
    v.push(input.substr(lastOffset));
    output.push(v.join(''));
		return output;
	};
	return escapedSplit;
};
