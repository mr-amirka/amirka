/**
 * @overview localization
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 * 
 */

import { request } from '../additional/request';
import { localStorage } from '../additional/local-storage';
import { localizationProvider, Localization } from '../additional/localization-provider';

//const storage$
const lang$ = localStorage.observable('locale', 'en');
export const localization: Localization = localizationProvider(lang$, request);
