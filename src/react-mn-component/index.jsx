/**
 * @overview minimalistNotation component for React
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import React, { createContext, Component } from 'react';
import { minimalistNotationProvider } from '../minimalist-notation-provider';
import { immediate } from '../base/immediate';
import { sortBy, values as __values } from 'lodash';


const { Provider, Consumer } = createContext('mn');

const __sort = (item) => -item.priority;

class Mn extends Component {
	constructor(props) {
		super(props);
		const self = this;
		let renderIndex = 0;
		const stylesMap = {};
        self.state = { renderIndex };
        self.styles = [];
		const mn = self.mn = minimalistNotationProvider({
			set(name, value, priority) {
				stylesMap[name] = {name, value, priority: priority || 0};
			},
			remove(name) {
				delete stylesMap[name];
			},
		  	render() {
		  		self.styles = sortBy(__values(stylesMap), __sort)
		    		.map((item) => {
			    		return (
			    			<style key={item.name} id={'mn.' + item.name}>{item.value}</style>
			    		);
			    	});
			    renderIndex++;
			    immediate(() => self.setState({ renderIndex }));
		  	}
		});
		const check = mn.check;
		self.m = (value) => {
			check(value);
			mn.deferCompile();
			return value;
		};
	}
	render() {
        return (
        	<Provider value={{
        		m: this.m,
        		mn: this.mn
        	}}>
	        	{ this.styles }
	        	{ this.props.children }
	        </Provider>
        );
    }
}

export { Mn, Consumer as MnConsumer };