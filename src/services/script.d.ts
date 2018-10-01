/**
 * @overview script
 * Загрузчик скриптов
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { UrlOptions } from '../utils/url-parse';
import * as Deal from './deal';

declare namespace script {
  export interface ScriptOptions extends UrlOptions {
    tryLimit?: number;
    tryDelay?: number;
    attrs?: {[name: string]: string}
  }
  export interface script {
    (url: UrlOptions | string, options?: ScriptOptions): Deal;
  }
}
declare const script: script.script;
export = script;
