/**
 * @overview cookieStorageProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 */

import {IStorage} from "./storage";

declare const cookieStorageProvider: (win: Window) => IStorage;
export = cookieStorageProvider;
