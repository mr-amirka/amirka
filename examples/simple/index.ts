/**
 * @overview minimalist example
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {Deal} from '../../src/base/deal';
import {polyfill} from '../../src/additional/polyfill';
//import {store} from "../../src/services/store";
import {ready} from "../../src/services/ready";
import {mn} from "../../src/services/mn";
import {mnSettings} from "../../src/mn-presets/mn.settings";
import {mnStyle} from "../../src/mn-presets/mn.style";
import {mnTheme} from "../../src/mn-presets/mn.theme"

mnSettings(mn);
mnStyle(mn);
mnTheme(mn);
mn.checkAttrs.m = true;

Deal.all([
	new Deal((resolve) => ready(resolve)),
	polyfill({
		'CSS.escape': 'assets/standalone-shims/css.escape.shim.js',
		'Promise': () => (<any>window).Promise = Deal
	})
]).finally(() => {
	mn
    .recursiveCheckNodeByAttr(document)
    .compile();

  console.log('minimalistNotation', mn.data);
});

