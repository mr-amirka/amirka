/**
 * @overview MDirective
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {Directive, Input} from '@angular/core';
import * as _mn from './services/mn';

export const check = _mn.getCompiler('m');
export const deferCompile = _mn.deferCompile;
export const mn = _mn;

@Directive({selector: '[m]'})
export class MDirective {
  @Input('m') set m(v: string) {
    check(v);
		deferCompile();
  }
}


/*
const checkClassName = _mn.getCompiler('class');

@Directive({selector: '[class]'})
export class MnClass{
  constructor() {}
  @Input('class')
  set klass(v: string) {
    checkClassName(v);
		deferCompile();
  }
}

const forIn = mn.utils.forIn;
@Directive({selector: '[ngClass]'})
export class MnNgClass{
  constructor() {}
  @Input('ngClass')
  set ngClass(className: any) {
    if (!className) return;
    const type = typeof className;
    if (type === 'object') {
      forIn(className, (v: any, k: any) => checkClassName(k));
      deferCompile();
      return;
    }
    if (type === 'string') {
      checkClassName(className);
			deferCompile()
    }
  }
}
*/
