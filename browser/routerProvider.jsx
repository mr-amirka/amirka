/**
 * @overview routerProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 */

const isEqual = require('../isEqual');
const urlParse = require('../urlParse');
const urlExtend = require('../urlExtend');
const merge = require('../merge');
const map = require('../map');
const noop = require('../noop');
const keys = require('../keys');
const without = require('../without');
const routeParseProvider = require('../routeParseProvider');
const isMatch = require('../isMatch');
const getClass = require('../getClass');

const emitterProvider = require('../emitterProvider');

/*
const withoutFields = [ 'hostname', 'protocol', 'port', 'username', 'password' ];
const mergeLocation = (prev, exten) => without(merge([
  prev, exten, {
    child: without(merge([ prev.child, exten.child ]), withoutFields)
  }
]), withoutFields);
*/
const mergeLocation = (prev, exten) => {
  const child = exten.child || {};
  const prevChild = prev.child || {};

  return urlExtend(exten.path || prev.path, {
    query: exten.query || null,
    child: urlExtend(child.path || prevChild.path, {
      query: child.query || null
    })
  });
};
module.exports = ({ PureComponent, window }) => {

  const { location, history } = window;

  const getLocation = () => urlParse(location.href);
  const location$ = emitterProvider(getLocation());
  const path$ = location$.map(v => v.path || '');

  window.addEventListener('popstate', (e) => {
    location$.emit(getLocation());
  });
  const pushLocation = (extendsLocation) => {
    const location = urlExtend(mergeLocation(location$.getValue(), extendsLocation));
    history.pushState(null, null, location.href);
    location$.emit(location);
    return location;
  };
  const replaceLocation = (extendsLocation) => {
    const location = urlExtend(mergeLocation(location$.getValue(), extendsLocation));
    history.replaceState(null, null, location.href);
    location$.emit(location);
    return location;
  };

  const hashLocation$ = location$.map(v => v.child || {});
  const hashPath$ = hashLocation$.map(v => v.path || '');

  const pushHashLocation = child => pushLocation({ child });
  const replaceHashLocation = child => replaceLocation({ child });
  const backLocation = () => {
    history.back();
  };

  let hasDurationLink;
  const LinkProvider = (options) => {
    const { pushLocation, isHash } = options;
    return (props) => {
      const onClick = props.onClick || null;
      const options = urlExtend(props.href, props.options);
      const url = options.href;
      const Component = props.component || 'a';
      const timeout = props.timeout || 0;
      const action = () => {
        hasDurationLink = false;
        pushLocation(options);
      };

      const addition = url ? {
        href: (isHash ? ('#' + url) : url)
      } : {};

      return (
        <Component { ...without(props, [ 'onClick', 'options', 'component', 'timeout', 'href' ], addition) } onClick={url ? (e) => {
          e.preventDefault();
          onClick && onClick();
          if (!hasDurationLink) {
            hasDurationLink = true;
            timeout ? setTimeout(action, timeout) : action();
          }
          return false;
        } : onClick}/>
      );
    };
  };

  const Link = LinkProvider({ pushLocation });
  const HashLink = LinkProvider({ pushLocation: pushHashLocation, isHash: true });

  const NavLinkProvider = (Link, location$) => {
    class NavLink extends PureComponent {
      constructor(props) {
        super(props);
        const self = this;
        self.state = location$.getValue();

        let subscription;
        self.componentDidMount = () => {
          subscription || (subscription = location$.on((nextState) => {
            self.setState(nextState);
          }));
        };
    		self.componentWillUnmount = () => {
    	    if (subscription) {
            subscription();
            subscription = null;
          }
    	  };
        const change = (state) => {
          self.setState(state);
          onChange(state);
        };
        self.render = () => {
          const { props, state } = self;
          const matchs = urlExtend(props.href, props.options);
          /*
          console.log(state.path, matchs.path, {
            active: state.path === matchs.path
          });
          */
          return (<Link { ...props} className={getClass({
            active: state.path === matchs.path && isMatch(state.query, matchs.query)
          }, props.className)}/>)
        };
      }
    }
    return NavLink;
  };

  const NavLink = NavLinkProvider(Link, location$);
  const HashNavLink = NavLinkProvider(HashLink, hashLocation$);

  const NoopRender = () => null;
  const RouterProvider = (_routes, NotFoundRouteRender) => {
    const routes = map(_routes, ([ route, render ]) => {
      return [ routeParseProvider(route), render ];
    });
    const NotFoundRender = NotFoundRouteRender || NoopRender;
    return (props) => {
      const { path } = props;
      const length = routes.length;
      let params, route, _props = props, Component = NotFoundRender;
      for (let i = 0; i < length; i++) {
        route = routes[i];
        if (route[0](path, params = {})) {
          Component = route[1];
          _props = merge([ props, { params } ]);
          break;
        }
      }
      return (
        <Component { ..._props }/>
      );
    };
  };


  const paramStorageProvider = (location$, pushLocation) => {
    const instance = emitterProvider({});
    const emit = instance.emit;
  	let locked;
    let state = location$.getValue().query || {};

    const setState = (query) => {
      locked = true;
      pushLocation({ query });
      changeState(query);
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
  	instance.getKeys = () => keys(state);
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
    location$.on((state) => {
      locked || changeState(state.query || {});
    });
    return instance;
  };


  const routerForEmitterMapProvider = (_routes, notFoundHandler) => {
    const routes = map(_routes, ([ route, render ]) => {
      return [ routeParseProvider(route), render ];
    });
    const notFound = notFoundHandler || noop;
    return (path) => {
      const length = routes.length;
      let params = {}, result, route, handler = notFoundHandler;
      for (let i = 0; i < length; i++) {
        route = routes[i];
        if (route[0](path, params = {})) {
          if (result = route[1](params, path)) return result;
        }
      }
      return notFoundHandler(params, path);
    };
  };

  return {
    location$,
    path$,
    hashLocation$,
    hashPath$,
    LinkProvider,
    RouterProvider,
    routerForEmitterMapProvider,
    paramStorageProvider,
    paramStorage: paramStorageProvider(location$, pushLocation),
    hashParamStorage: paramStorageProvider(hashLocation$, pushHashLocation),
    Link,
    NavLink,
    HashLink,
    HashNavLink,
    getLocation,
    pushLocation,
    replaceLocation,
    pushHashLocation,
    replaceHashLocation,
    backLocation
  };
};
