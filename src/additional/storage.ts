/**
 * @overview Storage
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { BehaviorSubject } from 'rxjs';

export interface Storage {
  set: (key: string, value: any) => Storage;
  get: (key: string) => any;
  remove: (key: string) => Storage;
  subject: (key: string, defaultValue?: any) => BehaviorSubject <any>;
}