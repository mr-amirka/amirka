/**
 * @overview routerProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 */

const isEqual = require('../isEqual');
const urlParse = require('../urlParse');
const urlExtend = require('../urlExtend');
const extend = require('../extend');
const map = require('../map');
const noop = require('../noop');
const keys = require('../keys');
const without = require('../without');
const routeParseProvider = require('../routeParseProvider');
const isMatch = require('../isMatch');
const childClass = require('../childClass');
const Emitter = require('../Emitter');

const WITHOUT_FIELDS_LINK = [
  'onClick', 'options', 'component', 'timeout', 'href', 'activeAsParent',
];

function mergeLocation(prev, exten) {
  const child = exten.child || {};
  const prevChild = prev.child || {};
  return urlExtend(exten.path || prev.path, {
    query: exten.query || null,
    child: urlExtend(child.path || prevChild.path, {
      query: child.query || null,
    }),
  });
}
function getPath(v) {
  return v.path || '';
}
function getChild(v) {
  return v.child || {};
}
module.exports = ({Component, window, createElement}) => {
  let hasDurationLink;
  const {location, history} = window;
  const getLocation = () => urlParse(location.href);
  const location$ = new Emitter(getLocation());
  const path$ = location$.map(getPath);
  const hashLocation$ = location$.map(getChild);
  const hashPath$ = hashLocation$.map(getPath);
  const Link = LinkProvider({pushLocation}); // eslint-disable-line
  const HashLink = LinkProvider({pushLocation: pushHashLocation, isHash: true}); // eslint-disable-line
  const NavLink = NavLinkProvider(Link, location$); // eslint-disable-line
  const HashNavLink = NavLinkProvider(HashLink, hashLocation$); // eslint-disable-line

  window.addEventListener('popstate', (e) => {
    location$.emit(getLocation());
  });

  function pushLocation(extendsLocation) {
    const location = mergeLocation(location$.getValue(), extendsLocation);
    history.pushState(null, null, location.href);
    location$.emit(location);
    return location;
  }
  function storagePushLocation(extendsLocation) {
    const location = urlExtend(location$.getValue(), extendsLocation);
    history.pushState(null, null, location.href);
    location$.emit(location);
    return location;
  }
  function replaceLocation(extendsLocation) {
    const location = mergeLocation(location$.getValue(), extendsLocation);
    history.replaceState(null, null, location.href);
    location$.emit(location);
    return location;
  }
  function pushHashLocation(child) {
    return pushLocation({child});
  }
  function storagePushHashLocation(child) {
    return storagePushLocation({child: child});
  }
  function replaceHashLocation(child) {
    return replaceLocation({child});
  }
  function backLocation() {
    history.back();
  }
  function LinkProvider({pushLocation, isHash}) {
    return (props) => {
      const onClick = props.onClick || noop;
      const options = urlExtend(props.href, props.options);
      const url = options.href;
      const timeout = props.timeout || 0;
      const addition = url ? {
        href: (isHash ? ('#' + url) : url),
      } : {};
      addition.onClick = url ? (e) => {
        e.preventDefault && e.preventDefault();
        if (!hasDurationLink) {
          hasDurationLink = 1;
          onClick(e);
          timeout ? setTimeout(action, timeout) : action();
        }
        return false;
      } : onClick;
      function action() {
        hasDurationLink = 0;
        pushLocation(options);
      }
      return createElement(
          props.component || 'a',
          without(props, WITHOUT_FIELDS_LINK, addition),
      );
    };
  }
  function NavLinkProvider(Link, location$) {
    return childClass(Component, function(props) {
      let subscription;
      const self = this;
      const setState = self.setState.bind(self);
      self.state = location$.getValue();
      self.UNSAFE_componentWillMount = () => {
        subscription || (subscription = location$.on(setState));
      };
      self.componentWillUnmount = () => {
        subscription && (subscription(), subscription = 0);
      };
      self.render = () => {
        const {props, state} = self;
        const path = state.path || '/';
        const matchs = urlExtend(props.href, props.options);
        const targetPath = matchs.path;
        const _props = extend({}, props);
        (
          props.activeAsParent
            && path.startsWith(
              targetPath.slice(-1) === '/' ? targetPath : (targetPath + '/'),
            )
            || (
              path === targetPath
                && isMatch(state.query || {}, matchs.query)
            )
        ) && (_props.className = 'active ' + (props.className || ''));
        return createElement(Link, _props);
      };
    });
  }

  function paramStorageProvider(location$, pushLocation) {
    const instance = new Emitter({});
    const emit = instance.emit;
    let locked;
    let state = location$.getValue().query || {};

    function setState(query) {
      locked = 1;
      pushLocation({query});
      changeState(query);
      locked = 0;
    }
    function set(key, v, nextState) {
      isEqual(v, state[key]) || (
        nextState = map(state),
        nextState[key] = v || null,
        setState(nextState)
      );
      return instance;
    }

    instance.set = set;
    instance.get = (key) => state[key];
    instance.remove = (key) => set(key);
    instance.getKeys = () => keys(state);
    instance.clear = () => {
      setState({});
      return instance;
    };
    function changeState(nextState) {
      const prev = state;
      const exclude = {};
      const changed = {};
      let v, k; // eslint-disable-line
      state = nextState;
      for (k in state) { // eslint-disable-line
        exclude[k] = 1;
        isEqual(prev[k], v = state[k]) || (changed[k] = v);
      }
      for (k in prev) exclude[k] // eslint-disable-line
        || isEqual(prev[k], v = state[k]) || (changed[k] = v);
      for (k in changed) emit({ // eslint-disable-line
        key: k,
        value: changed[k],
      });
    }
    location$.on((state) => {
      locked || changeState(state.query || {});
    });
    return instance;
  }
  function routerForEmitterMapProvider(routes, notFoundHandler) {
    routes = map(routes, ([route, render]) => {
      return [routeParseProvider(route), render];
    });
    return (path) => {
      const length = routes.length;
      let i = 0, params = {}, result, route; // eslint-disable-line
      for (; i < length; i++) {
        route = routes[i];
        if (
          route[0](path, params = {})
          && (result = route[1](params, path))
        ) return result;
      }
      return notFoundHandler && notFoundHandler(params, path) || null;
    };
  }

  return {
    location$,
    path$,
    hashLocation$,
    hashPath$,
    LinkProvider,
    routerForEmitterMapProvider,
    paramStorageProvider,
    paramStorage: paramStorageProvider(location$, storagePushLocation),
    hashParamStorage:
      paramStorageProvider(hashLocation$, storagePushHashLocation),
    Link,
    NavLink,
    HashLink,
    HashNavLink,
    getLocation,
    pushLocation,
    replaceLocation,
    pushHashLocation,
    replaceHashLocation,
    storagePushLocation,
    storagePushHashLocation,
    backLocation,
  };
};
