//polyfills
//import "core-js/es6";
//import "core-js/es7/reflect";

import "zone.js";

import 'highlight-ts';


// Angular 2
import "@angular/platform-browser";
import "@angular/platform-browser-dynamic";
import "@angular/core";
import "@angular/common";
//import "@angular/http";


import "@uirouter/angular";


// RxJS
import "rxjs";

//global styles
import "./global.scss";

import 'hammerjs';


import { mn } from '../../src/services/mn';
import { polyfill } from '../../src/services/polyfill';

import { mnSettings } from '../../src/mn-presets/mn.settings';
import { mnStyle } from '../../src/mn-presets/mn.style';
import { mnTheme } from './mn.theme';

mnSettings(mn)
mnStyle(mn);
mnTheme(mn);
/*
	TODO: mn presets such as here:
	https://getbootstrap.com/docs/4.0/utilities/spacing/
*/

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";

polyfill({
	'CSS.escape': 'assets/standalone-shims/css.escape.shim.js'
}).finally(() => {

	mn
    	.recursiveCheckNodeByAttr(document)
    	.compile();

  	console.log('minimalistNotation', mn.data);
  	platformBrowserDynamic().bootstrapModule(AppModule);
  
});
