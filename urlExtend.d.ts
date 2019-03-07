/**
 * @overview urlExtend
 * - парсит и мерджит url
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { UrlOptions } from './urlParse';
declare namespace urlExtend {
  export interface urlExtend {
    (dst: string | UrlOptions, src: string | UrlOptions): UrlOptions;
  }
}

declare const urlExtend: urlExtend.urlExtend;
export = urlExtend;
