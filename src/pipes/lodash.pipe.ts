/**
 * @overview LodashPipe
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { Pipe, PipeTransform } from '@angular/core';
import * as lodash from 'lodash';


@Pipe({name: 'lodash'})
export class LodashPipe implements PipeTransform {
	transform(value: any, methodName: string, ...args: any[]) : any {
		return lodash[methodName].apply(null, [ value ].concat(args));
	}
}