/**
 * @overview minimalist example
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {polyfill} from '../additional/polyfill';
import {store} from "../services/store";
import {ready} from "../services/ready";
import {mn} from "../services/mn";
import {mnSettings} from "../mn-presets/mn.settings";
import {mnStyle} from "../mn-presets/mn.style";
import {mnTheme} from "../mn-presets/mn.theme"

mnSettings(mn);
mnStyle(mn);
mnTheme(mn);
mn.checkAttrs.m = true;

polyfill({
	'CSS.escape': 'assets/standalone-shims/css.escape.shim.js',
	'Promise': 'assets/standalone-shims/promise.shim.js',
	'setImmediate': 'assets/standalone-shims/set-immediate.shim.js'
}, () => {

	ready(() => {
	  mn
	    .recursiveCheckNodeByAttr(document)
	    .compile();

	  console.log('minimalistNotation', mn.data);
	});

});



