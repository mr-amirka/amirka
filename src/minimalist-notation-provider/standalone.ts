/**
 * @overview minimalist-notation standalone
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import * as _ from 'lodash';
export * from '../base';
export * from '../common/join-arrays';
export * from '../common/route-parse-provider';
export * from '../common/css-properties-parse';
export * from '../common/css-properties-stringify-provider';
export * from './selectors-compile-provider';
export * from './color';
export * from '../additional';

import {minimalistNotationProvider} from './index';
import {styleProvider} from '../common/style-provider';
import {readyProvider} from '../common/ready-provider';

export const ready = readyProvider(window);
export const style = styleProvider(document, 'mn-styles', 'mn.');
export const mn = minimalistNotationProvider(style);

export {
	_,
  minimalistNotationProvider,
  styleProvider,
  readyProvider
};