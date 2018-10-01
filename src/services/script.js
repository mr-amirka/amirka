/**
 * @overview script
 * Загрузчик скриптов
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const once = require('../utils/once');
const immediate = require('../utils/immediate');
const mergeDepth = require('../utils/merge-depth');
const urlExtend = require('../utils/url-extend');
const Deal = require('./deal');
const defaultDepth = 10;
const defaultOptions = {
  tryLimit: 1,
  tryDelay: 5000
};
const noop = () => {};
module.exports = (url, options) => {
  return new Deal((resolve, reject, progress) => {
    const _options = mergeDepth([ defaultOptions, options ], {}, defaultDepth);
    const _url = urlExtend(url, _options).href;
    const tryLimit = _options.tryLimit || 0;
    const tryDelay = _options.tryDelay || 0;
    let abort, remove, tryCount = 1, stop = false;
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
      let hasError;
      const execute = instance.onload = once(() => {
        if (hasError) return;
        immediate(remove);
        resolve();
      });
      instance.onerror = once(err => {
        hasError = true;
        immediate(remove);
        if (stop || tryCount > tryLimit) return reject(err);
        console.error('err', err, 'try:', tryCount);
        promiseTimeout = Deal.delay(tryDelay).then(trying);
      });

      instance.onreadystatechange = () => /complete|loaded/.test(instance.readyState) && execute();
      instance.onprogress = progress;
      instance.type = 'text/javascript';
      instance.charset = 'utf-8';
      instance.async = true;
      let attrs = _options.attrs;
      for (let k in attrs) instance.setAttribute(k, attrs[k]);
      instance.src = _url;
      remove = once(() => head.removeChild(instance));
      head.appendChild(instance);
      abort = instance.abort ? noop : () => instance.abort();
    }
    let promiseTimeout = Deal.resolve().then(trying);
    return () => {
      if (stop) return false;
      stop = true;
      promiseTimeout.cancel();
      remove();
      abort();
      return true;
    };

  });
};
