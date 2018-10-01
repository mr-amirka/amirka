/**
 * @overview jsonp
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 * @example
var data = {};
jsonp({url: 'http://localhost:80/api/metrics', data }).then((response) => {
    window.DEVELOPMENT && console.log('response', response);
    instance.response = response;
    instance.loading = true;
},() => {
    instance.error = true;
    instance.loading = true;
})
*/
const mergeDepth = require('../utils/merge-depth');
const script = require('./script');
const Deal = require('./deal');
const globalName = require('./global-name-provider')(window, 'JSONP_');

module.exports = (url, options) => {
  return new Deal((resolve, reject, progress) => {
    return script(url, mergeDepth([
      options,
      {
        query: {
          hostname: location.hostname,
          timestamp: (new Date).getTime(),
          callback: globalName(resolve)
        }
      }
    ], {}, 2)).catch(reject, progress).cancel;
  })
};
