import React from 'react';
import { render } from 'react-dom';

import { ready } from "../../src/services/ready";
import { polyfill } from '../../src/additional/polyfill';
import { Deal } from '../../src/base/deal';

import { Root } from './components/root';

Deal.all([
	new Deal((resolve) => ready(resolve)),
	polyfill({
		'CSS.escape': 'assets/css.escape.shim.js',
		'Promise': Deal
	})
]).finally(() => [].forEach.call(
	document.querySelectorAll('[root]'), 
	(node) => render(<Root/>, node)
));
