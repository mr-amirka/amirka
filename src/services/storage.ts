/**
 * @overview Storage
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import * as Emitter from '../utils/emitter';

export interface Storage {
  set: (key: string, value: any) => Storage;
  get: (key: string) => any;
  remove: (key: string) => Storage;
  getKeys: () => string[];
  clear: () => Storage;
  getEmitter: (key: string, defaultValue?: any) => Emitter<any>;
}
