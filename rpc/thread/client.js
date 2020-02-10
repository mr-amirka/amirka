const Deal = require('../../CancelablePromise');
const {rpcProvider} = require('../rpcWrapper');
const isHasFunctions = require('../isHasFunctions');

module.exports = (url, env) => {
  return new Deal((resolve, reject) => {
    let worker = new Worker(url);
    const terminate = () => {
      worker && worker.terminate();
      worker = null;
    };
    resolve(rpcProvider(env || {}, null, (data) => {
      worker.postMessage(data);
    }, (emit) => {
      worker.onmessage = (e) => {
        emit(e.data);
      };
    }).finally((err, response) => {
      !err && isHasFunctions(response) || terminate();
    }).then((exports) => {
      return {
        terminate,
        exports,
      };
    }));
    return terminate;
  });
};
