import React, { Component } from 'react';

import { mnSettings } from '../../../src/mn-presets/mn.settings';
import { mnStyle } from '../../../src/mn-presets/mn.style';
import { mnTheme } from '../../../src/mn-presets/mn.theme';
import { Mn, MnConsumer } from '../../../src/react-mn-component';

import { MyComponent } from './my-component';

export class Root extends Component {
	constructor(props) {
		super(props);
		let inited;
		this.init = ({ mn }) => {
			if (inited) return;
			inited = true;
			mnSettings(mn)
			mnStyle(mn);
			mnTheme(mn);
		};
	}
	render() {
		return (
			<Mn>
				<MnConsumer>{this.init}</MnConsumer>
				<MyComponent></MyComponent>
			</Mn>
		);
	}
}
