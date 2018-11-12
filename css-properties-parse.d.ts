/**
 * @overview css-parse
 * - парсит сss
 * TODO: не учитывает разделители внутри ковычек
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

declare namespace cssPropertiesParse {
  export interface CssProps {
    [name: string]: string | string[];
  }
}
declare const cssPropertiesParse: (text: string, output?: cssPropertiesParse.CssProps) => cssPropertiesParse.CssProps;
export = cssPropertiesParse;
