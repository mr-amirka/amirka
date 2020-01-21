/**
 * @overview isIE
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 */

const regexp = /MSIE|Trident/;
module.exports = (window, n) => {
  return (n = window.navigator) && regexp.test(n.userAgent);
};
