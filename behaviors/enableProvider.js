const merge = require('../merge');

module.exports = require('./behaviorsProvider')((name) => {
  const instance = {};
  instance[name + 'Enable'] = (emit, _, getState) => {
    emit(merge([getState(), {[name]: 1}]));
  };
  instance[name + 'Disable'] = (emit, _, getState) => {
    emit(merge([getState(), {[name]: 0}]));
  };
  instance[name + 'Toggle'] = (emit, _, getState) => {
    const state = getState();
    emit(merge([state, {[name]: !state[name]}]));
  };
  return instance;
});
