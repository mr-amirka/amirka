/**
 * @overview minimalist example
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {polyfill} from '../../src/services/polyfill';
import {mn} from "../../src/services/mn";
import {mnSettings} from "../../src/mn-presets/mn.settings";
import {mnStyle} from "../../src/mn-presets/mn.style";
import {mnTheme} from "../../src/mn-presets/mn.theme"

mnSettings(mn);
mnStyle(mn);
mnTheme(mn);

polyfill({
	'CSS.escape': 'assets/standalone-shims/css.escape.shim.js'
}).finally(() => {
	mn
    .recursiveCheckNodeByAttr(document)
    .compile();

  console.log('minimalistNotation', mn.data);
});

