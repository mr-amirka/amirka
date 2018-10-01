/**
 * @overview request
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const once = require('../utils/once');
const mergeDepth = require('../utils/merge-depth');
const urlExtend = require('../utils/url-extend');
const Deal = require('./deal');

const CONNECTION_ERRORS = [ 0, 408 ];

const defaultTypes = {
  json: {
    encode: v => JSON.stringify(v),
    headers:{
      'Content-Type': 'application/json; charset=utf-8'
    }
  },
  form: {
    encode: require('../utils/param'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }
};

const defaultOptions = {
  method: 'GET',
  timeout: 200000,
  responseType: 'json',
  type: 'form',
  tryLimit: 30,
  tryDelay: 10000,
  headers: {
    'Accept': 'application/json, text/javascript, */*',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
};

const defaultDepth = 10;
const noop = () => {};

module.exports = (url, options) => {
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
      const xhr = new XMLHttpRequest();
      xhr.open(method, _url, true);
      let hasError, hasConnectionError;
      const execute = xhr.onload = once(() => {
        if (hasError) return;
        const status = xhr.status || 0;
        if (status > 199 && status < 400) return resolve(xhr.response);
        __reject('status ' + status);
      });
      const __reject = xhr.onerror = once(err => {
        hasError = true;
        if (stop || CONNECTION_ERRORS.indexOf(xhr.status || 0) === -1 && tryCount > tryLimit) return reject(err);
        console.error('err', err, 'try:', tryCount);
        tryCount++;
        promiseTimeout = Deal.delay(tryDelay).then(trying);
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
      return true;
    };

  }).then(
    (response) => typeof response === 'string' && responseType === 'json'
      ? JSON.parse(response)
      : response
  );
};
