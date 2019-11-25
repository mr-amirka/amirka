/**
 * @overview Storage
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */


export interface Storage {
  set: (key: string, value: any) => Storage;
  get: (key: string) => any;
  remove: (key: string) => Storage;
  getKeys: () => string[];
  clear: () => Storage;
  on: (watcher: (value: any) => any) => void;
}
