/**
 * @overview trim
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

const escapeRegExp = require('./escape-reg-exp');
module.exports = (v, pattern) => {
	const p = escapeRegExp(pattern);
	return v.replace(new RegExp('^(' + p + ')+|(' + p + ')+$', 'g'), '');
};
