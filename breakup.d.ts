/**
 * @overview breakup
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { fn }  from "./global";

declare namespace breakup {
  export interface breakup {
    (input: string, separator: string, right?: boolean): [ string, string ];
    last: (input: string, separator: string, right?: boolean) => [ string, string ];
    provider: (indexOf: fn) => (input: string, separator: string, right?: boolean) => [ string, string ];
  }
}
declare const breakup: breakup.breakup;
export = breakup;
