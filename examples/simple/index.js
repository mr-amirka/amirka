/**
 * @overview minimalist example
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {polyfill} from '../../src/additional/polyfill';
import {store} from "../../src/services/store";
import {ready} from "../../src/services/ready";
import {mn} from "../../src/services/mn";
import {mnSettings} from "../../src/mn-presets/mn.settings";
import {mnStyle} from "../../src/mn-presets/mn.style";
import {mnTheme} from "../../src/mn-presets/mn.theme"

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



