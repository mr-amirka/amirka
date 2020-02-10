const {rpcProvider} = require('../rpcWrapper');

module.exports = (init) => {
  self.onconnect = (e) => {
    const source = e.source;
    rpcProvider(null, init, (data) => {
      source.postMessage(data);
    }, (emit) => {
      source.addEventListener('message', (e) => {
        emit(e.data);
      }, false);
      source.start();
    });
  };
};
