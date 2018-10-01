
module.exports = _mapFn => (_getValue, _on) => ({
  getValue: () => _mapFn(_getValue()),
  on: watcher => _on(v => watcher(_mapFn(v)))
});
