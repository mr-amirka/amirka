import React, { Component } from 'react';
import { withMn, MnFrame } from '../../../src/react-mn';


class _MyComponent extends Component {
	render() {
		return (
			<div m="tbl c0F0 bg0 w h100vh tc f40">
				<div>
					<div>Hello React!</div>
					<MnFrame m="b0 bc00 bsSolid">
						<div m="sq10 bgF"></div>
					</MnFrame>
				</div>
			</div>
		);
	}
}

export const MyComponent = withMn(_MyComponent);
