/**
 * @overview minimalistNotation service
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { styleProvider, StyleStorage } from '../common/style-provider';
import { minimalistNotationProvider, MinimalistNotation } from '../minimalist-notation-provider';

export const style: StyleStorage = styleProvider(document, 'mn-styles', 'mn.');
export const mn: MinimalistNotation = minimalistNotationProvider(style);