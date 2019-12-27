const merge = require('../merge');

module.exports = require('./behaviorsProvider')((name) => {
  const instance = {};
  instance[name + 'Select'] = (emit, id, getState) => {
    emit(merge([getState(), {[name]: id}]));
  };
  instance[name + 'Clear'] = (emit, _, getState) => {
    emit(merge([getState(), {[name]: 0}]));
  };
  instance[name + 'Toggle'] = (emit, id, getState) => {
    const state = getState();
    emit(merge([state, {[name]: state[name] === id ? 0 : id}]));
  };
  return instance;
});
