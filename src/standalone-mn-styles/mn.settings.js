(() => {
  const {
    extend,
    flags,
    css,
    mn
  } = amirka;

  const media = mn.media;
  [
    ['all', 'all' ],
    ['sm', '(max-width: 991px)' ],
    ['smEnd', '(min-width: 768px) and (max-width: 991px)' ],
    ['xs', '(max-width: 767px)' ],
    ['xsEnd', '(min-width: 480px) and (max-width: 767px)' ],
    ['xv', '(max-width: 639px)' ],
    ['xm', '(max-width: 479px)' ],
    ['xmEnd', '(min-width: 360px) and (max-width: 479px)' ],
    ['mm', '(max-width: 359px)' ],
    ['md', '(min-width: 992px)' ],
    ['mdEnd', '(min-width: 992px) and (max-width: 1199px)' ],
    ['lg', '(min-width: 1200px)' ],
    ['lgEnd', '(min-width: 1200px) and (max-width: 1559px)' ],
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


  flags(['-webkit-', '-moz-', '-o-',  '-ms-', '-khtml-' ], css.prefixes);
  flags([ 
      'transform', 'transitionDuration', 'pointerEvents', 'userSelect', 'filter', 'boxSizing'
  ], css.prefixedAttrs);

})();
