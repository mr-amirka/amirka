import React, { Component } from 'react';

import { mnSettings } from '../../../src/mn-presets/mn.settings';
import { mnStyle } from '../../../src/mn-presets/mn.style';
import { mnTheme } from '../../../src/mn-presets/mn.theme';
import { Mn } from '../../../src/react-mn-component';

import { MyComponent } from './my-component';

const presets = [ mnSettings, mnStyle, mnTheme ];
export class Root extends Component {
	render() {
		return (
			<Mn presets={presets}>
				<MyComponent></MyComponent>
			</Mn>
		);
	}
}
