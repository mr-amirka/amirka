import React, { Component } from 'react';

import { mnSettings } from '../../../src/mn-presets/mn.settings';
import { mnStyle } from '../../../src/mn-presets/mn.style';
import { mnTheme } from '../../../src/mn-presets/mn.theme';
import { Mn, MnConsumer } from '../../../src/react-mn-component';

import { MyComponent } from './my-component';

export class Root extends Component {
	render() {
		return (
			<Mn>
				<MnConsumer>
				{
					({ mn }) => {
						mnSettings(mn)
						mnStyle(mn);
						mnTheme(mn);
					}
				}
				</MnConsumer>
				<MyComponent></MyComponent>
			</Mn>
		);
	}
}
