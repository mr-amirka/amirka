/**
 * @overview get
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const isLength = require('./isLength');
const get = module.exports = (ctx, path, def) => path ? (ctx ? base(ctx, ('' + path).split('.'), def) : def) : ctx;
const base = get.base = (ctx, path, def) => {
  const length = path.length;
  let i = 0;
  while (ctx && i < length) ctx = ctx[path[i++]];
  return i === length ? ctx : def;
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
get.getter = v => (handlers[typeof v] || noopHandle)(v);
const noopHandle = v => v;
const arrayHandleProvider = path => v => base(v, path);
const handlers = {
  'string': v => arrayHandleProvider(v.split('.')),
  'object': v => v && isLength(v.length) ? arrayHandleProvider(v) : noopHandle
};
