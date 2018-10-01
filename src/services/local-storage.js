/**
 * @overview localStorage
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

module.exports = window.localStorage
	? require('./local-storage-provider')({}, window)
	: require('./cookie-storage');
