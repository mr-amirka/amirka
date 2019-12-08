/**
 * @overview cookieStorageProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const forEach = require('../forEach');
const emitterProvider = require('../Emitter');

const fromJson = (s) => {
  try { return JSON.parse(s); } catch(e) {}
  return s;
};
module.exports = (win) => {
  let locked;
  const instance = emitterProvider();
  const emit = instance.emit;
	const originLocalStorage = win.localStorage;
	instance.on(({ key, value }) => {
    if (locked) return;
		value === null || value === undefined
			? originLocalStorage.removeItem(key)
			: originLocalStorage.setItem(key, JSON.stringify(value));
	});
  const __set = instance.set = (key, value) => {
		emit({ key, value });
		return instance;
	};
	instance.get = key => fromJson(originLocalStorage.getItem(key));
	instance.remove = (key) => __set(key, null);
	const getKeys = instance.getKeys = () => {
		const l = originLocalStorage.length;
		const keys = [];
		for(let i = 0; i < l; i++) keys.push(originLocalStorage.key(i));
		return keys;
	};
	instance.clear = () => {
    forEach(getKeys(), (key) => {
      emit({ key, value: null });
    });
		return instance;
	};

	win.addEventListener('storage', (event) => {
    locked = true;
    emit({
      key: event.key,
      value: fromJson(event.newValue)
    });
    locked = false;
  });
	return instance;
};
