/**
 * @overview localeProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 * @example
 * 
 * const lang$ = new BehaviorSubject('en');
 * const locale: Locale = localeProvider({
 *   ru: require('./ru.locale.json'),
 *   en: require('./en.locale.json')
 * }, lang$, request);
 * 
 * locale('name'); // => name
 * locale('name', 'ru'); // => имя
 * locale({
 *   ru: 'имя',
 *   en: 'name'
 * }); // => 'name'
 * 
 */

import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from './request';


export interface LocalesMap {
  [language: string]: string | {[key: string]: string}
}
export interface Locale {
  (key: string | {[key: string]: string}, language?: string): Observable <string>;
  lang$: BehaviorSubject <string>;
  locale$: BehaviorSubject <{[key: string]: string}>;
}
export const localeProvider = (localesMap: LocalesMap, lang$: BehaviorSubject <string>, request: Request): Locale => {

  const instance = <Locale> ((name: string | {[key: string]: string}, language?: string) => {
    if (name && typeof name === 'object') {
      const translates = name;
      return language
        ? new BehaviorSubject(translates[language] || '')
        : lang$.pipe(map((language: string) => translates[language] || ''));
    }
    return (language ? get(language) : _locale$)
      .pipe(map((locale: any) => locale[name] || name));
  });
  instance.lang$ = lang$;
  const _locale$: BehaviorSubject <{[name: string]: string}> = instance.locale$ = new BehaviorSubject({});
  
  const _locales: {[language: string]: BehaviorSubject <{[name: string]: string}>} = {}
  let _subscription: Subscription = new Subscription(noop);

  const change = (value: {[key: string]: string}) => _locale$.next(value);
  const get = (language: string) => _locales[language] || (_locales[language] = init(language));
  const init = (language: string) => {
    const locale$ = new BehaviorSubject({});
    const source = localesMap[language];
    if (source) {
      const type = typeof source;
      if (type === 'object') locale$.next(source);
      if (type === 'string') {
        request(source)
          .then((locale: any) => locale$.next(locale));
      }
    }
    return locale$;
  };

  lang$.subscribe((language: string) => {
    const locale$ = get(language);
    _subscription.unsubscribe();
    _subscription = locale$.subscribe(change);
  });

  return instance;
};

const noop = () => {};