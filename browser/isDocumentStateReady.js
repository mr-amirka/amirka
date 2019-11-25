/**
 * @overview isDocumentStateReady
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 */

const isIE = require('../isIE');
module.exports = (window) => {
  const s = window.document.readyState;
  return isIE(window) ? (s == 'complete') : /complete|interactive/.test(s);
};
