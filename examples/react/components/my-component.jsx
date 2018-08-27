import React, { Component } from 'react';
import { MnConsumer } from '../../../src/react-mn-component';

export class MyComponent extends Component {
	render() {
		return (
			<MnConsumer>
			{
				({ m }) => (
					<div m={m('tbl c0F0 bg0 w h100vh tc f40')}>
						<div>
							Hello React!
						</div>
					</div>
				)
			}
			</MnConsumer>
		);
	}
}
