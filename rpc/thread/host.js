const {rpcProvider} = require('../rpcWrapper');

module.exports = (init) => {
  return rpcProvider(null, init, (data) => {
    postMessage(data);
  }, (emit) => {
    self.onmessage = (e) => {
      emit(e.data);
    };
  });
};
