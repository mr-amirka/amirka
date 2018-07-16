/**
 * @overview minimalistNotation service
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {styleProvider} from '../common/style-provider';
import {minimalistNotationProvider} from '../minimalist-notation-provider';

export const style = styleProvider(document, 'mn-styles', 'mn.');
export const mn = minimalistNotationProvider(style);