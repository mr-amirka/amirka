/**
 * @overview localStorageProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 */

import {IStorage} from "./storage";
declare const localStorageProvider: (win: Window) => IStorage;
export = localStorageProvider;
