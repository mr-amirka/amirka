/**
 * @overview minimalistNotation service
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

import {styleProvider} from '../../common/style-provider';
import {minimalistNotationProvider} from '../../minimalist-notation';
import {ready} from './ready';

export const style = styleProvider(ready, document, 'mn-styles', 'mn.');
export const minimalistNotation = minimalistNotationProvider(style);
