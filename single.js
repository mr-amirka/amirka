/**
 * @overview single
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const isPromise = require('./isPromise');
const isFunction = require('./isFunction');

/**
 *  Декорирует вызов асинхронной функции таким образом,
 *  чтобы при каждом следующем вызове, предыдущее асинхронное выполнение отменялось
 *  Оборачиваемая функция должна возврвщать колбэк функцию для отмены асинхронного процесса или отменяемый Promise (Deal)
*/
module.exports = (fn) => {
	let _cancel;
  function instance() {
    cancel();
    return _cancel = fn.apply(this, arguments);
  }
  function cancel() {
    return isFunction(_cancel)
      ? _cancel()
      : isPromise(_cancel) && isFunction(_cancel.cancel) && _cancel.cancel();
  }
  instance.cancel = cancel;
  return instance;
};
