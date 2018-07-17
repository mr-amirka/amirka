//polyfills
//import "core-js/es6";
//import "core-js/es7/reflect";
import "zone.js";


// Angular 2
import "@angular/platform-browser";
import "@angular/platform-browser-dynamic";
import "@angular/core";
import "@angular/common";
import "@angular/http";


import "@uirouter/angular";


// RxJS
import "rxjs";

//global styles
import "./global.scss";


/*
import * as amirka from '../../src';
(<any> window).amirka = amirka;
*/

import {mn} from '../../src/services/mn';
import {ready} from "../../src/services/ready";

import {mnSettings} from '../../src/mn-presets/mn.settings';
import {mnStyle} from '../../src/mn-presets/mn.style';
import {mnTheme} from './mn.theme';

mnSettings(mn)
mnStyle(mn);
mnTheme(mn);

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";
import { AppModule } from "./app/app.module";


import {request} from '../../src/additional/request';
import {Deal} from '../../src/base/deal';

/*
if(process.env.ENV === "production") {
  enableProdMode();
}
*/
ready(() => {
  mn
    .recursiveCheckNodeByAttr(document)
    .compile();

  console.log('minimalistNotation', mn.data);
  platformBrowserDynamic().bootstrapModule(AppModule);
});
