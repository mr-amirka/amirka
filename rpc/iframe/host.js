const {rpcProvider} = require('../rpcWrapper');

module.exports = (init) => {
  const w = window, parent = w.parent; // eslint-disable-line
  parent && rpcProvider(null, init, (data) => {
    parent.postMessage(data, '*');
  }, (emit) => {
    w.addEventListener('message', (e) => {
      emit(e.data);
    }, false);
  });
};
