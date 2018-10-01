/**
 * @overview minimalistNotation component for React
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import React, { createContext, Component } from 'react';
import Frame, { FrameContextConsumer } from 'react-frame-component';
const _mn = require('./services/mn');
const stylesRenderProvider = require('./services/styles-render-provider');
const isArray = require('./utils/is-array');
const isObject = require('./utils/is-object');
const merge = require('./utils/merge');
const extend = require('./utils/extend');

const cache = new WeakSet();
export const deferCompile = _mn.deferCompile;
export const mn = _mn;
export const check = _mn.getCompiler('m');
export const checkRendered = (rendered) => {
	recursiveCheck(rendered);
	deferCompile();
	return rendered;
};

const recursiveCheck = (node) => {
	if (!node || !isObject(node)) return;
	if (isArray(node)) return node.forEach(recursiveCheck);
	const props = node.props;
	if (!props) return;
	check(props.m);
	recursiveCheck(props.children);
};
const __on = mn.emitter.on;

class Inner extends Component {
	constructor(props) {
		super(props);
		let subscription;
		const self = this;
		self.render = () => this.props.children;
		self.componentDidMount = () => subscription || (subscription = __on(stylesRenderProvider(self.props.document, 'mn.')));
		self.componentWillUnmount = () => {
	    if (subscription) {
				subscription();
				subscription = null;
			}
	  };
	}
}

export const X = (props) => props.children({ ...props, children: null });
export const withMn = (ReactComponent) => {
	if (!(ReactComponent.prototype instanceof Component)) return extend((props) => {
		if (!cache.has(ReactComponent)) {
			cache.add(ReactComponent);
			recursiveCheck(ReactComponent(props));
			deferCompile();
		}
		return ReactComponent(props);
	}, ReactComponent);

	return class MnComponent extends ReactComponent {
		constructor(props) {
			super(props);
			const self = this;
			const componentDidMount = self.componentDidMount;
			(self.componentDidMount = function() {
				const r = componentDidMount && componentDidMount.apply(this, arguments);
				if (!cache.has(ReactComponent)) {
					cache.add(ReactComponent);
					recursiveCheck(self.render());
					deferCompile();
				}
				return r;
			});
		}
	}
};

export const MnFrame = withMn((props) => (
	<Frame { ...merge([ props, { children: null } ])}>
		<FrameContextConsumer children={(ctx) => (<Inner { ...extend({ children: props.children }, ctx )}/>)}/>
	</Frame>
));
