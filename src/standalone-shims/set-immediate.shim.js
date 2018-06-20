
(function(g) {
  var head = {}, tail = head; // очередь вызовов, 1-связный список
  var id = 0;
  var ID = Math.random(); // уникальный идентификатор

  function onmessage(e) {
    if (e.data != ID) return; // не наше сообщение
    var _head = head.next;
    if (!_head) return;
    head = _head;
    var func = head.func;
    if (!func) return;
    delete head.func;
    func();
  }

  if(g.addEventListener) { // IE9+, другие браузеры
    g.addEventListener('message', onmessage);
  } else { // IE8
    g.attachEvent('onmessage', onmessage);
  }

  g.setImmediate = function(func) {
  	id++;
    tail = tail.next = {
    	func: func,
    	id: id
    };
    g.postMessage(ID, "*");
    return id;
  };
  g.clearImmediate = function(_id){
  	for (let _head = head; _head = _head.next; ) {
  		if (_head.id === _id) delete _head.func;
  	}
  };
}(window));