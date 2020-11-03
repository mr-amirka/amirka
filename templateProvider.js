const getBase = require('./get').base;
const REGEXP = /\{\{((?:(?:"[^"]*")|(?:'[^']*')|(?:`[^`]*`)|(?:\{\{.*?\}\})|(?:[^}]*?))*?)\}\}/g; // eslint-disable-line
function wrapper(data) {
  return () => data;
}
function defaultParse(expression) {
  const paths = expression.split('.');
  return (scope) => getBase(scope, paths);
}

module.exports = (template, parse) => {
  parse = parse || defaultParse;
  let start = 0, l = template.length, parts = []; // eslint-disable-line
  template.replace(REGEXP, (hystack, exp, offset) => {
    const nextLength = offset - start;
    nextLength && parts.push(wrapper(template.substr(start, nextLength)));
    exp && parts.push(parse(exp));
    start = offset + hystack.length;
    return '';
  });
  start === l || parts.push(wrapper(template.substr(start, l - start)));
  return (scope) => {
    let i = 0, l = parts.length, output = new Array(l); // eslint-disable-line
    for (; i < l; i++) output[i] = parts[i](scope);
    return output.join('');
  };
};
