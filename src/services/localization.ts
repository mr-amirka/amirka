/**
 * @overview localization
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 * 
 */

import { request } from '../additional/request';
import { cookieStorage } from '../additional/cookie-storage';
import { localizationProvider, Localization } from '../additional/localization-provider';

//const storage$
const lang$ = cookieStorage.subject('locale', 'en');
export const localization: Localization = localizationProvider(lang$, request);
