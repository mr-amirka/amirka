
module.exports = v => 'tel:' + ('' || v).replace(regexp, '');

const regexp = /[^+0-9]+/g;
