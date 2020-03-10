const CancelablePromise = require('../CancelablePromise');
const stackProvider = require('../stackProvider');
const jsonParse = require('../jsonParse');
const jsonStringify = require('../jsonStringify');

module.exports = (wsUrl) => {
  let opened, socket; // eslint-disable-line
  const [getRequest, addRequest] = stackProvider();
  const [getResponse, addResponse] = stackProvider();
  function socketApplyBase(item) {
    if (!item || item[3]) return;
    addResponse(item);
    socket.send(item[2]);
  }
  function socketApply() {
    socketApplyBase(getRequest());
  }
  function connect() {
    let _item = getRequest();
    if (!_item) return;
    socket = new WebSocket(wsUrl);
    socket.onopen = () => {
      console.log('Connection is open.');
      opened = 1;
      socketApplyBase(_item);
      _item = 0;
    };
    socket.onclose = (event) => {
      opened = socket = 0;
      console.log('Connection is closed.');
    };
    socket.onmessage = (event) => {
      const item = getResponse();
      socketApply();
      if (!item) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          item[0](jsonParse(reader.result));
        } catch (err) {
          item[1](err);
        }
      };
      reader.readAsText(event.data);
    };
    socket.onerror = () => {
      const item = _item || getResponse() || getRequest();
      _item = 0;
      connect();
      item && item[1](new TypeError('Browser cannot connect to server'));
    };
  }

  return (data) => {
    return new CancelablePromise((resolve, reject) => {
      let item = [
        resolve, reject, Buffer.from(jsonStringify(data), 'utf-8'), 0,
      ];
      opened ? socketApplyBase(item) : addRequest(item);
      socket || connect();
      return () => {
        item && (item[3] = 1, item = 0);
      };
    });
  };
};
