const http = require('http');
const https = require('https');
const isObject = require('../isObject');
const extend = require('../extend');
const Deal = require('../CancelablePromise');
const urlExtend = require('../urlExtend');

function methodProvider(method) {
  method = method.toUpperCase();
  return (url, options) => {
    return new Deal((resolve, reject) => {
      const __options = urlExtend(url, options = options || {});
      const __url = __options.href;
      const headers = extend({}, options.headers);
      let body = options.body;

      body && isObject(body) && (body = JSON.stringify(body));
      body && (body = Buffer.from(body, 'utf-8'));
      body && (headers['Content-Length'] = body.length);

      const req = (__options.protocol === 'https' ? https : http).request(
          __url,
          {
            method,
            headers,
          },
          (res) => {
            const {statusCode} = res;
            let error;
            if (statusCode !== 200) {
              error = new Error('Request Failed.\n'
              + `Status Code: ${statusCode}`);
            }
            if (error) {
              res.resume();
              reject(error);
              return;
            }

            res.setEncoding('utf8');
            const rawData = [];
            res.on('data', (chunk) => {
              rawData.push(chunk);
            });
            res.on('end', () => {
              const body = rawData.join('');
              try {
                resolve(JSON.parse(body));
              } catch (e) {
                resolve(body);
              }
            });
          })
          .on('error', (e) => {
            reject(e);
          });
      body && req.write(body);
      req.end();
      return () => {
        req.abort();
      };
    });
  };
}
module.exports = {
  get: methodProvider('get'),
  post: methodProvider('post'),
  options: methodProvider('options'),
};
