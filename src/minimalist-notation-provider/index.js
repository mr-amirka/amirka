/**
 * @overview minimalist-notation
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {
  extend,
  sortBy,
  isString,
  isEmpty,
  isLength,
  isArrayLikeObject,
  map as __map,
  values as __values,
  indexOf,
  set as __set,
  get as __get,
  toPath,
  noop,
  reduce
} from 'lodash';
import {execute} from '../base/execute';
import {getByType} from '../base/get-by-type';
import {cloneDepth} from '../base/clone-depth';
import {extendDepth} from '../base/extend-depth';
import {mergeDepth} from '../base/merge-depth';
import {flagsSimple as __flags} from '../base/flags';
import {joinArrays} from '../common/join-arrays';
import {routeParseProvider} from '../common/route-parse-provider';
import {immediate} from '../common/immediate';
import {cssPropertiesStringifyProvider} from '../common/css-properties-stringify-provider';
import {selectorsCompileProvider} from './selectors-compile-provider';

export {selectorsCompileProvider};
export const minimalistNotationProvider = ($$storage) => {

  const mn = (essencePath, extendedEssence, paramsMatchPath) => {
    
    const pathType = typeof essencePath;

    if (pathType === 'object') {
      __setMap(essencePath);
      return mn;
    }

    if (!essencePath || pathType !== 'string') {
      console.warn('MN: essencePath value must be an string', essencePath);
      return mn;
    }

    const type = typeof extendedEssence;

    if (type === 'function') {
      $$handlerMap[essencePath] = 
        paramsMatchPath ? 
        handlerWrap(extendedEssence, paramsMatchPath) : 
        extendedEssence;
      return mn;
    }
    if (type === 'object') {
      __setEssense(essencePath, extendedEssence);
      return mn;
    }
    console.warn('MN: extendedEssence value must be an object on', extendedEssence, 'where', essencePath);
    return mn;
  };
  const __setMap = (map) => {
    let essencePath, extendedEssence, type;
    for (essencePath in map) {
      extendedEssence = map[essencePath];
      type = typeof extendedEssence;
      if (type === 'function') {
        $$handlerMap[essencePath] = extendedEssence;
        continue;
      }
      if (type === 'object') {
        __setEssense(essencePath, extendedEssence);
      } else {
        console.warn('MN: extendedEssence value must be an object on', extendedEssence, 'where', essencePath);
      }
    }
  };
  const __setEssense = (essencePath, extendedEssence) => {
    
    essencePath = toPath(essencePath);
    const essenceName = essencePath[0];
    const path = [ essenceName ];
    $$staticsEssences[essenceName] || ($$staticsEssences[essenceName] = __normalize({
      inited: true
    }));
    for (let i = 1, l = essencePath.length; i < l; i++) {
      path.push('childs', essencePath[i]);
    }
    __set($$staticsEssences, path, mergeDepth([ 
      __get($$staticsEssences, path), 
      __normalize(extendedEssence)
    ], {}, $$mergeDepth));
  };

  selectorsCompileProvider(mn);
  const classNameCompile = mn.classNameCompile;
  const attrCompile = mn.attrCompile;
 
  mn.$$storage = $$storage;
  let storageSet = $$storage.set;
  let storageRemove = $$storage.remove;

  let $$essences;
  let $$root;
  let $$classNamesMap;
  let $$attrsMap;
  let $$statics;
  let $$staticsRoot;
  let $$staticsEssences;
  let $$keyframes;
  let $$css;
  let $$data = mn.data = {};
  let $$cache = mn.$$cache = {};
  let $$media = mn.media = {};
  let $$handlerMap = mn.handlerMap = {};
  let $$checkAttrs = mn.checkAttrs = {};
  let cssPropertiesStringify = mn.propertiesStringify = cssPropertiesStringifyProvider();

  let $$deferred = {};
  let $$newClassNames = [];
  let $$newAttrsMap = {};  
  
  const parseMediaName = (mediaName) => {
    if (!mediaName) return {
      priority: defaultPriority
    };
    const media = $$media[mediaName];
    let query = media && media.query;
    let priority = media && media.priority;
    if (query) {
      return {
        query,
        priority: priority || 0
      };
    }

    if (priority === 0) priority--;

    try {
      if (mediaName === 'x') throw 'empty parts';
      const mediaParts = mediaName.split('x');
      let v, mp;
      query = '';

      if (mp = parseMediaPart(mediaParts[0])) {
        if (v = mp.min) {
          query += '(min-width: ' + v + 'px)';
        }
        if (v = mp.max) {
          priority || (priority = -v);
          if (query) query += ' and ';
          query += '(max-width: ' + v + 'px)';
        }
      }

      if (mp = parseMediaPart(mediaParts[1])) {
        if (v = mp.min) {
          if (query) query += ' and ';
          query += '(min-height: ' + v + 'px)';
        }
        if (v = mp.max) {
          priority || (priority = -v);
          if (query) query += ' and ';
          query += '(max-height: ' + v + 'px)';
        }
      }
    } catch (ex) {
      return {
        query: mediaName,
        priority: defaultPriority
      };
    }

    priority || (priority = defaultPriority);
    priority++;
    return {query, priority};
  };

  const $$contextMods = {
    'media-queries': (mediaName, context) => {
      var isContinue = true;
      var essence, essenceName, contextEssence;
      for (essenceName in context) {
        if (!(essence = $$essences[essenceName])) continue;
        contextEssence = context[essenceName];
        if (contextEssence.updated) {
          isContinue = false;
          if (essence.updated) essence.rules = getRules(essence);
          contextEssence.priority = essence.priority || 0;
          contextEssence.updated = essence.updated = false;
          contextEssence.content = __getEessenceContent(essence.rules, contextEssence.map);
        }
      }

      if (isContinue) return;
      const media = parseMediaName(mediaName);
      const mediaQuery = media.query;
      const mediaPriority = media.priority;
      const essences = sortBy(__values(context), __sortByArgs);
      const l = essences.length;
      let output = new Array(l);
      for (let i = 0; i < l; i++) output[i] = essences[i].content;
      if (mediaQuery) output = ['@media ', mediaQuery, '{', output.join(''), '}'];
      setStyle($$rootPrefix + mediaName, output.join(''), mediaPriority);
    },
    'media-queries-essences': (mediaName, context) => {
      var essence, essenceName, contextEssence, content, priority;
      const media = parseMediaName(mediaName);
      const mediaQuery = media.query;
      const mediaPriority = (media.priority || 0) * 1000;
      if (mediaQuery) {
        mediaQuery = '@media ' + mediaQuery + '{';
      }
      var contextPrefix = $$rootPrefix + mediaName + '.';
      for (essenceName in context) {
        if (!(essence = $$essences[essenceName])) continue;
        contextEssence = context[essenceName];
        if (essence.updated || contextEssence.updated) {
          if (essence.updated) essence.rules = getRules(essence);
          priority = contextEssence.priority = essence.priority || 0;
          contextEssence.updated = essence.updated = false;
          content = contextEssence.content =  __getEessenceContent(essence.rules, contextEssence.map);
          if (mediaQuery) content = [ mediaQuery, content, '}' ].join('');
          setStyle(contextPrefix + essenceName, content, mediaPriority + priority);
        }
      }
    }
  };
  let $$mode = $$contextMods['media-queries'];


  const setStyle = (mediaName, content, priority) => {
    $$cache[mediaName] = true;
    storageSet(mediaName, content, priority);
  };

  const assign = (essencesNames, selectors) => {
    selectors = __flags(selectors);
    essencesNames = __flags(essencesNames);
    var essenceName, mediaName, sContext;
    var mediaName = '';
    sContext = $$staticsRoot[mediaName] || ($$staticsRoot[mediaName] = {});
    for (essenceName in essencesNames) {
      extend(sContext[essenceName] || (sContext[essenceName] = {}), selectors);
      updateEssenceWithout(essenceName, selectors, mediaName);
    }
    return mn;
  };

  const mnExtend = (essencesNames, xtsEssencesNames) => {
    essencesNames = __flags(essencesNames);
    xtsEssencesNames = xtsEssencesNames ? __flags(xtsEssencesNames) : null;
    for (let essenceName in essencesNames) {
      staticsEssence = $$staticsEssences[essenceName] || ($$staticsEssences[essenceName] = {});
      if (xtsEssencesNames) {
        extend(staticsEssence.exts || (staticsEssence.exts = {}), xtsEssencesNames);
      } else {
        staticsEssence.exts = {};
      }
    }
    return mn;
  };

  const __getRules = (rules, selectors, style, priority, childs) => {
    const css = cssPropertiesStringify(style);
    if (css) rules.push({ selectors, css: '{' + css + '}', priority });
    let k, child;
    for (k in childs) {
      if(child = childs[k])__getRules(
        rules, joinArrays([], selectors, child.selectors), 
        child.style, child.priority || 0, child.childs
      );
    }
    return rules;
  };

  const mnInclude = (essencesNames, includeEssencesNames) => {
    essencesNames = __flags(essencesNames);
    var includeEssencesMap = includeEssencesNames ? __flags(includeEssencesNames) : null;
    var include, i, l, includeEssenceName, tmp;
    for (var essenceName in essencesNames) {
      staticsEssence = $$staticsEssences[essenceName] || ($$staticsEssences[essenceName] = {});
      if (!includeEssencesMap) {
        delete staticsEssence.include;
        continue;
      }
      include = staticsEssence.include || (staticsEssence.include = []);
      tmp = [];
      for (i = 0, l = include.length; i < l; i++) {
        if (includeEssencesMap[includeEssenceName = include[i]]) continue;
        tmp.push(includeEssenceName);
      }
      staticsEssence.include = tmp.concat(includeEssencesNames);
    }
    return mn;
  };

  
  const getRules = (e) => {

    /* include impl start */
    const include = e.include;
    const length = include && include.length || 0;
    if (length) {
      let mixinEssenseName, mergingMixins = new Array(length + 1);
      mergingMixins[length] = e;
      for(i = length; i--;){
        mergingMixins[i] = updateEssence(mixinEssenseName = include[i], {}, {});    
      }
      e = mergeDepth(mergingMixins, {}, $$mergeDepth);
    }
    /* include impl end */

    return sortBy(__getRules([], e.selectors || [], e.style, 0, e.childs), item => item.priority);
  };
  

  const __extends = (exts, selectors, mediaName, excludes) => {
    for (let k in exts) updateEssence(k, selectors, mediaName, excludes);
  };


  const __updateEssence = (essenceName, selectors, mediaName, excludes) => {
    if (excludes[essenceName]) return;
    excludes[essenceName] = true;
    let essence = $$essences[essenceName];  
    const digest = () => {
      $$essences[essenceName] = essence;
      __extends(essence.exts, selectors, mediaName, excludes);
      const include = essence.include;
      if (include && include.length) __extends(__flags(include, {}), {}, mediaName, excludes);
      essence.updated = true;
    };     
    if (essence) {
      if (essence.inited) {
        __extends(essence.exts, selectors, mediaName, excludes);
        return essence;
      }
    } else {
      essence = cloneDepth($$staticsEssences[essenceName] || {}, $$mergeDepth);
      if (essence.inited) {
        digest();
        return essence;
      }
    }
    const params = { input: essenceName, name: essenceName, suffix: '' };
    __matchName(essenceName, params);
    __matchImportant(params.suffix, params);
    __matchValue(params.suffix, params);

    /**
     * Исходя из предшествующего опыта,
     * чтобы избавить разработчика от необходимости добалять 
     * эту логику руками в каждом отдельном обработчике,
     * параметр params.i добавляется автоматически
     */
    params.ni || (params.ni = '');
    params.i = params.ni ? '' : '!important';
    
    const _name = params.name;
    const handler = $$handlerMap[_name];

    if (!handler) return essence;

    const _essence = handler(params);

    if (_essence) {
      __essenceSet(essence, _essence);
      digest();
    }

    return essence;
  }


  const updateEssence = (essenceName, selectors, mediaName, excludes) => {
    const context = $$root[mediaName] || ($$root[mediaName] = {});
    const contextEssence = context[essenceName] || (context[essenceName] = { map: {} });
    let map, sContext, sSelectors;
    extend(map = contextEssence.map, selectors);
    contextEssence.updated = true; 
    if (
      (sContext = $$staticsRoot[mediaName]) && (sSelectors = sContext[essenceName])
    ) extend(map, sSelectors); 
    return __updateEssence(essenceName, selectors, mediaName, excludes || {});
  }
  const updateEssenceWithout = (essenceName, selectors, mediaName) => {
    const context = $$root[mediaName] || ($$root[mediaName] = {});
    const contextEssence = context[essenceName] || (context[essenceName] = { map: {} });
    extend(contextEssence.map, selectors);
    contextEssence.updated = true; 
    return __updateEssence(essenceName, selectors, mediaName, {});
  }
  
  const updateSelector = (map) => {
    let suffix, essenceName, rule, essencesNames, selectors, mediaName;
    for (suffix in map) {
      rule = map[suffix];
      essencesNames = rule.essences;
      selectors = rule.selectors;
      mediaName = rule.mediaName || '';
      for (essenceName in essencesNames) {
        updateEssence(essenceName, selectors, mediaName);
      }
    }
  };

  const __ctx = (src) => {
    src || (src = {});
    src.map || (src.map = {});
    return src;
  };
  const __reflect = () => {

    $$media = mn.media || (mn.media = {});
    $$handlerMap = mn.handlerMap || (mn.handlerMap = {});

    $$data = mn.data || (mn.data = {});
    $$essences = $$data.essences = {};
    $$root = $$data.root = {};

    $$classNamesMap = $$data.classNamesMap || ($$data.classNamesMap = {});
    $$attrsMap = $$data.attrsMap || ($$data.attrsMap = {});

    $$statics = $$data.statics || ($$data.statics = {});
    $$staticsRoot = $$statics.root || ($$statics.root = {});
    $$staticsEssences = $$statics.essences || ($$statics.essences = {});

    $$keyframes = $$data.keyframes = __ctx($$data.keyframes);
    $$css = $$data.css = __ctx($$data.css);

    let k, mediaName, sContext;
    for (mediaName in $$cache) storageRemove(mediaName);
    $$cache = mn.$$cache = {};
    for (mediaName in $$staticsRoot) {
      sContext = $$staticsRoot[mediaName];
      for (k in sContext) updateEssenceWithout(k, sContext[k], mediaName);
    }

    for (k in $$classNamesMap) {
      updateSelector(classNameCompile(k));
    }

    let attrValues, l;
    for (k in $$attrsMap) {
      attrValues = newAttrNamesMap[k];
      for (l = attrValues.length; l--;) {
        updateSelector(attrCompile(attrValues[l], k));
      }
    }

    for (mediaName in $$root) $$mode(mediaName, $$root[mediaName]);
  }
  __reflect();
  const __update = () => {
    const modeName = mn.contextMode;
    const mode = modeName && $$contextMods[modeName];
    if (!mode) {
      console.error('Context mode "', modeName, '" is not available!');
    } else {
      $$mode = mode;
    }
    $$storage = mn.$$storage;
    storageSet = $$storage.set;
    storageRemove = $$storage.remove;
    __reflect();
  };
  const clear = () => {
    $$classNamesMap = $$data.classNamesMap = {};
    $$attrsMap = $$data.attrsMap = {};
    $$newClassNames = [];
    $$newAttrsMap = {};
    __update();
  };

  const onRender = (force) => {
    let k, v, prefix, output, map;
    if ($$keyframes.updated) {
      $$keyframes.updated = false;
      map = $$keyframes.map;
      output = [];
      for (k in map) {
        v = map[k];
        for(prefix in $$keyframesPrefixes)output.push(prefix, v);
      }
      storageSet('keyframes', output.join(''), defaultCCSPriority);
    }
    if ($$css.updated) {
      $$css.updated = false;
      map = $$css.map;
      output = [];
      for (k in map) output.push(map[k].content);
      storageSet('css', output.join(''), defaultCCSPriority);
    }
    if (mn.disabled) return;
    if (force) {
      __update();
    } else {
      let l;
      const newClassNames = $$newClassNames;
      $$newClassNames = [];
      for (l = newClassNames.length; l--;) {
        updateSelector(classNameCompile(newClassNames[l]));
      }

      const newAttrsMap = $$newAttrsMap;
      $$newAttrsMap = {};
      let attrValues;
      for (k in newAttrsMap) {
        attrValues = newAttrsMap[k];
        for (l = attrValues.length; l--;) {
          updateSelector(attrCompile(attrValues[l], k));
        }
      }
      
      for (let mediaName in $$root) {
        $$mode(mediaName, $$root[mediaName]);
      }
    }
    $$storage.render();
  }

  const __render = (force) => {
    onRender(force || $$deferred.force);
    $$deferred.apply = $$deferred.force = false;
    return mn;
  };
  const __deferApply = () => {
    if ($$deferred.apply) __render($$deferred.force);
  };
  const deferCompile = () => {
    if ($$deferred.apply) return mn;
    $$deferred.apply = true;
    immediate(__deferApply);
    return mn;
  };
  const deferRecompile = () => {
    $$deferred.force = true;
    if ($$deferred.apply) return mn;
    $$deferred.apply = true;
    immediate(__deferApply);
    return mn;
  };
  const compile = () => {
    if ($$newClassNames.length || !isEmpty($$newAttrsMap)) {
      __render();
    }
    return mn;
  };
  const recompile = () => {
    __render(true);
    return mn;
  };

  const checkClassName = (className) => {
    if (!className || $$classNamesMap[className]) return mn;
    $$classNamesMap[className] = true;
    $$newClassNames.push(className);
    return mn;
  };
  const checkAttrOne = (attrName, attrValue) => {
    if (!attrValue) return mn;
    const attrValuesMap = $$attrsMap[attrName] || ($$attrsMap[attrName] = {});
    if (attrValuesMap[attrValue]) return;
    attrValuesMap[attrValue] = true;
    ($$newAttrsMap[attrName] || ($$newAttrsMap[attrName] = [])).push(attrValue);
    return mn;
  };
  const checkAttr = (attrName, attrValue) => {
    if (!attrValue) return mn;
    const attrValuesMap = $$attrsMap[attrName] || ($$attrsMap[attrName] = {});
    const newAttrs = $$newAttrsMap[attrName] || ($$newAttrsMap[attrName] = []);
    const vls = attrValue.split(regexpDelimiter);
    for (let v, i = vls.length; i--; ) {
      v = vls[i];
      if (attrValuesMap[v]) continue;
      attrValuesMap[v] = true;
      newAttrs.push(v);
    }
    return mn;
  };
  const checkClassNames = (classNamesValue) => {
    const classNames = classNamesValue.split(regexpDelimiter);
    let className, i = classNames.length;
    for (; i--;) {
      if (!(className = classNames[i]) || $$classNamesMap[className]) continue;
      $$classNamesMap[className] = true;
      $$newClassNames.push(className);
    }
  };
  const ngCheck = (ngClass) => {
    ngClass.replace(reNgClass, __ngCheck);
    return mn;
  };
  const checkNodeByClassName = (node) => {
    const className = node.className;
    className && checkClassNames(className);
    if (!node.getAttribute) return mn;
    const ngClass = node.getAttribute('ng-class');
    ngClass && ngClass.replace(reNgClass, __ngCheck);
    return mn;
  };
  const checkNodeByAttr = (node) => {
    if (!node.getAttribute) return mn;
    let attrValue, attrValuesMap, attrValues, newAttrs, v, i;
    for (let attrName in $$checkAttrs) {
      if (v = node.getAttribute(attrName)) {
        newAttrs = ($$newAttrsMap[attrName] || ($$newAttrsMap[attrName] = []));
        attrValuesMap = $$attrsMap[attrName] || ($$attrsMap[attrName] = {});
        attrValues = v.split(regexpDelimiter);
        for (i = attrValues.length; i--;) {
          if (!(attrValue = attrValues[i]) || attrValuesMap[attrValue]) continue;
          attrValuesMap[attrValue] = true;
          newAttrs.push(attrValue);
        }
      }
    }
    return mn;
  };
  const __ngCheck = (find, a, b, c) => checkClassNames(a || b || c);
  
  const recursiveCheckNodeProvider = (checkNode) => {
    const childrenCheck = (nodes) => {
      for (let node, l = nodes.length || 0; l--;) {
        checkNode(node = nodes[l]);
        recursiveCheck(node.children);
      }
    };
    let recursiveCheck = (nodes) => {
      for (var node, l = nodes.length, children; l--;){
        checkNode(node = nodes[l]);
        if (children = node.children) {
          recursiveCheck = childrenCheck;
          recursiveCheck(children);
          continue;
        }
        if (children = node.childNodes) recursiveCheck(children);
      }
    };
    return (node) => {
      if (!node) return mn;
      recursiveCheck(isLength(node.length) ? node : [ node ]);
      return mn;
    };

  };

  const setKeyframes = (name, body) => {
    let map = $$keyframes.map;
    if (body) {
      let output = [ name, '{' ];
      let css;
      let type = typeof body;
      if (type === 'object') {
        for(let k in body){
          output.push(k, '{', typeof(css = body[k]) === 'object' ? cssPropertiesStringify(css) : css, '}');
        }
      } else {
        output.push(body);
      }
      output.push('}');
      map[name] = output.join('');
    } else {
      delete map[name];
    }
    $$keyframes.updated = true;
    return mn;
  }
  
  const setCSS = (selector, css) => {
    const type = typeof selector;
    const map = $$css.map;
    const __setCSS = (selector, css) => {
      if (css) {
        const instance = map[selector] || (map[selector] = { css: {} });
        css = extend(instance.css, css);
        instance.content = [ selector , '{', cssPropertiesStringify(css), '}' ].join('');
      } else {
        delete map[selector];
      }
    };
    if (type === 'object') {
      const selectorsMap = selector;
      for (selector in selectorsMap) __setCSS(selector, selectorsMap[selector]);
    } else {
      __setCSS(selector, css);
    }
    $$css.updated = true;
    return mn;
  };

  extend(mn, {
    contextMode: 'media-queries', // 'media-queries-essences', //
    disabled: false,
    checkClassName,
    checkClassNames,
    checkAttrOne,
    checkAttr,
    ngCheck,
    
    checkNodeByClassName,
    recursiveCheckNodeByClassName: recursiveCheckNodeProvider(checkNodeByClassName),

    checkNodeByAttr,
    recursiveCheckNodeByAttr: recursiveCheckNodeProvider(checkNodeByAttr),

    css: setCSS,
    assign,

    parseMediaName,

    compile, //перекомиплировать стили для новых классов
    recompile, //полностью перекомиплировать все стили
    setKeyframes,
    set: mn
  });

  return mn;
};

