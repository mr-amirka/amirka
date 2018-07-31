/**
 * @overview request
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { param } from '../common/param';
import { once } from '../base/once';
import { Deal } from '../base/deal';
import { mergeDepth } from '../base/merge-depth';
import { urlExtend, UrlOptions } from '../common/url-extend';

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

const defaultTypes = {
  json: {
    encode: (v: any) => JSON.stringify(v),
    headers:{
      'Content-Type': 'application/json; charset=utf-8'
    }
  },
  form: {
    encode: param,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }
};

const defaultOptions: RequestOptions = {
  method: 'GET',
  timeout: 200000,
  responseType: 'json',
  type: 'form',
  tryLimit: 3,
  tryDelay: 5000,
  headers: {
    'Accept': 'application/json, text/javascript, */*',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
};

const defaultDepth = 10;
const noop = () => {};

export interface Request {
  (url: UrlOptions | string, options?: RequestOptions): Deal;
}


export const request: Request = (url: UrlOptions | string, options?: RequestOptions): Deal => {

  const _options = mergeDepth([ defaultOptions, options ], {}, defaultDepth);

  const body = _options.body;
  const method = _options.method;
  
  const timeout = _options.timeout;
  const responseType = _options.responseType;
  const type = _options.type.toLowerCase();
  const typeConfig = defaultTypes[type];

  return new Deal((resolve, reject, progress) => {        
    
    let headers = _options.headers;
    let encodedBody = body || '';
   
    if (typeConfig && typeof typeConfig === 'object'){
      headers = mergeDepth([ headers, typeConfig.headers ], {});
      let encode = typeConfig.encode;
      if (typeof encode === 'function') encodedBody = encode(encodedBody);
    }

    const _url = <string> urlExtend(url, _options).href;
    const tryLimit = _options.tryLimit || 0;
    const tryDelay = _options.tryDelay || 0;
    let abort: fn, remove: fn, tryCount = 1, stop: boolean = false;
    function trying() {
      progress({
        loaded: 0,
        total: 1,
        tryCount, 
        tryLimit
      });
      tryCount++;
      const xhr = new XMLHttpRequest();
      xhr.open(method, _url, true);
      const execute = xhr.onload = once(() => {
        const status = xhr.status || 200;
        if (status > 199 && status < 400) return resolve(xhr.response);
        __reject('status ' + status);
      });
      const __reject = xhr.onerror = once(err => {
        if (stop || tryCount > tryLimit) return reject(err);
        console.error('err', err, 'try:', tryCount);
        promiseTimeout = Deal.timeout(tryDelay).then(trying);
      });
      abort = xhr.abort ? noop : () => xhr.abort();

      xhr.onreadystatechange = () => xhr.readyState == XMLHttpRequest.DONE && execute();
      xhr.onprogress = progress;

      if (headers) {
        for (let k in headers) {
          try {
            xhr.setRequestHeader(k, headers[k]);
          } catch(ex) {console.warn(ex)};
        }
      }
      if (timeout) xhr.timeout = timeout;
      if (responseType) xhr.responseType = responseType;
      xhr.send(encodedBody);
    }
    let promiseTimeout = Deal.resolve().then(trying);  
    return () => {
      if (stop) return false;
      stop = true;
      promiseTimeout.cancel();
      remove();
      abort();
      /*
      console.warn('abort request', {
        url, method, type, responseType,
        body, encodedBody
      });
      */
      return true;
    };

  }).then((response) => {
    return typeof response === 'string' && responseType === 'json'
      ? JSON.parse(response)
      : response;
  });
};