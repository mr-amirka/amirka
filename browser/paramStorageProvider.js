/**
 * @overview cookieStorageProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 */
const map = require('../map');
const isEqual = require('../isEqual');
const unparam = require('../unparam');
const urlParse = require('../urlParse');
const urlExtend = require('../urlExtend');
const emitterProvider = require('../emitterProvider');

module.exports = (win, forHash) => {
  const instance = emitterProvider();
  const emit = instance.emit;
	const loc = win.location;
  const history = win.history;
  const getState = forHash
    ? () => urlExtend(loc.href, {
      child: {}
    }).child.query
    : () => unparam(loc.search);

	let locked;
  let state = getState();

  const setState = (nextState) => {
    locked = true;

    const url = loc.href;
    const srcloc = urlParse(url);

    (forHash ? (srcloc.child || (srcloc.child = {})) : srcloc).query = nextState;

    history.pushState(null, null, urlExtend(srcloc).href);

    changeState(nextState);
    locked = false;
  };

	const set = instance.set = (key, value) => {
		if (isEqual(value, state[key])) return;
    const nextState = map(state);
    if (!value && value !== 0) {
	    delete nextState[key];
		} else {
      nextState[key] = value
		}
    setState(nextState);
		return instance;
	};
	instance.get = (key) => state[key];
	instance.remove = (key) => set(key, null);
	instance.getKeys = () => Object.keys(state);
	instance.clear = () => {
    setState({});
		return instance;
	};

  const changeState = (nextState) => {
    const prev = state;
    state = nextState;
    const exclude = {};
    const changed = {};
    let value, key;
    for (key in state) {
      exclude[key] = true;
      isEqual(prev[key], value = state[key]) || (changed[key] = value);
    }
    for (key in prev) exclude[key] || isEqual(prev[key], value = state[key]) || (changed[key] = value);
    for (key in changed) emit({
      key: key,
      value: changed[key]
    });
  };
  win.addEventListener('popstate', instance.refresh = () => {
    locked || changeState(getState());
  });
  return instance;
};
