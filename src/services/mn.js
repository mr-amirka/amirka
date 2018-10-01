/**
 * @overview minimalistNotation service
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

(module.exports = require('../minimalist-notation-provider')())
  .emitter.on(require('./styles-render-provider')(document, 'mn.'));
