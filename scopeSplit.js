/*
scopeSplit('not(.disabled(.as).lak).checked', '(', ')');
// =>
[
  ['not', [
    ['.disabled', [
      ['.as']
    ]],
    ['.lak']
  ]],
  ['.checked']
]
*/

const startsWith = require('./startsWith');
const push = require('./push');

module.exports = (input, startKey, endKey) => {
  startKey = startKey || '(';
  endKey = endKey || ')';
  let top = [], levels = [top], startL = startKey.length, // eslint-disable-line
    endL = endKey.length, offset = 0, prevLevel, start, // eslint-disable-line
    depth = 0, lastOffset = 0, length = input.length, level = top; // eslint-disable-line
  while (offset < length) {
    (start = startsWith(input, startKey, offset))
    || startsWith(input, endKey, offset)
      ? (
        push(level, [
          input.substr(lastOffset, offset - lastOffset),
        ]),
        start
          ? (
            depth++,
            offset += startL
          )
          : (
            levels[depth] = [],
            prevLevel = levels[--depth],
            prevLevel[prevLevel.length - 1][1] = level,
            offset += endL
          ),
        lastOffset = offset,
        level = levels[depth] || (levels[depth] = [])
      )
      : (
        offset++
      );
  }
  lastOffset < length && push(top, [
    input.substr(lastOffset, length - lastOffset),
  ]);
  return top;
};
