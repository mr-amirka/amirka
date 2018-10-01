/**
 * @overview cookieStorageProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 * //TODO: доделать
 */

const Emitter = require('../utils/emitter');
const fromJson = (s) => {
  try { return JSON.parse(s); } catch(e) {}
  return s;
};
module.exports = (instance, win) => {
	instance || (instance = {});
	const originLocalStorage = win.localStorage;
	const set = instance.set = (key, value) => {
		value === null || value === undefined
			? originLocalStorage.removeItem(key)
			: originLocalStorage.setItem(key, JSON.stringify(value));
		return instance;
	};
	const get = instance.get = (key) => fromJson(originLocalStorage.getItem(key));
	instance.remove = (key) => set(key, null);
	instance.getKeys = () => {
		const l = originLocalStorage.length;
		const keys = [];
		for(let i = 0; i < l; i++) keys.push(originLocalStorage.key(i));
		return keys;
	};
	instance.clear = () => {
		originLocalStorage.clear();
		return instance;
	};

	const emitters = {};
	instance.getEmitter = (key, defaultValue) => {
		return emitters[key] || (emitters[key] = initEmitter(key, defaultValue));
	};
  const locked = {};
	const initEmitter = (key, defaultValue) => {
		const _value = get(key);
		const emitter = new Emitter(_value === null || _value === undefined ? defaultValue : _value);
		emitter.on((value) => locked[key] || set(key, value));
		return emitter;
	};
	win.addEventListener('storage', (event) => {
    const key = event.key;
    if (!key) return;
    const emitter = emitters[key];
    if (!emitter) return;
    locked[key] = true;
  	emitter.emit(fromJson(event.newValue));
    delete locked[key];
  });
	return instance;
};
