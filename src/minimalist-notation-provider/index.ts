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
  set as __set,
  get as __get,
  toPath,
  reduce
} from 'lodash';
import {aggregate} from '../base/aggregate';
import {executeEach} from '../base/execute-each';
import {cloneDepth} from '../base/clone-depth';
import {extendDepth} from '../base/extend-depth';
import {mergeDepth} from '../base/merge-depth';
import {flagsSimple as __flags} from '../base/flags';
import {immediate} from '../base/immediate';
import {joinArrays} from '../common/join-arrays';
import {routeParseProvider} from '../common/route-parse-provider';
import {cssPropertiesStringifyProvider, cssPropertiesStringify, CssProps} from '../common/css-properties-stringify-provider';
import {selectorsCompileProvider, selectorsCompile, essenceOptionsItems} from './selectors-compile-provider';

export {selectorsCompileProvider};

interface storage {
  set: (name: string, value: string, priority?: number) => any;
  remove: (name: string) => any;
  render: fn;
}

export interface MinimalistNotation extends selectorsCompile {
  (essencePrefix: string, essenceOptions: EssenceOptions): MinimalistNotation;
  (essencePrefix: string, handler: EssenceHandler, matches?: string | string[]): MinimalistNotation;
  (essences: EssenceMapOptions): MinimalistNotation;
  $$storage: storage;
  propertiesStringify: cssPropertiesStringify;
  checkAttrs: FlagsMap;
  data: MinimalistNotationData;
  $$cache: FlagsMap;
  media: {[mediaName: string]: media};
  handlerMap: handlerMap;
  contextMode: string;
  disabled: boolean;
  recursiveCheckNodeByAttr: (nodes: Element[] | Element | Document) => MinimalistNotation;
  recursiveCheckNodeByClassName: (nodes: Element[] | Element | Document) => MinimalistNotation;
  checkClassName: (className: string) => MinimalistNotation;
  checkClassNames: (classNamesValue: string) => MinimalistNotation;
  checkAttrOne: (attrName: string, attrValue: string) => MinimalistNotation;
  checkAttr: (attrName: string, attrValue: string) => MinimalistNotation;
  ngCheck: (ngClass: string) => MinimalistNotation;
  checkNodeByClassName: (node: Element) => MinimalistNotation;
  checkNodeByAttr: (node: Element) => MinimalistNotation;
  css: (selector: string | {[n: string]: CssProps}, css?: CssProps) => MinimalistNotation;
  assign: (essencesNames: string[], selectors: string[]) => MinimalistNotation;
  parseMediaName: (mediaName: string) => media;
  clear: () => MinimalistNotation;
  compile: () => MinimalistNotation; //перекомиплировать стили для новых классов
  recompile: () => MinimalistNotation; //полностью перекомиплировать все стили
  deferCompile: () => MinimalistNotation;
  deferRecompile: () => MinimalistNotation;
  setKeyframes: (name: string, body: keyframes | string) => MinimalistNotation;
  set: MinimalistNotation;
}

interface handlerMap {
  [name: string]: EssenceHandler;
}

interface MinimalistNotationData {
  keyframes: keyframesData;
  classNamesMap: FlagsMap;
  root: root;
  essences: essencesMap;
  statics: statics;
  attrsMap: attrsMap;
  css: cssData;
}

interface statics {
  assigned: assigned;
  essences: {[essenceName: string]: FlagsMap};
}

interface attrsMap {
  [name: string]: FlagsMap;
}

interface EssenceMapOptions {
  [essencePrefix: string]: EssenceOptions | EssenceHandler;
}

interface MediaContext {
  map: essencesMap;
  updated: boolean;
}

interface EssenceContext {
  priority?: number;
  content?: string;
  map?: FlagsMap;
  updated?: boolean;
  rules?: string [];
}

//функция-генератор эссенции
interface EssenceHandler {
  (params: EssenceParams): EssenceOptions
}


interface EssenceParams {
  name: string;
  input: string;
  suffix: string;
  negative: string;
  value: string;
  camel: string;
  num: string;
  other: string;
  i: string;
  ni: string;
  [name: string]: string;
}

//Опции эссенции
interface EssenceOptions {
  inited?: boolean;
  priority?: number;
  style?: CssProps;
  exts?: string[] | FlagsMap;
  include?: string[];
  selectors?: string[];
  childs?: essencesMap,
  media?: {
    [mediaName: string]: EssenceOptions
  };

  rules?: rule[];
  updated?: boolean;
  content?: string;
}

interface essencesMap {
  [essenceName: string]: EssenceOptions;
}

