/**
 * @overview mapValues
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

module.exports = (input, iteratee) => {
	const output = {};
	for (let k in input) output[k] = iteratee(input[k], k);
	return output;
};
