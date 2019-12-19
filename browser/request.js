/**
 * @overview request
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

// TODO: refactor

const noop = require('../noop');
const noopHandle = require('../noopHandle');
const once = require('../once');
const extend = require('../extend');
const merge = require('../merge');
const Deal = require('../CancelablePromise');
const urlExtend = require('../urlExtend');
const decorate = require('../decorate');
const isString = require('../isString');
const JSON = require('../json');

const CONNECTION_ERRORS = [0, 408];

const defaultTypes = {
  json: {
    encode: JSON.stringify,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  },
  urlencoded: {
    encode: require('../param'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  },
  text: {
    encode: (v) => isString(v) ? v : JSON.stringify(v),
    headers: {
      'Content-Type': 'text/plain; charset=UTF-8',
    },
  },
  form: {
    encode: noopHandle,
    headers: {},
  },
};

const defaultOptions = {
  method: 'GET',
  timeout: 200000,
  responseType: 'json',
  encoding: 'urlencoded',
  tryLimit: 0,
  tryDelay: 10000,
  headers: {
    'Accept': 'application/json, text/javascript, */*',
  },
};

const request = module.exports = decorate((url, options) => {
  const __options = merge([defaultOptions, options], {});
  __options.headers = merge([defaultOptions.headers, __options.headers]);
  return base(extend(__options, urlExtend(url, __options)));
});
const base = request.base = (_options) => {
  const tryLimit = _options.tryLimit || 0;
  const tryDelay = _options.tryDelay || 0;
  const body = _options.body;
  const method = _options.method;
  const timeout = _options.timeout;
  const responseType = _options.responseType;
  const encoding = _options.encoding.toLowerCase();
  const encodingConfig = defaultTypes[encoding];
  const _url = _options.href;

  let headers = _options.headers;
  let encodedBody = body || '';
  if (encodingConfig && typeof encodingConfig === 'object') {
    headers = merge([headers, encodingConfig.headers], {});
    const encode = encodingConfig.encode;
    if (typeof encode === 'function') encodedBody = encode(encodedBody);
  }

  return new Deal((resolve, reject) => {
    let abort, remove, tryCount = 1, stop = false; //eslint-disable-line
    function trying() {
      var XHR1 = window.XMLHttpRequest, XHR2 = window.ActiveXObject; //eslint-disable-line
      var XHR = XHR1 || XHR2; //eslint-disable-line
      var k, xhr = XHR1 ? (new XHR1()) : (new XHR2("Microsoft.XMLHTTP")); //eslint-disable-line

      xhr.open(method, _url, true);
      let hasError;
      const execute = xhr.onload = once(() => {
        if (hasError) return;
        const status = xhr.status || 0;
        status > 199 && status < 400
          ? resolve(xhr.response)
          : __reject(new Error('status ' + status));
      });
      const __reject = xhr.onerror = once((err) => {
        hasError = true;
        if (stop) return;
        if (CONNECTION_ERRORS.indexOf(xhr.status || 0) === -1
          || tryCount > tryLimit) return reject(err);
        console.warn('error: ', err, ' | try: ', tryCount);
        tryCount++;
        promiseTimeout = Deal.delay(tryDelay).then(trying);
      });
      abort = xhr.abort ? noop : () => {
        xhr.abort();
      };

      xhr.onreadystatechange = () => {
        xhr.readyState == XHR.DONE && execute();
      };

      for (k in headers) { //eslint-disable-line
        try {
          xhr.setRequestHeader(k, headers[k]);
        } catch (ex) {
          console.warn(ex);
        };
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
      abort();
      return true;
    };
  }).then(
      (response) => typeof response === 'string' && responseType === 'json'
        ? JSON.parse(response)
        : response,
  );
};
