const Emitter = module.exports = function (_value) {
  const self = this;
  const watchers = new Set();
  self.getValue = () => _value;
  self.on = (watcher) => {
    watcher(_value);
    watchers.add(watcher);
    return () => watchers.delete(watcher);
  };
  self.emit = (value) => {
    _value = value;
    watchers.forEach(_emit);
    return self;
  };
  const _emit = (watcher) => {
    try {
      watcher(_value);
    } catch(ex) {
      console.error(ex);
    }
  };
}
const wrapOn = (getValue, on) => (watcher) => on(v => watcher(getValue()));
const Pipe = Emitter.Pipe = function(){};
Emitter.prototype = new Pipe();
Pipe.prototype.pipe = function (){
  const pipes = arguments, length = pipes.length, self = this;
  for (let props, on = self.on, getValue = self.getValue, _getV, i = 0; i < length; i++) {
    if (props = pipes[i](getValue, on)) {
      _getV = props.getValue;
      getValue = _getV || getValue;
      on = props.on || (_getV ? wrapOn(_getV, on) : on);
    }
  }
  const dst = new Pipe();
  dst.on = on;
  dst.getValue = getValue;
  return dst;
};
