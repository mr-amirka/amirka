const CancelablePromise = require('../CancelablePromise');
const stackProvider = require('../stackProvider');
const jsonParse = require('../jsonParse');
const jsonStringify = require('../jsonStringify');
const noop = require('../noop');

module.exports = (wsUrl, configs) => {
  configs = configs || {};
  const onMessage = configs.onMessage || noop;
  const [getRequest, addRequest] = stackProvider();
  let messages = {}, opened, socket, lastId = 0; // eslint-disable-line
  function socketApplyBase(item) {
    if (!item || item[3]) return;
    const id = ++lastId;
    const args = item[2];
    messages[id] = item;
    socket.send(Buffer.from(jsonStringify({
      id,
      method: args[0],
      data: args[1],
    }), 'utf-8'));
  }
  function errorApply(err) {
    console.error(err);
    let k, v, msgs = messages; // eslint-disable-line
    messages = {};
    for (k in msgs) { // eslint-disable-line
      v = msgs[k];
      v && v[1](err);
    }
  }
  function connect() {
    socket = new WebSocket(wsUrl);
    socket.onopen = () => {
      console.log('Connection is open');
      opened = 1;
      let item;
      while (item = getRequest()) {
        socketApplyBase(item);
      }
    };
    socket.onclose = (e) => {
      opened = socket = 0;
      const err = new Error('Connection is closed');
      let item;
      while (item = getRequest()) {
        item[1](err);
      }
      errorApply(err);
    };
    socket.onmessage = (e) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const response = jsonParse(reader.result);
          if (onMessage(response) === false) return;
          const id = response.id;
          const item = messages[id];
          if (item) {
            delete messages[id];
            item[0](response);
          }
        } catch (ex) {
          errorApply(ex);
        }
      };
      reader.readAsText(e.data);
    };
    socket.onerror = () => {
      errorApply(new Error('Browser cannot connect to server'));
    };
  }

  return (method, data) => {
    return new CancelablePromise((resolve, reject) => {
      let item = [
        resolve, reject,
        [method, data], 0,
      ];
      opened ? socketApplyBase(item) : addRequest(item);
      socket || connect();
      return () => {
        item && (item[3] = 1, item = 0);
      };
    });
  };
};
