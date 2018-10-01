/**
 * @overview request
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */


import { UrlOptions } from '../utils/url-extend';
import * as Deal from './deal';

declare namespace request {
  export interface RequestOptions extends UrlOptions {
    tryLimit?: number;
    tryDelay?: number;
    timeout?: number;
    body?: any;
    method?: string;
    type?: string;
    responseType?: string;
    headers?: {[name: string]: string}
  }
  export interface Request {
    (url: UrlOptions | string, options?: RequestOptions): Deal;
  }
}
declare const request: request.Request; 
export = request;
