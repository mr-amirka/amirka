/**
 * @overview css
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */


import {kebabCase, trim, isArrayLikeObject} from "lodash";

export const css = (props) => {
  const prefixedAttrs = css.prefixedAttrs;
  const prefixes = css.prefixes;
  let output = [], vs, vl, vi, prop, prefix, propPrefix, propertyName;
  for(propertyName in props){
    propPrefix = (propertyName[0] === '-' ? '-' : '') + kebabCase(propertyName) + ':';
    if(!isArrayLikeObject(vs = props[propertyName]))vs = [ vs ];
    if(prefixedAttrs[propertyName]){
      for(vi = 0, vl = vs.length; vi < vl; vi++){
        prop = propPrefix + vs[vi];
        for(prefix in prefixes)output.push(prefix + prop);
        output.push(prop);
      }
      continue;
    }
    for(vi = 0, vl = vs.length; vi < vl; vi++)output.push(propPrefix + vs[vi]);
  }
  return output.join(';');
};
css.prefixedAttrs = {};
css.prefixes = {};

const regexpLine = /\s*;\s*/i;
const regexpProp = /\s*:\s*/i;
const whiteSpace = '\r\n {}';
export const parseCSS = css.parse = (text, output) => {
  output || (output = {});
  let input = trim(text, whiteSpace).split(regexpLine), line, name, value, i = input.length;
  for(; i--;){
    line = input[i].split(regexpProp);
    if((name = line[0]) && (value = line[1]))output[camelCase(name)] = value;
  }
  return output;
};
export const escapeCSS = css.escape = CSS.escape;