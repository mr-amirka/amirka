/**
 * @overview _global
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const support = require("../utils/support");
module.exports = support('global') || support('window') || support('this');
