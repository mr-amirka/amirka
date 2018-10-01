/**
 * @overview cookieStorageProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 * //TODO: доделать
 */


import { Storage } from './storage';

declare const cookieStorageProvider: (instance: any, win: Window) => Storage;
export = cookieStorageProvider;
