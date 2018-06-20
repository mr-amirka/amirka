/**
 * @overview observable-store
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

import {toPath, get, set, noop, extend, remove, isPlainObject, isLength} from 'lodash';
import {isOwner} from '../base/is-owner';
import {execute} from '../base/execute';
import {removeOf} from '../base/remove-of';
import {extendDepth} from '../base/extend-depth';
import {getByType} from '../base/get-by-type';

const defaultMergeDepth = 0;

const __push = [].push;
export function ObservableStore(){
  const self = this;
  var $$actions = [];

  const __subcheck = (path, changed) => {
    let scope = self.$$scope;
    let props, subscribers = scope.subscribers;
    let callbacks = subscribers ? [].concat(subscribers) : [];
    let pi = 0, pl = path.length || 0, k;
    for(; pi < pl; pi++){
      if(!(props = scope.props))return execute(callbacks);
      k = path[pi];
      if(!(scope = props[k]))return execute(callbacks);
      if(subscribers = scope.subscribers)__push.apply(callbacks, subscribers);
    }
    if(props = scope.props){
      if(changed){
        for(k in changed){
          if(!(scope = props[k]))continue;
          if(subscribers = scope.subscribers)__push.apply(callbacks, subscribers);
          __select(callbacks, scope.props);
        }
      }else{
        __select(callbacks, props);
      }
    }
    execute(callbacks);
  };

  const __check = (path, changed) => {
    __subcheck(path, changed);
    let actions = $$actions;
    $$actions = [];
    execute(actions);
  };

  const __getAll = (paths) => {
    let source = self.$$source;
    let path, i = 0, l = paths.length, args = new Array(l);
    for(; i < l; i++)args[i] = (path = paths[i]).length ? get(source, path) : source;
    return args;
  };

  const __subscribeOnProp = (path, subscriber) => {
    let scope = self.$$scope;
    let props, pi = 0, pl = path.length, k;
    for(; pi < pl; pi++){
      k = path[pi];
      props = scope.props || (scope.props = {});
      scope = props[k] || (props[k] = {});
    }
    (scope.subscribers || (scope.subscribers = [])).push(subscriber);
  };

  const __unsubscribeFromProp = (path, subscriber) => {
    let scope = self.$$scope;
    let props, subscribers, pi = 0, pl = path.length;
    for(; pi < pl; pi++){
      if(!(props = scope.props))return;
      if(!(scope = props[ path[pi] ]))return;
    }
    if(subscribers = scope.subscribers)removeOf(subscribers, subscriber);
  };

  const __ex = (callback, args) => {
    try{
      callback.apply(self, args);
    }catch(ex){
      console.error(ex);
    }
  };

  const subscribeCore = (paths, subscriber, isOnce) => {
    var isLocked = false;
    const action = isOnce ? () => {
      let source = self.$$source;
      let path, i = 0, l = paths.length, args = new Array(l);
      let isContinueVar = true;
      for(; i < l; i++){
        if((path = paths[i]).length){
          if((args[i] = get(source, path)) === undefined){
            isContinueVar = false;
            break;
          }
        }else{
          args[i] = source;
        }
      }
      if(isContinueVar){
        unsubscribe();
        __ex(subscriber, args);
      }
      isLocked = false;
    } : () => {
      __ex(subscriber, __getAll(paths));
      isLocked = false;
    };
    const trigger = () => {
      if(isLocked)return;
      isLocked = true;
      $$actions.push(action);
    };
    for(let i = 0, l = paths.length; i < l; i++)__subscribeOnProp(paths[i], trigger);
    let isRemoved;
    const unsubscribe = () => {
      if(isRemoved)return;
      for(let i = 0, l = paths.length; i < l; i++)__unsubscribeFromProp(paths[i], trigger);
      isRemoved = true;
    };
    return unsubscribe;
  };
  const __emit = (eventArgs) => {
    let w = [].concat(self.$$delegates), i = w.length;
    for(; i--;){
      try {
        w[i].callback.apply(self, eventArgs);
      } catch(ex) {
        console.error(ex);
      }
    }
  };
  function emit(key, value, mergeDepth) {
    const $$loopLocked = self.$$loopLocked;
    const args = arguments;
    if(isPlainObject(key)) {
      mergeDepth = value;
      value = key;
      key = '';
    }
    if($$loopLocked[key])return self;
    $$loopLocked[key] = true;
    const source = self.$$source;
    mergeDepth === undefined && (mergeDepth = self.$$mergeDepth);
    const selfSet = key ? (value) => {
      let path = toPath(key);
      let dstValue = get(source, path);
      let isObj = isPlainObject(value);
      if(mergeDepth > -1 && isObj){
        if(!isOwner(dstValue))set(source, path, dstValue = {});
        extendDepth(dstValue, value, mergeDepth);
      }else{
        set(source, path, value);
      }
      isObj ? __check(path, value) : __check(path);
      __emit(args);
    } : (value) => {
      if(!isPlainObject(value))return;
      extendDepth(source, value, mergeDepth);
      __check([], value);
      __emit(args);
    };
    function resolveSet(value){
      if(value instanceof Promise)return value.then(resolveSet);
      selfSet(value);
    }
    resolveSet(value);
    delete $$loopLocked[key];
    return self;
  }

  const share = (dstStore, overrides) => {
    self.$$delegates.push({
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
    let w = self.$$delegates;
    let rem = it => it.store === store;
    var store;
    for(let i = arguments.length; i--;){
      store = arguments[i];
      w = remove(w, rem);
    }
    self.$$delegates = w;
  }


  const __ready = (paths, subscriber) => {
    let source = self.$$source;
    let path, i = 0, l = paths.length, args = new Array(l);
    for(; i < l; i++){
      if((path = paths[i]).length){
        if((args[i] = get(source, path)) === undefined)return subscribeCore(paths, subscriber, true);
      }else{
        args[i] = source;
      }
    }
    __ex(subscriber, args);
    return noop;
  };

  const __subscribe = (paths, subscriber, forever) => {
    const oldArgs = __getAll(paths);
    __ex(subscriber, oldArgs);
    return subscribeCore(paths, forever ? subscriber : function(){
      let i = arguments.length, isChanged, arg;
      for(; i--;){
        if((arg = arguments[i]) === oldArgs[i])continue;
        oldArgs[i] = arg;
        isChanged = true;
      }
      if(isChanged)subscriber.apply(self, arguments);
    });
  };
  return extend(self, {
    $$loopLocked: {},
    $$source: {},
    $$mergeDepth: defaultMergeDepth,
    $$scope: {},
    $$delegates: [],
    lastOff: noop,

    emit, set: emit,
    get(key) {
      if(!key)return self.$$source;
      return get(self.$$source, key);
    },
    getAll(keys) {
      return __getAll(__preparePaths(keys));
    },
    ready(){
      self.lastOff = subOn(arguments, __ready);
      return self;
    },
    subscribe() {
      self.lastOff = subOn(arguments, __subscribe);
      return self;
    },
    on() {
      self.lastOff = subOn(arguments, subscribeCore);
      return self;
    },
    once(){
      const unsubscribe = self.lastOff = subOn(arguments, (paths, subscriber) => {
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
      self.$$delegates = [];
      return self;
    },
    connect(dstStore, dstOverrides, srcOverrides) {
      share(dstStore, dstOverrides);
      dstStore.share(self, srcOverrides);
      return self;
    },
    disconnect() {
      unshare.apply(self, arguments);
      for(let l = arguments.length; l--;)arguments[l].unshare(self);
      return self;
    },
    disconnectAll() {
      let w = self.$$delegates, i = w.length;
      self.$$delegates = [];
      for(; i--;)w[i].store.unshare(self);
      return self;
    }

  });
}
const subOn = (args, subscribe) => {
  let options = getByType(args, argsTypes);
  let paths = options.paths;
  let subscriber = options.subscriber;
  let forever = options.forever;
  let pathName;
  if(!paths)return subscribe([ (pathName = options.pathName) ? toPath(pathName) : [] ], subscriber, forever);
  if(isLength(paths.length))return subscribe(__preparePaths(paths), subscriber, forever);
  let unsubscribeItems = [];
  for(pathName in paths)unsubscribeItems.push(subscribe([ toPath(pathName) ], paths[pathName], forever));
  return () => execute(unsubscribeItems);
};

const __select = (callbacks, props) => {
  if(!props)return;
  let k, scope, subscribers;
  for(k in props){
    if(!(scope = props[k]))continue;
    if(subscribers = scope.subscribers)__push.apply(callbacks, subscribers);
    __select(callbacks, scope.props);
  }
};
const __preparePaths = (src) => {
  let l = src.length, i = 0, paths = new Array(l);
  for(; i < l; i++)paths[i] = toPath(src[i]);
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
}).lastOff;
unsubscribe();
*/