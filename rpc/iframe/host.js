const {rpcProvider} = require('../rpcWrapper');
const CancelablePromise = require('../../CancelablePromise');

module.exports = (init) => {
  const w = window, parent = w.parent; // eslint-disable-line
  return parent ? rpcProvider(null, init, (data) => {
    parent.postMessage(data, '*');
  }, (emit) => {
    w.addEventListener('message', (e) => {
      emit(e.data);
    }, false);
  }) : CancelablePromise.reject(new Error('Empty window parent'));
};
