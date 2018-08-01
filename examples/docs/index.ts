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
import { ready } from "../../src/services/ready";

import { mnSettings } from '../../src/mn-presets/mn.settings';
import { mnStyle } from '../../src/mn-presets/mn.style';
import { mnTheme } from './mn.theme';

mnSettings(mn)
mnStyle(mn);
mnTheme(mn);

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";

import { polyfill } from '../../src/additional/polyfill';
import { Deal } from '../../src/base/deal';



// import { enableProdMode } from "@angular/core";
// if(process.env.ENV === "production") {
//   enableProdMode();
// }



Deal.all([
	new Deal((resolve) => ready(resolve)),
	polyfill({
		'CSS.escape': 'assets/standalone-shims/css.escape.shim.js',
		'Promise': () => (<any>window).Promise = Deal
	})
]).finally(() => {

	mn
    	.recursiveCheckNodeByAttr(document)
    	.compile();

  	console.log('minimalistNotation', mn.data);
  	platformBrowserDynamic().bootstrapModule(AppModule);
  
});


//import {request} from '../../src/additional/request';
//import {jsonp} from '../../src/additional/jsonp';


/*
const vkApi = (methodName: string) => {
	return (options: any) => {
		options || (options = {});
		const query = options.query || (options.query = {});
		query.v = '5.80';
		query.access_token =  '7062bd687062bd687062bd6885702219af770627062bd682b218a5db20c26a46235e64e';
		return jsonp('https://api.vk.com/method/' + methodName, options);
	};
};
const cities = vkApi('database.getCities');

cities({
	query: {
		country_id: 1,
		need_all: 1,
		offset: 0
	}
}).finally((err, response) => {
	console.log('err, response', err, response);
});


*/