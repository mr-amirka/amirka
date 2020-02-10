/**
 * @overview jsonp
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 *
 * @example
var data = {};
jsonp('http://localhost:80/api/metrics', data).then((response) => {
    window.DEVELOPMENT && console.log('response', response);
    instance.response = response;
    instance.loading = true;
},() => {
    instance.error = true;
    instance.loading = true;
})
*/

const time = require('../time');
const delay = require('../delay');
const merge = require('../merge');
const Deal = require('../CancelablePromise');
const script = require('./script');
const globalName = require('./globalNameProvider')(window, 'JSONP_');

const errorTimeout = 200;

module.exports = (url, options) => {
  return new Deal((resolve, reject) => {
    let stop;
    return script(url, merge([
      options,
      {
        query: merge([
          options && options.query,
          {
            // hostname: location.hostname,
            callback: globalName(function(response) {
              stop = true;
              resolve(response);
            }, '_' + time()),
          },
        ]),
      },
    ])).then(() => {
      stop || delay(() => {
        stop || reject('script error');
      }, errorTimeout);
    }, reject).cancel;
  });
};
