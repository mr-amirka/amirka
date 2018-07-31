/**
 * @overview script
 * Загрузчик скриптов
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { once } from '../base/once';
import { Deal } from '../base/deal';
import { immediate } from '../base/immediate';
import { mergeDepth } from '../base/merge-depth';
import { urlExtend, UrlOptions } from '../common/url-extend';

export interface ScriptOptions extends UrlOptions {
  tryLimit?: number;
  tryDelay?: number;
  attrs?: {[name: string]: string}
};

const defaultDepth = 10;
const defaultOptions: ScriptOptions = {
  tryLimit: 3,
  tryDelay: 5000
};

const noop = () => {};

export const script = (url: UrlOptions | string, options?: ScriptOptions): Deal => {
  return new Deal((resolve, reject, progress) => {        
    const _options = mergeDepth([ defaultOptions, options ], {}, defaultDepth);
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
      const instance = document.createElement('script');
      const head = document.getElementsByTagName('head')[0];
      const execute = instance.onload = once(() => {
        immediate(remove);
        const status = (<any> instance).status || 200;
        if (status > 199 && status < 400) return resolve();
        __reject('status ' + status);
      });
      const __reject = instance.onerror = once(err => {
        immediate(remove);
        if (stop || tryCount > tryLimit) return reject(err);
        console.error('err', err, 'try:', tryCount);
        promiseTimeout = Deal.timeout(tryDelay).then(trying);
      });

      (<any> instance).onreadystatechange = () => /complete|loaded/.test((<any>instance).readyState) && execute();
      instance.onprogress = progress;
      instance.type = 'text/javascript';
      instance.charset = 'utf-8';
      instance.async = true;
      let attrs = _options.attrs;
      for (let k in attrs) instance.setAttribute(k, attrs[k]);
      instance.src = _url;
      remove = once(() => head.removeChild(instance));
      head.appendChild(instance);
      abort = (<any> instance).abort ? noop : () => (<any> instance).abort();
    }
    let promiseTimeout = Deal.resolve().then(trying);  
    return () => {
      if (stop) return false;
      stop = true;
      promiseTimeout.cancel();
      remove();
      abort();
      //console.warn('abort script', { url: _url });
      return true;
    };

  });
};