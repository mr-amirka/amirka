const isFunction = require('./is-function');
const isDefined = require('./is-defined');

const invoke = module.exports = (object, path, args, context) => base(
  object,
  isDefined(path) ? ('' + path).split('.') : [],
  args,
  context
);
const invoke = invoke.base = (object, path, args, context) => {
	const length = path.length;
	let i = 0;
  let fn = object;
	while (fn && i < length) {
    object = fn;
    fn = object[path[i++]];
  }
	return i === length && isFunction(fn) ? fn.apply(context, args || []) : undefined;
};
