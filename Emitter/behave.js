const Emitter = require('./index');
const {isEmitter} = Emitter;

module.exports = (value, methods) => {
  return (isEmitter(value) ? value : new Emitter(value)).behave(methods);
};
