const Deal = require('../../CancelablePromise');
const {rpcProvider} = require('../rpcWrapper');
const isHasFunctions = require('../isHasFunctions');

module.exports = (url, env) => {
  return new Deal((resolve, reject) => {
    let worker = new SharedWorker(url);
    let port = worker.port;
    function terminate() {
      port = worker = null;
    }
    resolve(rpcProvider(env || {}, null, (data) => {
      port.postMessage(data);
    }, (emit) => {
      port.addEventListener('message', (e) => {
        emit(e.data);
      }, false);
      port.start();
    }).finally((err, response) => {
      !err && isHasFunctions(response) || terminate();
    }).then((exports) => ({
      terminate,
      exports,
    })));
    return terminate;
  });
};


/*
exports.runThread = (url, env) => {
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
      hasFunctions(response) || terminate();
    }).then((exports) => {
      return {
        terminate,
        exports
      };
    }));
    return terminate;
  });
};

exports.thread = (init) => {
  return rpcProvider(null, init, (data) => {
    postMessage(data);
  }, (emit) => {
    self.onmessage = (e) => {
      emit(e.data);
    };
  });
};
*/
