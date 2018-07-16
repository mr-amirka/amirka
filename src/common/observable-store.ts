/**
 * @overview observable-store
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {toPath, get, set, noop, extend, remove, isPlainObject, isLength} from 'lodash';
import {isOwner} from '../base/is-owner';
import {executeEach} from '../base/execute-each';
import {removeOf} from '../base/remove-of';
import {extendDepth} from '../base/extend-depth';
import {getByType} from '../base/get-by-type';

const defaultMergeDepth = 0;

const __push = [].push;

interface delegate {
  callback: (pathName: string) => ObservableStore;
  store: ObservableStore
}

interface scope {
  subscribers: fn[];
  childs: scopeChilds
}

interface scopeChilds {
  [name: string]: scope
}

interface overrides {
  [name: string]: (key: string, value: any) => any 
}

interface on {
  (keys: string[], subscriber: fn): ObservableStore;
  (subscriber: fn): ObservableStore;
}

interface emit {
  (key: string, value: any, mergeDepth?: number): ObservableStore;
  (map: {[key: string]: any}, mergeDepth?: number): ObservableStore;
}

export class ObservableStore {

  _loopLocked: {
    [name: string]: boolean
  };
  _source: {
    [name: string]: any
  };
  _mergeDepth = defaultMergeDepth;
  _scope: scope;
  _delegates: delegate[];
  _lastOff: fn;
  emit: emit;
  set: emit;
  get: (key: string) => any;
  getAll: (keys: string[]) => any[];
  ready: on;
  subscribe: on;
  on: on;
  once: on;
  share: (dstStore: ObservableStore, overrides: overrides) => ObservableStore;
  unshare: (...stores: ObservableStore[]) => ObservableStore;
  unshareAll: () => ObservableStore;
  connect: (dstStore: ObservableStore, dstOverrides: overrides, srcOverrides: overrides) => ObservableStore;
  disconnect: (...stores: ObservableStore[]) => ObservableStore;
  disconnectAll: () => ObservableStore;

  constructor() {
    const self = this;
    let _actions: fn[] = [];

    const __subcheck = (path: string[], changed?: any) => {
      let scope = self._scope;
      let childs: scopeChilds, subscribers = scope.subscribers;
      let callbacks = subscribers ? [].concat(subscribers) : [];
      let pi = 0, pl = path.length || 0, k;
      for (; pi < pl; pi++) {
        if (!(childs = scope.childs)) return executeEach(callbacks);
        k = path[pi];
        if (!(scope = childs[k])) return executeEach(callbacks);
        if (subscribers = scope.subscribers) __push.apply(callbacks, subscribers);
      }
      if (childs = scope.childs) {
        if (changed) {
          for (k in changed) {
            if (!(scope = childs[k])) continue;
            if (subscribers = scope.subscribers) __push.apply(callbacks, subscribers);
            __select(callbacks, scope.childs);
          }
        } else {
          __select(callbacks, childs);
        }
      }
      executeEach(callbacks);
    };

    const __check = (path: string[], changed?: any) => {
      __subcheck(path, changed);
      let actions = _actions;
      _actions = [];
      executeEach(actions);
    };

    const __getAll = (paths: string[][]) => {
      let source = self._source;
      let path, i = 0, l = paths.length, args = new Array(l);
      for(; i < l; i++)args[i] = (path = paths[i]).length ? get(source, path) : source;
      return args;
    };

    const __subscribeOnProp = (path: string[], subscriber: fn) => {
      let scope = self._scope;
      let childs: scopeChilds, pi = 0, pl = path.length, k;
      for(; pi < pl; pi++){
        k = path[pi];
        childs = scope.childs || (scope.childs = {});
        scope = childs[k] || (childs[k] = <scope> {});
      }
      (scope.subscribers || (scope.subscribers = [])).push(subscriber);
    };

    const __unsubscribeFromProp = (path: string[], subscriber:fn) => {
      let scope = self._scope;
      let childs, subscribers, pi = 0, pl = path.length;
      for (; pi < pl; pi++) {
        if (!(childs = scope.childs)) return;
        if (!(scope = childs[ path[pi] ])) return;
      }
      if (subscribers = scope.subscribers) removeOf(subscribers, subscriber);
    };

    const __ex = (callback: fn, args: any[]) => {
      try {
        callback.apply(self, args);
      } catch (ex){
        console.error(ex);
      }
    };

    const subscribeCore = (paths: string[][], subscriber: fn, isOnce?: boolean) => {
      let isLocked = false;
      const action = isOnce ? () => {
        let source = self._source;
        let path: string[], i = 0, l = paths.length, args: any = new Array(l);
        let isContinueVar = true;
        for (; i < l; i++) {
          if ((path = paths[i]).length) {
            if ((args[i] = get(source, path)) === undefined) {
              isContinueVar = false;
              break;
            }
          } else {
            args[i] = source;
          }
        }
        if (isContinueVar) {
          unsubscribe();
          __ex(subscriber, args);
        }
        isLocked = false;
      } : () => {
        __ex(subscriber, __getAll(paths));
        isLocked = false;
      };
      const trigger = () => {
        if (isLocked) return;
        isLocked = true;
        _actions.push(action);
      };
      for (let i = 0, l = paths.length; i < l; i++) __subscribeOnProp(paths[i], trigger);
      let isRemoved: boolean;
      const unsubscribe = () => {
        if (isRemoved) return;
        for (let i = 0, l = paths.length; i < l; i++) __unsubscribeFromProp(paths[i], trigger);
        isRemoved = true;
      };
      return unsubscribe;
    };
    const __emit = (eventArgs: any[]) => {
      let w = [].concat(self._delegates), i = w.length;
      for(; i--;){
        try {
          w[i].callback.apply(self, eventArgs);
        } catch(ex) {
          console.error(ex);
        }
      }
    };
    function emit(key: string, value: any, mergeDepth?: number) {
      const _loopLocked = self._loopLocked;
      const args: any[] = <any> arguments;
      if (isPlainObject(key)) {
        mergeDepth = value;
        value = key;
        key = '';
      }
      if (_loopLocked[key]) return self;
      _loopLocked[key] = true;
      const source = self._source;
      mergeDepth === undefined && (mergeDepth = self._mergeDepth);
      const selfSet = key ? (value: any) => {
        let path = toPath(key);
        let dstValue = get(source, path);
        let isObj = isPlainObject(value);
        if (mergeDepth > -1 && isObj) {
          if (!isOwner(dstValue)) set(source, path, dstValue = {});
          extendDepth(dstValue, value, mergeDepth);
        } else {
          set(source, path, value);
        }
        isObj ? __check(path, value) : __check(path);
        __emit(args);
      } : (value: any) => {
        if (!isPlainObject(value)) return;
        extendDepth(source, value, mergeDepth);
        __check([], value);
        __emit(args);
      };
      function resolveSet(value: any): void {
        let _then = value && value.then;
        _then && typeof _then === 'function'
          ? value.then(resolveSet)
          : selfSet(value);
      }
      resolveSet(value);
      delete _loopLocked[key];
      return self;
    }

    const share = (dstStore: ObservableStore, overrides: overrides) => {
      self._delegates.push({
        store: dstStore,
        callback: overrides ? function(pathName){
          return (overrides[pathName] || dstStore.emit).apply(dstStore, arguments);
        } : function(){
          return dstStore.emit.apply(dstStore, arguments);
        }
      });
      return self;
    };
    function unshare() {
      const rem = (it: delegate) => it.store === store;
      let w = self._delegates;
      let store: ObservableStore;
      for(let i = arguments.length; i--;){
        store = arguments[i];
        w = remove(w, rem);
      }
      self._delegates = w;
    }


    const __ready = (paths: string[][], subscriber: fn) => {
      let source = self._source;
      let path, i = 0, l = paths.length, args = new Array(l);
      for (; i < l; i++) {
        if ((path = paths[i]).length) {
          if ((args[i] = get(source, path)) === undefined) return subscribeCore(paths, subscriber, true);
        } else {
          args[i] = source;
        }
      }
      __ex(subscriber, args);
      return noop;
    };

    const __subscribe = (paths: string[][], subscriber: fn, forever: boolean) => {
      const oldArgs = __getAll(paths);
      __ex(subscriber, oldArgs);
      return subscribeCore(paths, forever ? subscriber : function() {
        let i = arguments.length, isChanged: boolean, arg: any;
        for (; i--;) {
          if ((arg = arguments[i]) === oldArgs[i]) continue;
          oldArgs[i] = arg;
          isChanged = true;
        }
        if (isChanged) subscriber.apply(self, arguments);
      });
    };
    return extend(self, {
      _loopLocked: {},
      _source: {},
      _mergeDepth: defaultMergeDepth,
      _scope: {},
      _delegates: [],
      _lastOff: noop,

      emit, set: emit,
      get(key: string) {
        return key ? get(self._source, key) : self._source;
      },
      getAll(keys: string[]) {
        return __getAll(__preparePaths(keys));
      },
      ready(){
        self._lastOff = subOn(<any> arguments, __ready);
        return self;
      },
      subscribe() {
        self._lastOff = subOn(<any> arguments, __subscribe);
        return self;
      },
      on() {
        self._lastOff = subOn(<any> arguments, subscribeCore);
        return self;
      },
      once(){
        const unsubscribe = self._lastOff = subOn(<any> arguments, (paths: string[][], subscriber: fn) => {
          return subscribeCore(paths, function() {
            subscriber.apply(self, arguments);
            unsubscribe();
          });
        });
        return self;
      },
      share,
      unshare,
      unshareAll(){
        self._delegates = [];
        return self;
      },
      connect(dstStore: ObservableStore, dstOverrides: overrides, srcOverrides: overrides) {
        share(dstStore, dstOverrides);
        dstStore.share(self, srcOverrides);
        return self;
      },
      disconnect() {
        unshare.apply(self, arguments);
        for (let l = arguments.length; l--;) arguments[l].unshare(self);
        return self;
      },
      disconnectAll() {
        let w = self._delegates, i = w.length;
        self._delegates = [];
        for (; i--;) w[i].store.unshare(self);
        return self;
      }

    });
  }
}
const subOn = (args: any[], subscribe: fn) => {
  let options = getByType(args, argsTypes);
  let paths = options.paths;
  let subscriber = options.subscriber;
  let forever = options.forever;
  let pathName;
  if (!paths) return subscribe([ (pathName = options.pathName) ? toPath(pathName) : [] ], subscriber, forever);
  if (isLength(paths.length)) return subscribe(__preparePaths(paths), subscriber, forever);
  let unsubscribeItems: fn[] = [];
  for (pathName in paths) unsubscribeItems.push(subscribe([ toPath(pathName) ], paths[pathName], forever));
  return () => executeEach(unsubscribeItems);
};

const __select = (callbacks: fn[], childs: scopeChilds) => {
  if (!childs) return;
  let k, scope, subscribers;
  for (k in childs) {
    if (!(scope = childs[k])) continue;
    if (subscribers = scope.subscribers) __push.apply(callbacks, subscribers);
    __select(callbacks, scope.childs);
  }
};
const __preparePaths = (src: string[]) => {
  let l = src.length, i = 0, paths = new Array(l);
  for(; i < l; i++) paths[i] = toPath(src[i]);
  return paths;
};
const argsTypes = {
  string: [ 'pathName' ],
  'function': [ 'subscriber' ],
  object: [ 'paths' ],
  boolean: [ 'forever' ]
};

/*
let store$ = new ObservableStore();
let unsubscribe = store$.on([ 'app.hosts.apiUrl' ], (apiUrl) => {
  console.log(apiUrl);
})._lastOff;
unsubscribe();
*/