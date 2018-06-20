/**
 * @overview boot-app
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {polyfill} from '../additional/polyfill';
import {scriptLoad} from '../additional/script-load';

polyfill({
	'CSS.escape': 'assets/standalone-shims/css.escape.shim.js',
	'Promise': 'assets/standalone-shims/promise.shim.js',
	'setImmediate': 'assets/standalone-shims/set-immediate.shim.js'
}, () => scriptLoad('assets/app.js'));
