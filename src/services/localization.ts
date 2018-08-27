/**
 * @overview localization
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 * 
 */

import { request } from './request';
import { localStorage } from './local-storage';
import { localizationProvider, Localization } from './localization-provider';

//const storage$
const lang$ = localStorage.observable('locale', 'en');
export const localization: Localization = localizationProvider(lang$, request);
