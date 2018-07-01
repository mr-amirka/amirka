/**
 * @overview css-parse
 * - парсит сss
 * TODO: не учитывает разделители внутри ковычек
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

import {camelCase, trim} from "lodash";

const regexpLine = /\s*;\s*/i;
const regexpProp = /\s*:\s*/i;
const whiteSpace = '\r\n {}';
export const cssPropertiesParse = (text: string, output: {[name: string]: string}) => {
  output || (output = {});
  let input = trim(text, whiteSpace).split(regexpLine), line, name, value, i = input.length;
  for(; i--;){
    line = input[i].split(regexpProp);
    if((name = line[0]) && (value = line[1]))output[camelCase(name)] = value;
  }
  return output;
};