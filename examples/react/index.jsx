
import React from 'react';
import { render } from 'react-dom';
import { Root } from './components/root';

require("../../src/services/mn").setPresets([
	require('../../src/mn-presets/mn.medias'),
	require('../../src/mn-presets/mn.runtime-prefixes'),
	require('../../src/mn-presets/mn.styles'),
	require('../../src/mn-presets/mn.states'),
	require('../../src/mn-presets/mn.theme'),
]);
require('../../src/services/polyfill').andReady({
	'CSS.escape': 'assets/css.escape.shim.js'
}).finally(() => [].forEach.call(
	document.querySelectorAll('[root]'),
	(node) => render(<Root/>, node)
));
