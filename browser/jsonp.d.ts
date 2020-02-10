/**
 * @overview jsonp
 * @author Amir Absalyamov <mr.amirka@ya.ru>
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

import * as script from './script';
import * as Deal from 'mn-utils/CancelablePromise';

declare const jsonp: (url: script.ScriptOptions | string, options?: script.ScriptOptions) => Deal;
export = jsonp;