const defaultPriority = -2000;
const defaultCCSPriority = defaultPriority - 2000;

const parseMediaValue = (mediaValue) => {
  if (!mediaValue) return;
  const v = parseInt(mediaValue);
  if (isNaN(v)) {
    throw 'parseMediaValue error';
  }
  return v;
};
const parseMediaPart = (mediaPart) => {
  if (!mediaPart) return;
  const parts = mediaPart.split('-');
  if (parts.length > 1) {
    return {
      min: parseMediaValue(parts[0]),
      max: parseMediaValue(parts[1])
    };
  }
  return {
    max: parseMediaValue(parts[0])
  };
};

const __pi = v => routeParseProvider(v);
const handlerWrap = (essenceHandler, paramsMatchPath) => {
  const parse = isArrayLikeObject(paramsMatchPath) 
    ? execute.provider(__map(paramsMatchPath, __pi))
    : routeParseProvider(paramsMatchPath);
  return p => {
    parse(p.suffix, p);
    return essenceHandler(p);
  };
};

const regexpDelimiter = /\s+/i;
const regexpExts = /[\s,]+/;
const __matchName = routeParseProvider('^([a-z]+):name(.*?):suffix$');
const __matchImportant = routeParseProvider('^(.*?):suffix(-i):ni$');
const __matchValue = routeParseProvider('^(([A-Z][a-z]+):camel|((\\-):negative?[0-9]+):num):value([a-z%]+):unit?(.*?):other?$');
const $$keyframesPrefixes = reduce([
  '-webkit-', '-moz-', '-o-',  '-ms-', '-khtml-', ''
], (dst, k) => {
  dst['@' + k + 'keyframes '] = 1;
  return dst;
}, {});

