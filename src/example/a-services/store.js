/**
 * @overview store service
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 *
 * @example
 *
 * store({
  theme: {
    baseColor: '#000'
  }
});

store.ready([ 'theme.baseColor', 'theme.otherColor' ], (baseColor, otherColor) => {

  console.log('ready', 'baseColor, otherColor', baseColor, otherColor);

});
store.once([ 'theme.baseColor', 'theme.otherColor'  ], (baseColor, otherColor) => {

  console.log('once', 'baseColor, otherColor', baseColor, otherColor);

});

store('theme.baseColor', '#0F0');
store('theme.otherColor', '#00F');
 */

import { ObservableStore } from '../../common/observable-store';

export const store = ObservableStore.call(function(){
  store.set.apply(store, arguments);
  return store;
});