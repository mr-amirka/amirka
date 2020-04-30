const Emitter = require('./index');
const {isEmitter} = Emitter;

module.exports = (value, methods, defaultValue) => {
  return (isEmitter(value) ? value : new Emitter(value, defaultValue))
      .behave(methods);
};
