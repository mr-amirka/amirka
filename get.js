const isArray = require('./isArray');
const noopHandle = require('./noopHandle');

function get(ctx, path, def) {
  return path
    ? (ctx ? base(ctx, ('' + path).split('.'), def) : def)
    : ctx;
}
function base(ctx, path, def) {
  const length = path.length;
  let i = 0;
  while (ctx && i < length) ctx = ctx[path[i++]];
  return i === length ? ctx : def;
}
function arrayHandleProvider(path) {
  return (v) => base(v, path);
}
const handlers = {
  'string': (v) => arrayHandleProvider(v.split('.')),
  'number': (v) => arrayHandleProvider([v]),
  'object': (v) => isArray(v) ? arrayHandleProvider(v) : noopHandle,
};

get.getter = (v) => v ? (handlers[typeof v] || noopHandle)(v) : v;
get.base = base;
module.exports = get;
