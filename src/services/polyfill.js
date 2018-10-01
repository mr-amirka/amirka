/**
 * @overview polyfill
 * Подгружает полифилы, если нет оригинальной реализации
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 * @example
 *
 * polyfill({
 *   'CSS.escape': 'assets/standalone-shims/css.escape.shim.js',
 *   'Promise': 'assets/standalone-shims/promise.shim.js'
 * }, window);
 *
 */

const extend = require('../utils/extend');
const forIn = require('../utils/for-in');
const baseGet = require('../utils/get').core;
const baseSet = require('../utils/set').core;
const isPromise = require('../utils/is-promise');
const script = require('./script');
const Deal = require('./deal');
const readyProvider = require('./ready-provider');
const gl = require('./_global');

const polyfill = module.exports = (_map, _global) => {
	_global || (_global = gl);
	const map = extend({ 'Promise': Deal }, _map);
	const promises = [];
	forIn(map, (value, subjectPath) => {
		const path = subjectPath.split('.');
		if (baseGet(_global, path) || !value) return;
		const type = typeof value;
		if (type === 'function') {
			return isPromise(value = value())
				? promises.push(value.finally((err, v) => v && baseSet(_global, path, v)))
				: baseSet(_global, path, value);
		}
		if (type === 'string') {
			return promises.push(script(value));
		}
		isPromise(value)
			? promises.push(value.finally((err, v) => v && baseSet(_global, path, v)))
			: baseSet(_global, path, value);
	})
	return Deal.all(promises);
};
polyfill.andReady = (_map, _global) =>
	polyfill(_map, _global).then(() => new Deal(resolve => readyProvider(_global || gl)(resolve)));
