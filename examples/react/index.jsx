import React from 'react';
import { render } from 'react-dom';

import { polyfill } from '../../src/services/polyfill';

import { Root } from './components/root';

polyfill({
	'CSS.escape': 'assets/css.escape.shim.js'
}).finally(() => [].forEach.call(
	document.querySelectorAll('[root]'), 
	(node) => render(<Root/>, node)
));
