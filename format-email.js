

module.exports = v => 'mailto:' + (v ? v.replace(regexp, '') : '');

const regexp = /\s+/g;
