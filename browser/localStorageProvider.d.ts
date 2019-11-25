/**
 * @overview cookieStorageProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 * //TODO: доделать
 */

import { Storage } from './storage';
declare const localStorageProvider: (win: Window) => Storage;
export = localStorageProvider;
