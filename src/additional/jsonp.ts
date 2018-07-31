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

import { script, ScriptOptions } from './script';
import { globalNameProvider } from './global-name-provider';
import { Deal } from '../base/deal';
import { mergeDepth } from '../base/merge-depth';

const globalName = globalNameProvider(window, 'JSONP_');

export const jsonp = (url: ScriptOptions | string, options?: ScriptOptions): Deal => {
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