/**
 * @overview cookieStorage
 * @author Absolutely Amir <mr.amirka@ya.ru>
 * 
 * //TODO: доделать
 */


import { BehaviorSubject } from 'rxjs';
import { Storage } from './storage';

const storageProvider = (instance?: any): Storage => {
	instance || (instance = {});
	const cache = {};
	const set = instance.set = (key: string, value: any) => {
		cache[key] = value;
		return instance;
	};
	const get = instance.get = (key: string) => cache[key];
	instance.remove = (key: string) => {
		delete cache[key];
		return instance;
	};
	const observables: {[key: string]: BehaviorSubject <any>} = {};
	instance.subject = (key: string, defaultValue?: any) => {
		return observables[key] || (observables[key] = initSubject(key, defaultValue));
	};
	const initSubject = (key: string, defaultValue?: any) => {
		const _value = get(key);
		const value$ = new BehaviorSubject(_value === null || _value === undefined ? defaultValue : _value);
		value$.subscribe((value: any) => set(key, value));
		return value$;
	};
	return instance;
};

 export const cookieStorage = storageProvider();