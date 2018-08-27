/**
 * @overview localStorage
 * @author Absolutely Amir <mr.amirka@ya.ru>
 * 
 * //TODO: доделать
 */


import { localStorageProvider } from './local-storage-provider';
import { cookieStorage } from './cookie-storage';

export const localStorage = window.localStorage 
	? localStorageProvider({}, window) 
	: cookieStorage;