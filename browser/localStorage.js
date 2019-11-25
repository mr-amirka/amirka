/**
 * @overview localStorage
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = window.localStorage
	? require('./localStorageProvider')(window)
	: require('./cookieStorage');
