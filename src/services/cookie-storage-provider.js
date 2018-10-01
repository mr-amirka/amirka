/**
 * @overview cookieStorageProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 * //TODO: доделать
 */

const Emitter = require('../utils/emitter');
const expires = 400 * 86400000;

const fromJson = (s) => {
  try { return JSON.parse(s); } catch(e) {}
  return s;
};

const storageInit = (cookie) => {
	const w = cookie ? cookie.split('; ') : [];
	const l = w.length;
	const output = {};
  for(let i = 0, parts, k; i < l; i++) {
    k = decodeURIComponent((parts = w[i].split('='))[0]);
    output[k] = fromJson(decodeURIComponent(parts[1]));
  }
  return output;
};

module.exports = (instance, win) => {
	instance || (instance = {});
	const doc = win.document;
	const cache = storageInit(doc.cookie);
	const __set = (key, value) => {
		const date = new Date();
		date.setMilliseconds(date.getMilliseconds() + expires);
		doc.cookie = encodeURIComponent(key) + '='
			+ encodeURIComponent(value) + '; expires=' + date.toUTCString();
	};
	const privateSet = (key, value) => {
		if (value === cache[key]) return;
		if (value === null || value === undefined) {
	    delete cache[key];
			__set(key, '');
		} else {
			__set(key, JSON.stringify(cache[key] = value));
		}
	};
	const set = instance.set = (key, value) => {
		const emitter = emitters[key];
		emitter ? emitter.emit(value) : privateSet(key, value);
		return instance;
	};
	instance.get = (key) => cache[key];
	instance.remove = (key) => set(key, null);
	instance.getKeys = () => Object.keys(cache);
	instance.clear = () => {
		let v$;
		for (let k in cache) {
			(v$ = emitters[k])
				? v$.next(null)
				: privateSet(k, null);
		}
		return instance;
	};

	const emitters = {};
	instance.getEmitter = (key, defaultValue) => {
		return emitters[key] || (emitters[key] = initEmitter(key, defaultValue));
	};
	const initEmitter = (key, defaultValue) => {
		const _value = cache[key];
		const emitter = new Emitter(_value === undefined ? defaultValue : _value);
		emitter.on((value) => privateSet(key, value));
		return emitter;
	};
	return instance;
};
