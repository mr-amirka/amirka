/**
 * @overview css-parse
 * быстро парсит CSS без учета спец.символов внутри ковычек.
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

const kebabToCamelCase = require('./kebabToCamelCase');
const isArray = require("./isArray");
const regexpLine = /\s*;\s*/;
const regexpProp = /\s*:\s*/;
const reTrim = /^[\r\n {}]+|[\r\n {}]+$/g;
module.exports = (text, output) => {
  output || (output = {});
  let input = text.replace(reTrim, '').split(regexpLine), line, name, value, vls, i = input.length;
  for (; i--;) (name = (line = input[i].split(regexpProp))[0]) && (value = line[1])
    && (
      (vls = output[name = kebabToCamelCase(name)])
        ? (isArray(vls) ? vls : (vls = [ vls ]).includes(value) || vls.push(value))
        : (output[name] = [ value ])
    );
  return output;
};
