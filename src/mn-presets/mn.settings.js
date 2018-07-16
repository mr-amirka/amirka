
import {extend} from 'lodash';
import {flags} from '../base/flags';

export const mnSettings = (mn) => {
  
const media = mn.media;
[
  ['sm', '(max-width: 991px)' ],
  ['sm-md', '(min-width: 768px) and (max-width: 991px)' ],
  ['xs', '(max-width: 767px)' ],
  ['xs-sm', '(min-width: 480px) and (max-width: 767px)' ],
  ['xv', '(max-width: 639px)' ],
  ['xm', '(max-width: 479px)' ],
  ['xm-xs', '(min-width: 360px) and (max-width: 479px)' ],
  ['mm', '(max-width: 359px)' ],
  ['md', '(min-width: 992px)' ],
  ['md-lg', '(min-width: 992px) and (max-width: 1199px)' ],
  ['lg', '(min-width: 1200px)' ],
  ['lg-ll', '(min-width: 1200px) and (max-width: 1559px)' ],
  ['ll', '(min-width: 1600px)' ],
  ['pt', 'print' ]
].forEach((v, i) => media[v[0]] = {query: v[1], priority: i});

//mn.contextMode = 'media-queries';

extend(mn.states, {
  h: [ ':hover' ],
  a: [ ':active' ],
  f: [ ':focus' ],
  i: [ '::-webkit-input-placeholder', '::-moz-placeholder', ':-ms-input-placeholder', '::placeholder' ],
  even: [ ':nth-child(2n)' ],
  odd: [ ':nth-child(2n+1)' ],
  n: [ ':nth-child' ],
  c: [ ':checked' ],
  first: [ ':first-child' ],
  last: [ ':last-child' ]
}); 


flags(['-webkit-', '-moz-', '-o-',  '-ms-', '-khtml-' ], mn.propertiesStringify.prefixes);
flags([ 
  'transform', 'transitionDuration', 'pointerEvents', 'userSelect', 'filter', 'boxSizing'
], mn.propertiesStringify.prefixedAttrs);

};
