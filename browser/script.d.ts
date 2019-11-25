/**
 * @overview script
 * Загрузчик скриптов
 *
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

import { UrlOptions } from 'mn-utils/urlParse';
import * as Deal from 'mn-utils/CancelablePromise';

declare namespace script {
  export interface ScriptOptions extends UrlOptions {
    attrs?: {[name: string]: string}
  }
  export interface script {
    (url: UrlOptions | string, options?: ScriptOptions): Deal;
    base: (options: ScriptOptions) => Deal;
  }
}
declare const script: script.script;
export = script;
