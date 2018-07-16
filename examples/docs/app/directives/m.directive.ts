import {Directive, Input} from '@angular/core';

import {mn} from '../../../../src/services/mn';

const checkAttr = mn.checkAttr;

@Directive({selector: '[m]'})
export class MDirective {
  @Input('m')
  set m(v: string) {
    checkAttr('m', v).compile();
  }
}


/*
import {
  forEach
} from 'lodash';

const checkClassName = mn.checkClassName;

@Directive({selector: '[class]'})
export class MnClass{
  constructor() {}
  @Input('class')
  set klass(v: string) {
    checkClassName(v).compile();
  }
}

@Directive({selector: '[ngClass]'})
export class MnNgClass{
  constructor() {}
  @Input('ngClass')
  set ngClass(className: any) {
    if (!className) return;
    const type = typeof className;
    if (type === 'object') {
      forEach(className, (v, k) => checkClassName(k));
      mn.compile();
      return;
    }
    if (type === 'string') {
      checkClassName(className).compile();
      return;
    }
  }
}
*/