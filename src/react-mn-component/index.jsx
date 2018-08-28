/**
 * @overview minimalistNotation component for React
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { BehaviorSubject } from 'rxjs';
import React, { createContext, Component } from 'react';
import { minimalistNotationProvider } from '../minimalist-notation-provider';
import { immediate } from '../base/immediate';
import { sortBy, values as __values } from 'lodash';


const { Provider, Consumer } = createContext({});

const __sort = (item) => -item.priority;

class MnStyles extends Component {
	constructor(props) {
		super(props);
		this.styles = [];
        this.state = { renderIndex: 0 };
	}
	componentDidMount() {
		const self = this;
    	self._isMounted = true;
    	let renderIndex = 0;
    	self._subscription = self.props.styles$.subscribe((styles) => {
        	self.styles = styles;
		    renderIndex++;
		    self.setState({ renderIndex });
        });
	}
	componentWillUnmount() {
	    this._isMounted = false;
	    const subscription = this._subscription;
	    subscription && subscription.unsubscribe();
	}
	render() {
		return this._isMounted ? this.styles : null;
    }
}

class Mn extends Component {
	constructor(props) {
		super(props);
		const self = this;
		const styles$ = self.styles$ = new BehaviorSubject([]);
		const stylesMap = {};
		const mn = minimalistNotationProvider({
			set(name, value, priority) {
				stylesMap[name] = {name, value, priority: priority || 0};
			},
			remove(name) {
				delete stylesMap[name];
			},
		  	render() {
		  		styles$.next(sortBy(__values(stylesMap), __sort)
		    		.map((item) => (
			    		<style key={item.name} id={'mn.' + item.name}>{item.value}</style>
			    	)));
		  	}	
		});

		const presets = props.presets;
		presets && presets.length && presets.forEach((preset) => preset(mn));

		const check = mn.check;
		self.mnContext = {
			mn,
			m: (value) => {
				check(value);
				mn.deferCompile();
				return value;
			}
		};
	}
	render() {
        return (
        	<Provider value={this.mnContext}>
	        	<MnStyles styles$={this.styles$}/>
	        	{ this.props.children }
	        </Provider>
        );
    }
}

export { Mn, Consumer as MnConsumer };