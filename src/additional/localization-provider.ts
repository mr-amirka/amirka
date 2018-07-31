/**
 * @overview localization
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 * @example
 *
 * const lang$ = BehaviorSubject('en');
 * export const localization = localizationProvider(lang$, request);
 * 
 * localization.setLang('tat');
 * const locale: Locale = localization({
 *  en: './assets/locales/en.locale.json',
 *  ru: './assets/locales/ru.locale.json',
 *  tat: {
 *    'you': 'син',
 *    'i': 'мин'
 *  }
 * });
 * locale('you').subscribe((value) => console.log(value)); // => 'син'
 * locale('you', 'ru').subscribe((value) => console.log(value)); // => 'вы'
 */

import { BehaviorSubject } from 'rxjs';
import { localeProvider, LocalesMap, Locale } from './locale-provider';
import { Request } from './request';

export interface Localization {
  (localesMap: LocalesMap): Locale;
  setLang: (language: string) => Localization;
  lang$: BehaviorSubject <string>;
}

export const localizationProvider = (lang$: BehaviorSubject <string>, request: Request): Localization => {
  const instance = <Localization> ((localesMap: LocalesMap) => localeProvider(localesMap, lang$, request));
  instance.setLang = (language: string) => {
    lang$.next(language);
    return instance;
  };
  instance.lang$ = lang$;
  return instance;
};