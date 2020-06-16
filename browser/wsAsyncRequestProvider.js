const CancelablePromise = require('../CancelablePromise');
const stackProvider = require('../stackProvider');
const jsonParse = require('../jsonParse');
const jsonStringify = require('../jsonStringify');

module.exports = (wsUrl) => {
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
  function connect() {
    let _item = getRequest();
    if (!_item) return;
    socket = new WebSocket(wsUrl);
    socket.onopen = () => {
      console.log('Connection is open.');
      opened = 1;
      socketApplyBase(_item);
      while (_item = getRequest()) {
        socketApplyBase(_item);
      }
      _item = 0;
    };
    socket.onclose = (event) => {
      opened = socket = 0;
      console.log('Connection is closed.');
    };
    socket.onmessage = (e) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const response = jsonParse(reader.result);
          const id = response.id;
          const item = messages[id];
          delete messages[id];
          item[0](response);
        } catch (ex) {
          console.error(ex);
        }
      };
      reader.readAsText(e.data);
    };
    socket.onerror = () => {
      let k, v, msgs = messages; // eslint-disable-line
      messages = {};
      for (k in msgs) { // eslint-disable-line
        v = msgs[k];
        v && v[1](new Error('Browser cannot connect to server'));
      }
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
