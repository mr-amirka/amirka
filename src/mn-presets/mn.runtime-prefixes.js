/**
 * @overview MinimalistNotation preset "default runtime prefixes"
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

module.exports = (mn) => {
  const { flags } = mn.utils;
  const style = document.createElement('div').style;
  const prefixes = mn.propertiesStringify.prefixes;
  [ 'webkit', 'moz', 'o',  'ms', 'khtml' ].forEach((prefix) => {
  	if (style[prefix + 'Transform'] !== undefined) prefixes['-' + prefix + '-'] = true;
  });
  flags([
    'transform',
    'transitionDuration',
    'pointerEvents',
    'userSelect',
    'filter',
    'boxSizing'
  ], mn.propertiesStringify.prefixedAttrs);
};
