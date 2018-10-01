/**
 * @overview minimalist notation standalone example
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const mn = require("../../src/services/mn").setPresets([
	require('../../src/mn-presets/mn.medias'),
	require('../../src/mn-presets/mn.runtime-prefixes'),
	require('../../src/mn-presets/mn.styles'),
	require('../../src/mn-presets/mn.states'),
	require('../../src/mn-presets/mn.theme'),
]);
require('../../src/services/polyfill').andReady({
	'CSS.escape': 'assets/css.escape.shim.js',
	'setImmediate': 'assets/set-immediate.shim.js'
}).finally(() => {
	mn.getCompiler('m').recursiveCheck(document)
	mn.compile();

	console.log('minimalistNotation', mn.data);
});
