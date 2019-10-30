/**
 * @overview isIE
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 */

module.exports = (window) => {
  var n = window.navigator, u = n ? n.userAgent : '';
  return u.indexOf("MSIE") > -1 || u.indexOf("Trident") > -1;
};
