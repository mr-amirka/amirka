/**
 * @overview cookieStorageProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 */

const emitterProvider = require('../Emitter');
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

module.exports = (ctx) => {
  const instance = emitterProvider();
  const emit = instance.emit;
	const doc = ctx.document;
	const cache = storageInit(doc.cookie);
	const __set = (key, value) => {
		const date = new Date();
		date.setMilliseconds(date.getMilliseconds() + expires);
		doc.cookie = encodeURIComponent(key) + '='
			+ encodeURIComponent(value) + '; expires=' + date.toUTCString();
	};
  instance.on(({ key, value }) => {
		if (value === cache[key]) return;
		if (value === null || value === undefined) {
	    delete cache[key];
			__set(key, '');
		} else {
			__set(key, JSON.stringify(cache[key] = value));
		}
	});
	const set = instance.set = (key, value) => {
    emit({ key, value });
		return instance;
	};
	instance.get = (key) => cache[key];
	instance.remove = (key) => set(key, null);
	instance.getKeys = () => Object.keys(cache);
	instance.clear = () => {
		for (let key in cache) emit({
      key,
      value: cache[key]
    });
		return instance;
	};
  return instance;
};
