const emitterProvider = require('./pipe');
const {isEmitter} = emitterProvider;

module.exports = (value, methods) => {
  return (isEmitter(value) ? value : emitterProvider(value)).behave(methods);
};