interface root {
  [mediaName: string]: MediaContext
}

interface keyframesData {
  map: {
    [name: string]: string;
  };
  updated: boolean;
}
interface keyframes {
  [name: string]: CssProps | string;
}

interface cssData {
  map: {
    [name: string]: cssDataItem;
  };
  updated: boolean;
}

interface cssDataItem {
  content: string;
  css: CssProps;
}

interface media {
  priority?: number;
  query?: string;
}


interface assigned {
  [mediaName: string]: {[essenceName: string]: FlagsMap}
}

interface rule {
  selectors: string[];
  css: string;
  priority: number;
}

export const minimalistNotationProvider = ($$storage: storage) => {

  const mn: MinimalistNotation = <MinimalistNotation> ((essencePath: any, extendedEssence: any, paramsMatchPath?: string | string[]) => {
    
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
  });
  const __setMap = (map: EssenceMapOptions) => {
    let essencePath, extendedEssence, type;
    for (essencePath in map) {
      extendedEssence = map[essencePath];
      type = typeof extendedEssence;
      if (type === 'function') {
        $$handlerMap[essencePath] = <EssenceHandler> extendedEssence;
        continue;
      }
      if (type === 'object') {
        __setEssense(essencePath, <EssenceOptions> extendedEssence);
      } else {
        console.warn('MN: extendedEssence value must be an object on', extendedEssence, 'where', essencePath);
      }
    }
  };
  const __setEssense = (_essencePath: string, extendedEssence: EssenceOptions) => {
    
    const essencePath = toPath(_essencePath);
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

  let $$essences: {[essenceName: string]: EssenceOptions};
  let $$root: root;
  let $$classNamesMap: FlagsMap;
  let $$attrsMap: {[name: string]: FlagsMap};
  let $$statics: statics;
  let $$assigned: assigned;
  let $$staticsEssences: {[essenceName: string]: EssenceOptions};
  let $$keyframes: keyframesData;
  let $$css: cssData;
  let $$data = mn.data = <MinimalistNotationData> {};
  let $$cache = mn.$$cache = <FlagsMap> {};
  let $$media = mn.media = <{[name: string]: media}> {};
  let $$handlerMap = mn.handlerMap = <handlerMap> {};
  let $$checkAttrs = mn.checkAttrs = {};
  let cssPropertiesStringify = mn.propertiesStringify = cssPropertiesStringifyProvider();

  let $$deferred = <{force: boolean, apply: boolean}> {};
  let $$newClassNames: string[] = [];
  let $$newAttrsMap = {};  
  
  const parseMediaName = (mediaName: string) => {
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
    'media-queries': (mediaName: string, context: MediaContext) => {
      var isContinue = true;
      var essence: EssenceOptions, essenceName, contextEssence;
      for (essenceName in context) {
        if (!(essence = $$essences[essenceName])) continue;
        contextEssence = context[essenceName];
        if (contextEssence.updated) {
          isContinue = false;
          if (essence.updated) essence.rules = getRules(essence);
          contextEssence.priority = essence.priority || 0;
          contextEssence.updated = essence.updated = false;
          contextEssence.content = __getEessenceContent(<any> essence.rules, contextEssence.map);
        }
      }

      if (isContinue) return;
      const media = parseMediaName(mediaName);
      const mediaQuery = media.query;
      const mediaPriority = media.priority;
      const essences = <EssenceContext[]> sortBy(__values(context), __sortByArgs);
      const l = essences.length;
      let output = new Array(l);
      for (let i = 0; i < l; i++) output[i] = essences[i].content;
      if (mediaQuery) output = ['@media ', mediaQuery, '{', output.join(''), '}'];
      setStyle($$rootPrefix + mediaName, output.join(''), mediaPriority);
    },
    'media-queries-essences': (mediaName: string, context: MediaContext) => {
      let  essence, essenceName, contextEssence, content, priority;
      const media = parseMediaName(mediaName);
      let mediaQuery = media.query;
      const mediaPriority = (media.priority || 0) * 1000;
      if (mediaQuery) mediaQuery = '@media ' + mediaQuery + '{';
      let contextPrefix = $$rootPrefix + mediaName + '.';
      for (essenceName in context) {
        if (!(essence = $$essences[essenceName])) continue;
        contextEssence = context[essenceName];
        if (essence.updated || contextEssence.updated) {
          if (essence.updated) essence.rules = getRules(essence);
          priority = contextEssence.priority = essence.priority || 0;
          contextEssence.updated = essence.updated = false;
          content = contextEssence.content =  __getEessenceContent(<any> essence.rules, contextEssence.map);
          if (mediaQuery) content = [ mediaQuery, content, '}' ].join('');
          setStyle(contextPrefix + essenceName, content, mediaPriority + priority);
        }
      }
    }
  };
  let $$mode = $$contextMods['media-queries'];


  const setStyle = (mediaName: string, content: string, priority?: number) => {
    $$cache[mediaName] = true;
    storageSet(mediaName, content, priority);
  };

  const assign = (_essencesNames: string[], _selectors: string[]) => {
    const selectors = __flags(_selectors);
    const essencesNames = __flags(_essencesNames);
    var essenceName;
    const mediaName = '';
    const sContext = $$assigned[mediaName] || ($$assigned[mediaName] = {});
    for (essenceName in essencesNames) {
      extend(sContext[essenceName] || (sContext[essenceName] = {}), selectors);
      updateEssenceWithout(essenceName, selectors, mediaName);
    }
    return mn;
  };

  /*
  const mnExtend = (_essencesNames: string[], _xtsEssencesNames?: string[]) => {
    const essencesNames = __flags(_essencesNames);
    const xtsEssencesNames = _xtsEssencesNames ? __flags(_xtsEssencesNames) : null;
    let staticsEssence: EssenceOptions;
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
  */
 
  const __getRules = (
    rules: rule[], selectors: string[],
    style: CssProps, 
    priority: number, childs: essencesMap
  ): rule[] => {
    const css = cssPropertiesStringify(style);
    if (css) rules.push({ selectors, css: '{' + css + '}', priority });
    let k, child;
    for (k in childs) {
      if(child = childs[k])__getRules(
        rules, joinArrays([], selectors, <any> child.selectors), 
        <any> child.style, child.priority || 0, <any> child.childs
      );
    }
    return rules;
  };

  
  const getRules = (e: EssenceOptions) => {

    /* include impl start */
    const include = e.include;
    const length = include && include.length || 0;
    if (length) {
      let mixinEssenseName: string, mergingMixins = new Array(length + 1);
      mergingMixins[length] = e;
      for(let i = length; i--;){
        mergingMixins[i] = updateEssence(mixinEssenseName = (<any> include)[i], {}, '');    
      }
      e = mergeDepth(mergingMixins, {}, $$mergeDepth);
    }
    /* include impl end */

    return sortBy(__getRules([], e.selectors || [], <any> e.style, 0, <any> e.childs), item => item.priority);
  };
  

  const __extends = (exts: FlagsMap, selectors: FlagsMap, mediaName: string, excludes?: FlagsMap) => {
    for (let k in exts) updateEssence(k, selectors, mediaName, excludes);
  };


  const __updateEssence = (essenceName: string, selectors: FlagsMap, mediaName: string, excludes: FlagsMap) => {
    if (excludes[essenceName]) return;
    excludes[essenceName] = true;
    let essence = $$essences[essenceName];  
    const digest = () => {
      $$essences[essenceName] = essence;
      __extends(<FlagsMap> essence.exts, selectors, mediaName, excludes);
      const include = essence.include;
      if (include && include.length) __extends(__flags(include, {}), {}, mediaName, excludes);
      essence.updated = true;
    };     
    if (essence) {
      if (essence.inited) {
        __extends(<FlagsMap> essence.exts, selectors, mediaName, excludes);
        return essence;
      }
    } else {
      essence = cloneDepth($$staticsEssences[essenceName] || {}, $$mergeDepth);
      if (essence.inited) {
        digest();
        return essence;
      }
    }
    const params = <EssenceParams> { input: essenceName, name: essenceName, suffix: '' };
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


  const updateEssence = (essenceName: string, selectors: FlagsMap, mediaName: string, excludes?: FlagsMap) => {
    const context = $$root[mediaName] || ($$root[mediaName] = <MediaContext> {});
    const contextEssence = context[essenceName] || (context[essenceName] = { map: {} });
    let map, sContext, sSelectors;
    extend(map = contextEssence.map, selectors);
    contextEssence.updated = true; 
    if (
      (sContext = $$assigned[mediaName]) && (sSelectors = sContext[essenceName])
    ) extend(map, sSelectors); 
    return __updateEssence(essenceName, selectors, mediaName, excludes || {});
  }
  const updateEssenceWithout = (essenceName: string, selectors: FlagsMap, mediaName: string) => {
    const context = $$root[mediaName] || ($$root[mediaName] = <MediaContext> {});
    const contextEssence = context[essenceName] || (context[essenceName] = { map: {} });
    extend(contextEssence.map, selectors);
    contextEssence.updated = true; 
    return __updateEssence(essenceName, selectors, mediaName, {});
  }
  
  const updateSelector = (map: essenceOptionsItems) => {
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

  const __ctx = <T> (src: any): T => {
    src || (src = {});
    src.map || (src.map = {});
    return <T> src;
  };
  const __reflect = () => {

    $$media = mn.media || (mn.media = {});
    $$handlerMap = mn.handlerMap || (mn.handlerMap = {});

    $$data = mn.data || (mn.data = <MinimalistNotationData> {});
    $$essences = $$data.essences = {};
    $$root = $$data.root = {};

    $$classNamesMap = $$data.classNamesMap || ($$data.classNamesMap = {});
    $$attrsMap = $$data.attrsMap || ($$data.attrsMap = <attrsMap> {});

    $$statics = $$data.statics || ($$data.statics = <statics> {});
    $$assigned = $$statics.assigned || ($$statics.assigned = <assigned> {});
    $$staticsEssences = $$statics.essences || ($$statics.essences = <{[n: string]: FlagsMap}> {});

    $$keyframes = $$data.keyframes = __ctx($$data.keyframes);
    $$css = $$data.css = <cssData> __ctx($$data.css);

    let k, mediaName, sContext;
    for (mediaName in $$cache) storageRemove(mediaName);
    $$cache = mn.$$cache = {};
    for (mediaName in $$assigned) {
      sContext = $$assigned[mediaName];
      for (k in sContext) updateEssenceWithout(k, sContext[k], mediaName);
    }

    for (k in $$classNamesMap) {
      updateSelector(classNameCompile(k));
    }

    let attrValues, l;
    for (k in $$attrsMap) {
      attrValues = $$newAttrsMap[k];
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

  const onRender = (force: boolean) => {
    let k, v, prefix, output, map;
    if ($$keyframes.updated) {
      $$keyframes.updated = false;
      map = $$keyframes.map;
      output = [];
      for (k in map) {
        v = map[k];
        for (prefix in $$keyframesPrefixes) output.push(prefix, v);
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

  const __render = (force?: boolean) => {
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

  const checkClassName = (className: string) => {
    if (!className || $$classNamesMap[className]) return mn;
    $$classNamesMap[className] = true;
    $$newClassNames.push(className);
    return mn;
  };
  const checkAttrOne = (attrName: string, attrValue: string) => {
    if (!attrValue) return mn;
    const attrValuesMap = $$attrsMap[attrName] || ($$attrsMap[attrName] = {});
    if (attrValuesMap[attrValue]) return mn;
    attrValuesMap[attrValue] = true;
    ($$newAttrsMap[attrName] || ($$newAttrsMap[attrName] = [])).push(attrValue);
    return mn;
  };
  const checkAttr = (attrName: string, attrValue: string) => {
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
  const checkClassNames = (classNamesValue: string) => {
    const classNames = classNamesValue.split(regexpDelimiter);
    let className, i = classNames.length;
    for (; i--;) {
      if (!(className = classNames[i]) || $$classNamesMap[className]) continue;
      $$classNamesMap[className] = true;
      $$newClassNames.push(className);
    }
    return mn;
  };
  const ngCheck = (ngClass: string) => {
    ngClass.replace(reNgClass, __ngCheck);
    return mn;
  };
  const checkNodeByClassName = (node: Element) => {
    const className = node.className;
    className && checkClassNames(className);
    if (!node.getAttribute) return mn;
    const ngClass = node.getAttribute('ng-class');
    ngClass && ngClass.replace(reNgClass, __ngCheck);
    return mn;
  };
  const checkNodeByAttr = (node: Element) => {
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
  const __ngCheck = (find: string, a: string, b: string, c: string) => checkClassNames(a || b || c) && '';
  
  const recursiveCheckNodeProvider = (checkNode: fn) => {
    const childrenCheck = (nodes: Element[]) => {
      for (let node: Element, l = nodes.length || 0; l--;) {
        checkNode(node = nodes[l]);
        recursiveCheck(<any> node.children);
      }
    };
    let recursiveCheck = (nodes: Element[]) => {
      for (var node, l = nodes.length, children: any; l--;){
        checkNode(node = nodes[l]);
        if (children = node.children) {
          recursiveCheck = childrenCheck;
          recursiveCheck(children);
          continue;
        }
        if (children = node.childNodes) recursiveCheck(children);
      }
    };
    return (node: Element | Element[]) => {
      if (!node) return mn;
      recursiveCheck(isLength((<any> node).length) ? <Element[]> node : [ <Element> node ]);
      return mn;
    };

  };

  const setKeyframes = (name: string, body: keyframes | string) => {
    let map = $$keyframes.map;
    if (body) {
      let output = [ name, '{' ];
      let css;
      let type = typeof body;
      if (type === 'object') {
        for(let k in <keyframes> body){
          output.push(k, '{', typeof(css = body[k]) === 'object' ? cssPropertiesStringify(css) : css, '}');
        }
      } else {
        output.push(<string> body);
      }
      output.push('}');
      map[name] = output.join('');
    } else {
      delete map[name];
    }
    $$keyframes.updated = true;
    return mn;
  }
  
  const setCSS = (selector: string | {[n: string]: CssProps}, css?: CssProps) => {
    const map = $$css.map;
    const __setCSS = (selector: string, css?: CssProps) => {
      if (css) {
        const instance = map[selector] || (map[selector] = <cssDataItem> { css: {} });
        css = extend(instance.css, css);
        instance.content = [ selector , '{', cssPropertiesStringify(css), '}' ].join('');
      } else {
        delete map[selector];
      }
    };
    if (typeof selector === 'object') {
      const selectorsMap = <{[n: string]: CssProps}> selector;
      for (selector in selectorsMap) __setCSS(selector, selectorsMap[selector]);
    } else {
      __setCSS(<string> selector, css);
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

    clear,
    compile, //перекомиплировать стили для новых классов
    recompile, //полностью перекомиплировать все стили
    deferCompile,
    deferRecompile,
    setKeyframes,
    set: mn
  });

  return mn;
};

const defaultPriority = -2000;
const defaultCCSPriority = defaultPriority - 2000;

const parseMediaValue = (mediaValue: string) => {
  if (!mediaValue) return;
  const v = parseInt(mediaValue);
  if (isNaN(v)) {
    throw 'parseMediaValue error';
  }
  return v;
};
const parseMediaPart = (mediaPart: string) => {
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

const __pi = (v: string) => routeParseProvider(v);
const handlerWrap = (essenceHandler: EssenceHandler, paramsMatchPath?: string | string[]) => {
  const parse = isArrayLikeObject(paramsMatchPath) 
    ? aggregate(__map(paramsMatchPath, __pi), executeEach)
    : routeParseProvider(<any> paramsMatchPath);
  return (p: EssenceParams) => {
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

const __norm = (essence: EssenceOptions) => {
  essence.style || (essence.style = {});
  let selectors = essence.selectors;
  if (isString(selectors)) {
    essence.selectors = [ selectors ];
  } else {
    if (!(selectors && selectors.length)) essence.selectors = [ '' ];
  }
  let k, childs = <essencesMap> essence.childs, child;
  for (k in childs) {
    if (child = childs[k]) __norm(child);
  }
  return essence;
};


const __normalize = (essence: EssenceOptions) => {
  const src = <any> essence.exts;
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

const __sortByArgs = [ (v: EssenceOptions) => v.priority ];
const $$rootPrefix = 'media.';
const $$mergeDepth = 50;
const regexpBrowserPrefix = /(\:\:\-|\:\:|\:\-)(([a-z]+)\-)?/;
const __getEessenceRules = (output: string[], essenceRules: rule[], selectors: string[]) => {
  const l = essenceRules.length;
  let i = 0, rule;
  for (; i < l; i++) {
    rule = essenceRules[i];
    output.push(joinArrays([], selectors, rule.selectors).join(',') + rule.css);
  }
};

const __getEessenceContent = (essenceRules: rule[], essencesMap: essencesMap) => {
  const l = essenceRules && essenceRules.length || 0;
  if (l < 1) return '';
  const specifics = {}, other = [];
  let matchs, prefix, k;
  for (k in essencesMap) {
    if (matchs = regexpBrowserPrefix.exec(k)) {
      prefix = matchs[3] || 'specific';
      (specifics[prefix] || (specifics[prefix] = [])).push(k);
    } else {
      other.push(k);
    }  
  }
  const output: string[] = [];
  for (k in specifics) __getEessenceRules(output, essenceRules, specifics[k]);
  if (other.length) __getEessenceRules(output, essenceRules, other);
  return output.join('');
};

const __essenceSet = (essence: EssenceOptions, extended: EssenceOptions) => {
  __normalize(extended);
  extendDepth(essence, extended, $$mergeDepth);
  essence.inited = true;
  return essence;
};

const reNgClass = /"([^"]+)"|'([^']+)'|([A-Za-z0-9_]+)\s*\:/;
