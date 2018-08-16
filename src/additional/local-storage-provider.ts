/**
 * @overview cookieStorageProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 * 
 * //TODO: доделать
 */

import { BehaviorSubject } from 'rxjs';
import { Storage } from './storage';


const fromJson = (s: any): any => {
  try { return JSON.parse(s); } catch(e) {}
  return s;
};

export const localStorageProvider = (instance: any, win: Window): Storage => {

	instance || (instance = {});

	const originLocalStorage = win.localStorage;


	const set = instance.set = (key: string, value: any) => {
		originLocalStorage.setItem(key, JSON.stringify(value));
		return instance;
	};
	const get = instance.get = (key: string) => fromJson(originLocalStorage.getItem(key));
	instance.remove = (key: string) => set(key, null);
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

	const observables: {[key: string]: BehaviorSubject <any>} = {};
	instance.observable = (key: string, defaultValue?: any) => {
		return observables[key] || (observables[key] = initObservable(key, defaultValue));
	};
	const initObservable = (key: string, defaultValue?: any) => {
		const _value = get(key);
		const value$ = new BehaviorSubject(_value === null || _value === undefined ? defaultValue : _value);
		value$.subscribe((value: any) => set(key, value));
		win.addEventListener('storage', (event) => {
            const key = event.key;
            if (!key) return;
            const value$ = observables[key];
        	value$ && value$.next(fromJson(event.newValue));
        });
		return value$;
	};
	return instance;
};