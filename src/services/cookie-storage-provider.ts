/**
 * @overview cookieStorageProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 * 
 * //TODO: доделать
 */

import { isEqual } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Storage } from './storage';

import { cloneDepth } from '../base/clone-depth';


const expires = 400 * 86400000;
const depth = 10;

const fromJson = (s: string): any => {
  try { return JSON.parse(s); } catch(e) {}
  return s;
};

const storageInit = (cookie: string) => {
	const w = cookie ? cookie.split('; ') : [];
	const l = w.length;
	const output = {};
    for(let i = 0, parts, k; i < l; i++){
        k = decodeURIComponent((parts = w[i].split('='))[0]);
        output[k] = fromJson(decodeURIComponent(parts[1]));
    }
    return output;
};


export const cookieStorageProvider = (instance: any, doc: Document): Storage => {

	instance || (instance = {});

	const cache = storageInit(doc.cookie);
	const prev = {};
	const __set = (key: string, value: any) => {
		const date = new Date();
		date.setMilliseconds(date.getMilliseconds() + expires);
		doc.cookie = encodeURIComponent(key) + '=' 
			+ (value === null ? '' : encodeURIComponent(JSON.stringify(value))) + '; expires=' + date.toUTCString();
        const value$ = observables[key];
        value$ && value$.next(value);
	};
	const __remove = (key: string) => {
		delete prev[key];
        delete cache[key]
		__set(key, null);
	};
	const set = instance.set = (key: string, value: any) => {
		if (isEqual(value, prev[key])) return instance;
		if (value === null || value === undefined) {
			__remove(key);
		} else {
			prev[key] = cloneDepth(value, depth);
			__set(key, cache[key] = value);
		}
		return instance;
	};
	instance.get = (key: string) => cache[key];
	instance.remove = (key: string) => {
		__remove(key);
		return instance;
	};
	instance.getKeys = () => Object.keys(cache);
	instance.clear = () => {
		for (let k in cache) __remove(k);
		return instance;
	};

	const observables: {[key: string]: BehaviorSubject <any>} = {};
	instance.observable = (key: string, defaultValue?: any) => {
		return observables[key] || (observables[key] = initObservable(key, defaultValue));
	};
	const initObservable = (key: string, defaultValue?: any) => {
		const _value = cache[key];
		const value$ = new BehaviorSubject(_value === null || _value === undefined ? defaultValue : _value);
		value$.subscribe((value: any) => set(key, value));
		return value$;
	};
	return instance;
};