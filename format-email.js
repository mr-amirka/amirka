
module.exports = v => 'mailto:' + ('' || v).replace(regexp, '');

const regexp = /\s+/g;
