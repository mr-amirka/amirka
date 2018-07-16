import * as amirka from '../../src/minimalist-notation-provider/standalone';

(<any> window).amirka = amirka;
(<any> window).mn = amirka.mn;

/*

ready(() => {
  mn
    .recursiveCheckNodeByAttr(document)
    .compile();
});

*/