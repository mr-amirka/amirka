/**
 * @overview minimalist example
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */


import {store} from "./a-services/store";
import {ready} from "./a-services/ready";
import {minimalistNotation as mn} from "./a-services/minimalist-notation";
import {mnSettings} from "./mn-styles/mn.settings";
import {mnStyle} from "./mn-styles/mn.style";

mnSettings(mn);
mnStyle(mn);

mn.checkAttrs.m = true;

ready(() => {
  mn
    .recursiveCheckNodeByAttr(document)
    .compile();

  console.log('minimalistNotation', mn.data);
});

