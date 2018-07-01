/**
 * @overview minimalist-notation standalone
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

export * from 'lodash';
export * from '../base/execute';
export * from '../base/get-by-type';
export * from '../base/clone-depth';
export * from '../base/extend-depth';
export * from '../base/merge-depth';
export * from '../base/flags';
export * from '../common/join-arrays';
export * from '../common/route-parse-provider';
export * from '../common/immediate';
export * from '../common/css-properties-parse';
export * from '../common/css-properties-stringify-provider';
export * from './selectors-compile-provider';
export * from './color';

import {minimalistNotationProvider} from './index';
import {styleProvider} from '../common/style-provider';
import {readyProvider} from '../common/ready-provider';

export const ready = readyProvider(window);
export const style = styleProvider(document, 'mn-styles', 'mn.');
export const mn = minimalistNotationProvider(style);

mn.checkAttrs.m = true;

export {
  minimalistNotationProvider,
  styleProvider,
  readyProvider
};