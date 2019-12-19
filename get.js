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
  'object': (v) => isArray(v) ? arrayHandleProvider(v) : noopHandle,
};

/**
 *  Создает getter для извлечения значения
 *  Например:
 *  var person = {
 *    parent: {
 *      name: 'Volodya',
 *      age: 100500
 *    },
 *    name: "Vasya"
 *  };
 *  var getParentName = getterProvider('parent.name');
 *  getParentName(person) // => 'Volodya'
 *
 *  var getParentAge = getterProvider([ 'parent', 'age' ]);
 *  getParentAge(person) // => 100500
 *
 *  var getName = getterProvider(v => v.name);
 *  getName(person) // => "Vasya"
 *
 *  var getByNull = getterProvider(null);
 *  getByNull(person) // => person
 *
 */
get.getter = (v) => v ? (handlers[typeof v] || noopHandle)(v) : v;
get.base = base;
module.exports = get;
