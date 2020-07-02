/**
 * @overview script
 * Загрузчик скриптов
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {
  CancelablePromise,
  IUrlOptions,
} from "../global";

interface IScriptOptions extends IUrlOptions {
  attrs?: {
    [name: string]: string,
  };
}
interface IScript {
  (url: IUrlOptions | string, options?: IScriptOptions): CancelablePromise<any>;
  base: (options: IScriptOptions) => CancelablePromise<any>;
}

declare const script: IScript;
export = script;
