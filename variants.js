const map = require('./map');
const unslash = require('./unslash');
const escapedSplitProvider = require('./escapedSplitProvider');
const joinArrays = require('./joinArrays');
const push = require('./push');
const pushArray = require('./pushArray');
const joinProvider = require('mn-utils/joinProvider');
const joinEmpty = joinProvider('');


// Экранирование служебных символов
const __split = escapedSplitProvider('|').base; // support escape
const regexpScope = /([^)(\\]+|\\.)|([\(\)])/gi;

function variants(exp) {
  return map(base(exp), unslash);
}
function build(childs) {
  const length = childs.length;
  const output = [];
  let parts, child, end, pi, pl, i = 0, next, prev = ['']; // eslint-disable-line
  for (; i < length; i++) {
    child = childs[i];
    parts = __split(child[0]);
    pl = parts.length;
    end = pl - 1;
    joinArrays(next = [], [parts[end]], build(child[1]));
    if (end) {
      joinArrays(output, prev, [parts[0]]);
      prev = next;
      for (pi = 1; pi < end; pi++) push(output, parts[pi]);
    } else {
      prev = joinArrays([], prev, next);
    }
  }
  return pushArray(output, prev);
}
function base(exp) {
  const levels = {};
  const childs = levels[0] = [];
  let depth = 0;
  let parts = [];
  exp.replace(regexpScope, (haystack, _prefix, scope) => {
    if (_prefix) {
      push(parts, _prefix);
      return '';
    }
    let last;
    if (scope == '(') {
      push(
          levels[depth] || (levels[depth] = []),
          last = [joinEmpty(parts), 0],
      );
      depth++;
      levels[depth] = last[1] = [];
    } else {
      push(levels[depth], [joinEmpty(parts), []]);
      if (--depth < 0) depth = 0;
    }
    parts = [];
    return '';
  });
  parts.length && push(levels[depth], [joinEmpty(parts), []]);
  return build(childs);
}

module.exports = variants;
variants.build = build;
variants.base = base;
