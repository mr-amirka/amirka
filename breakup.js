/**
 * @overview breakup
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const breakupProvider = (indexOf) => (input, separator, right) => {
  const i = indexOf.call(input, separator);
  return i < 0
  	? (right ? [ '',  input ] : [ input, '' ])
  	: [ input.substr(0, i), input.substr(i + separator.length) ];
};
const breakup = module.exports = breakupProvider(''.indexOf);
breakup.last = breakupProvider(''.lastIndexOf);
breakup.provider = breakupProvider;