const __norm = (essence) => {
  essence.style || (essence.style = {});
  let selectors = essence.selectors;
  if (isString(selectors)) {
    essence.selectors = [ selectors ];
  } else {
    if (!(selectors && selectors.length)) essence.selectors = [ '' ];
  }
  let k, childs = essence.childs, child;
  for (k in childs) {
    if (child = childs[k]) __norm(child);
  }
  return essence;
};


const __normalize = (essence) => {
  const src = essence.exts;
  const dst = essence.exts = {};
  const type = typeof src;
  if (type === 'string') {
    __flags(src.split(regexpExts), dst);
  } else {
    if (type === 'object') {
      if (isLength(src.length)) {
        __flags(src, dst);
      } else {
        extend(dst, src);
      }
    }
  }
  let include = essence.include;
  if (isString(include) && (include = include.split(regexpExts)).length) {
    essence.include = include;
  }
  return __norm(essence);
};

const __sortByArgs = [ v => v.priority ];
const $$rootPrefix = 'media.';
const $$mergeDepth = 50;
const regexpBrowserPrefix = /(\:\:\-|\:\:|\:\-)(([a-z]+)\-)?/;
const __getEessenceRules = (output, essenceRules, selectors) => {
  const l = essenceRules.length;
  let i = 0, rule;
  for (; i < l; i++) {
    rule = essenceRules[i];
    output.push(joinArrays([], selectors, rule.selectors).join(',') + rule.css);
  }
};

const __getEessenceContent = (essenceRules, essenceMap) => {
  const l = essenceRules && essenceRules.length || 0;
  if (l < 1) return '';
  const specifics = {}, other = [];
  let matchs, prefix, k;
  for (k in essenceMap) {
    if (matchs = regexpBrowserPrefix.exec(k)) {
      prefix = matchs[3] || 'specific';
      (specifics[prefix] || (specifics[prefix] = [])).push(k);
    } else {
      other.push(k);
    }  
  }
  const output = [];
  for (k in specifics) __getEessenceRules(output, essenceRules, specifics[k]);
  if (other.length) __getEessenceRules(output, essenceRules, other);
  return output.join('');
};

const __essenceSet = (essence, extended) => {
  __normalize(extended);
  extendDepth(essence, extended, $$mergeDepth);
  essence.inited = true;
  return essence;
};

const reNgClass = /"([^"]+)"|'([^']+)'|([A-Za-z0-9_]+)\s*\:/;
