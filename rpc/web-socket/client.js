const noop = require('../../noop');
const rpcRemoteClientWrapper = require('../remoteClientWrapper');
const jsonParse = require('../nodeTryJsonParse');

const MSG_SIZE = 0;
const MSG_FINALLY = 1;
const MSG_PREV = 2;

module.exports = (url, env, reconnectTimeout) => {
  return rpcRemoteClientWrapper(({url, onopen, onmessage, onclose}) => {
    let current = [0, noop];
    const socket = new WebSocket(url);
    onopen && (socket.onopen = onopen);
    socket.onmessage = (e) => {
      onmessage && onmessage(jsonParse(e.data));
    };
    socket.onclose = () => {
      onclose && onclose();
    };

    function finalApply(err) {
      const bufferedAmount = socket.bufferedAmount;
      let ballance = 0;
      let last = current;
      let prev = last;
      while (prev && (bufferedAmount - ballance) > 0) {
        last = prev;
        ballance += last[MSG_SIZE];
        prev = last[MSG_PREV];
      }
      if (prev === current) {
        current = null;
      } else {
        last[MSG_PREV] = null;
      }
      while (prev) {
        prev[MSG_FINALLY]();
        prev = prev[MSG_PREV];
      }
      if (!err) return;
      prev = current;
      current = null;
      while (prev) {
        prev[MSG_FINALLY](err);
        prev = prev[MSG_PREV];
      }
    }

    socket.onerror = () => {
      finalApply(true);
    };
    return {
      send: (data, onFinally) => {
        const prevSize = socket.bufferedAmount;
        socket.send(JSON.stringify(data));
        const msgSize = socket.bufferedAmount - prevSize;
        current = [
          msgSize,
          onFinally || noop,
          current,
        ];
        finalApply();
      },
      close: () => {
        socket.close();
      },
    };
  }, url, env, reconnectTimeout);
};
