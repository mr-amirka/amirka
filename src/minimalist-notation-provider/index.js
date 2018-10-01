/**
 * @overview minimalist-notation
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */
const Emitter = require('../utils/emitter');
const utils = require('../utils');
const selectorsCompileProvider = require('./selectors-compile-provider');

const {
  extend,
  isString,
  isObject,
  isArray,
  set,
  get,
  aggregate,
  eachApply,
  eachTry,
  cloneDepth,
  extendDepth,
  mergeDepth,
  flags,
  joinArrays,
  routeParseProvider,
  forIn,
  forEach,
  reduce,
  cssPropertiesStringifyProvider,
  cssPropertiesParse,
  push,
  pushArray,
  splitProvider,
  withDefer
} = utils;

utils.color = require('./color');

const
  OBJECT = 'object',
  FUNCTION = 'function',
  STRING = 'string';
const
  baseSet = set.core,
  baseGet = get.core,
  flagsSimple = flags.simple;

const __values = Object.values;
const __sort = (a, b) => a.priority - b.priority;
const __iteratee = item => item.updated = true;

module.exports = () => {

  const styleRender = () => {
    emit(__values($$stylesMap).sort(__sort));
    forIn($$stylesMap, __iteratee);
  };

  const mn = (essencePath, extendedEssence, paramsMatchPath) => {

    let type = typeof essencePath;

    if (type === OBJECT) {
      baseSetMap(essencePath);
      return mn;
    }

    if (!essencePath || type !== 'string') {
      console.warn('MN: essencePath value must be an string', essencePath);
      return mn;
    }

    (type = typeof extendedEssence) === FUNCTION
      ? (
        $$handlerMap[essencePath] = paramsMatchPath
          ? handlerWrap(extendedEssence, paramsMatchPath)
          : extendedEssence
      )
      : (
        type === OBJECT
          ? baseSetEssense(essencePath, extendedEssence)
          : (
            type === STRING
              ? baseSetEssense(essencePath, { exts: extendedEssence })
              : console.warn('MN: extendedEssence value must be an object on', extendedEssence, 'where', essencePath)
            )
      );
    return mn;
  };
  mn.set = mn;

  const baseSetMap = (map) => {
    let essencePath, extendedEssence, type;
    for (essencePath in map) {
      type = typeof(extendedEssence = map[essencePath]);
      if (type === FUNCTION) {
        $$handlerMap[essencePath] = extendedEssence;
        continue;
      }
      type === OBJECT
        ? baseSetEssense(essencePath, extendedEssence)
        : console.warn('MN: extendedEssence value must be an object on', extendedEssence, 'where', essencePath);
    }
  };
  const baseSetEssense = (_essencePath, extendedEssence) => {
    const essencePath = _essencePath.split('.');
    const essenceName = essencePath[0];
    const path = [ essenceName ];
    $$staticsEssences[essenceName] || ($$staticsEssences[essenceName] = __normalize({
      inited: true
    }));
    for (let i = 1, l = essencePath.length; i < l; i++) path.push('childs', essencePath[i]);
    baseSet($$staticsEssences, path, mergeDepth([
      baseGet($$staticsEssences, path),
      __normalize(extendedEssence)
    ], {}, $$mergeDepth));
  };

  selectorsCompileProvider(mn);
  const parseComboNameProvider = mn.parseComboNameProvider;
  const __parseComboName = mn.parseComboName;

  const updateAttrByMap = mn.updateAttrByMap = (comboNamesMap, attrName) => {
    const parseComboName = parseComboNameProvider(attrName);
    for (comboName in comboNamesMap) updateSelector(parseComboName(comboName));
    return mn;
  };
  const updateAttrByValues = mn.updateAttrByValues = (comboNames, attrName) => {
    const parseComboName = parseComboNameProvider(attrName);
    forEach(comboNames, (comboName) => {
      updateSelector(parseComboName(comboName))
    });
    return mn;
  };
  mn.recompileFrom = (attrsMap) => {
    __clear();
    keyframesRender();
    setStyle('css', reduce($$css.map, __cssReducer, []).join(''), defaultCCSPriority);
    forIn(attrsMap, updateAttrByMap);
    forIn($$root, __mode);
    styleRender();
    return mn;
  };
  const __compileProvider = (attrName) => {
    const instance = (v) => {
      v && forEach(splitSpace(v), checkOne);
    };
    (instance.clear = () => {
      cache = instance.cache = {};
      newValues = [];
    })();
    instance._compile = () => {
      const _values = newValues;
      newValues = [];
      updateAttrByValues(_values, attrName);
    };
    instance._recompile = () => {
      updateAttrByMap(cache, attrName);
    };
    const checkOne = instance.checkOne = (v) => {
      if (!v || cache[v]) return;
      cache[v] = true;
      push(newValues, v);
    };
    const checkNode = instance.checkNode = (node) => {
      node.getAttribute && instance(node.getAttribute(attrName));
    };
    const recursiveCheckNode = (node) => {
      checkNode(node);
      forEach(node.children, recursiveCheckNode);
    };
    let __recursiveCheckNode = (node) => {
      checkNode(node);
      (children = node.children)
        ? forEach(children, __recursiveCheckNode = recursiveCheckNode)
        : forEach(node.childNodes, __recursiveCheckNode);
    };
    instance.recursiveCheck = (node) => {
      __recursiveCheckNode(node);
      return mn;
    };
    return instance;
  };
  mn.getCompiler = (attrName) => $$compilers[attrName] || ($$compilers[attrName] = __compileProvider(attrName));

  const setStyle = (name, content, priority) => {
    $$stylesMap[name] = {
      name,
      priority: priority || 0,
      content: content || ''
    };
    $$updated = true;
    return mn;
  };
  mn.setStyle = (name, content, priority) => setStyle(name, content, priority || defaultOtherCCSPriority)
  let $$updated;
  let $$essences;
  let $$root;
  let $$statics;
  let $$assigned;
  let $$staticsEssences;
  let $$keyframes;
  let $$css;
  const $$data = mn.data = {};
  let $$stylesMap = $$data.stylesMap = {};
  let $$media = mn.media = {};
  let $$handlerMap = mn.handlerMap = {};
  let cssPropertiesStringify = mn.propertiesStringify = cssPropertiesStringifyProvider();
  let $$force;

  const $$compilers = $$data.compilers = {};

  const emit = (mn.emitter = new Emitter([])).emit;

  const parseMediaName = mn.parseMediaName = (mediaName) => {
    if (!mediaName || mediaName === 'all') return {
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

  const __mode = (context, mediaName) => {
    let isContinue = true;
    let essenceName, contextEssence, essence, selectors;
    for (essenceName in context) {
      if ((contextEssence = context[essenceName]) && contextEssence.updated) {
        isContinue = false;
        essence = $$essences[essenceName];
        contextEssence.priority = essence.priority || 0;
        contextEssence.content = baseGetEessenceContent(essence.rules, contextEssence.map);
        delete contextEssence.updated;
      }
    }
    if (isContinue) return;
    const media = parseMediaName(mediaName);
    const mediaQuery = media.query;
    const mediaPriority = media.priority;
    const essences = __values(context).sort(__priotitySort);
    const l = essences.length;
    let output = new Array(l);
    for (let i = 0; i < l; i++) output[i] = essences[i].content;
    if (mediaQuery) output = ['@media ', mediaQuery, '{', output.join(''), '}'];
    setStyle('media.' + mediaName, output.join(''), mediaPriority);
  };

  const __assignCore = (comboNames, selectors, defaultMediaName, excludes) => {
    defaultMediaName || (defaultMediaName = 'all');
    const assignIteratee = (optionsItem) => {
      const selectors = optionsItem.selectors;
      const essencesNames = optionsItem.essences;
      const mediaName = optionsItem.mediaName || defaultMediaName;
      const actx = $$assigned[mediaName] || ($$assigned[mediaName] = {});
      for (let essenceName in essencesNames) {
        extend(actx[essenceName] || (actx[essenceName] = {}), selectors);
        updateEssence(essenceName, selectors, mediaName, excludes);
      }
    };
    forEach(comboNames, comboName => {
      for (let selector in selectors) forEach(__parseComboName(comboName, selector), assignIteratee);
    });
  };

  mn.assign = (selectors, comboNames, defaultMediaName) => {
    const __iteratee = (comboNames, s) => {
      __assignCore(comboNames, flagsSimple(splitSelector(s)), defaultMediaName);
    };
    isArray(selectors)
      ? (comboNames = normalizecomboNames(comboNames)) && forEach(selectors, s => __iteratee(comboNames, s))
      : (isObject(selectors) ? forIn(selectors, (_comboNames, s) => {
          __iteratee(normalizecomboNames(_comboNames), s);
        }) : __iteratee(normalizecomboNames(comboNames), selectors));
    return mn;
  };

  const baseGetRules = (rules, selectors, style, priority, childs) => {
    const css = cssPropertiesStringify(style);
    if (css) push(rules, { selectors, css: '{' + css + '}', priority });
    let k, child;
    for (k in childs) {
      if (child = childs[k]) baseGetRules(
        rules, joinArrays([], selectors, child.selectors),
        child.style, child.priority || 0, child.childs
      );
    }
    return rules;
  };


  const getRules = (e) => {

    /* include impl start */
    const include = e.include;
    const length = include && include.length || 0;
    if (length) {
      let mergingMixins = new Array(length + 1);
      mergingMixins[length] = e;
      for (let i = length; i--;) mergingMixins[i] = updateEssence(include[i], {}, 'all');
      e = mergeDepth(mergingMixins, {}, $$mergeDepth);
    }
    /* include impl end */

    return baseGetRules([], e.selectors || [], e.style, 0, e.childs).sort(__priotitySort);
  };

  const initEssence = (essenceName, essence) => {
    if (extendDepth(essence, $$staticsEssences[essenceName], $$mergeDepth).inited) {
      essence.rules = getRules(essence);
      return;
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

    const handler = $$handlerMap[params.name];
    const _essence = handler && handler(params);
    if (_essence) {
      extendDepth(essence, __normalize(_essence), $$mergeDepth);
      essence.inited = true;
      essence.rules = getRules(essence);
      forIn(essence.media, (_mediaEssence, _mediaName) => {
        const mediaEssenceName = essenceName + '@' + _mediaName;
        const mediaEssence = extendDepth($$essences[mediaEssenceName] = {}, $$staticsEssences[mediaEssenceName], $$mergeDepth);
        if (!mediaEssence.inited) {
          extendDepth(mediaEssence, __normalize(_mediaEssence), $$mergeDepth);
          mediaEssence.inited = true;
        }
        mediaEssence.rules = getRules(mediaEssence);
      });
    }
  };
  const updateEssence = (essenceName, selectors, mediaName, excludes, essence) => {
    excludes || (excludes = {});
    if (excludes[essenceName]) return;
    excludes[essenceName] = true;
    const context = $$root[mediaName] || ($$root[mediaName] = {});
    const contextEssence = context[essenceName] || (context[essenceName] = { map: {} });
    extend(contextEssence.map, selectors);
    contextEssence.updated = true;
    essence || (essence = $$essences[essenceName] || ($$essences[essenceName] = {}));
    essence.inited || initEssence(essenceName, essence);
    const exts = essence.exts;
    exts && __assignCore(exts, selectors, mediaName, excludes);
    forIn(essence.media, (mediaEssence, _mediaName) => {
      updateEssence(essenceName + '@' + _mediaName, selectors, _mediaName, excludes, mediaEssence);
    });
    return essence;
  };

  const updateSelectorIteratee = (optionsItem) => {
    const essencesNames = optionsItem.essences;
    const selectors = optionsItem.selectors;
    const mediaName = optionsItem.mediaName;
    for (let essenceName in essencesNames) updateEssence(essenceName, selectors, mediaName);
  };
  const updateSelector = (optionsItems) => {
    forEach(optionsItems, updateSelectorIteratee);
  };

  const __ctx = (src) => {
    src || (src = {});
    src.map || (src.map = {});
    return src;
  };
  const __assignItemCompile = (actx, mediaName) => {
    forIn(actx, (selectors, essenceName) => {
      updateEssence(essenceName, selectors, mediaName);
    });
  };
  const __clear = () => {
    $$media = mn.media || (mn.media = {});
    $$handlerMap = mn.handlerMap || (mn.handlerMap = {});
    $$essences = $$data.essences = {};
    $$root = $$data.root = {};
    $$statics = $$data.statics || ($$data.statics = {});
    $$staticsEssences = $$statics.essences || ($$statics.essences = {});
    $$keyframes = $$data.keyframes = __ctx($$data.keyframes);
    $$css = $$data.css = __ctx($$data.css);
    $$stylesMap = $$data.stylesMap = {};
    forIn($$assigned = $$statics.assigned || ($$statics.assigned = {}), __assignItemCompile);
  };
  __clear();
  mn.clear = () => {
    forIn($$compilers, __compilerClear);
    __clear();
    return mn;
  };

  const keyframesToken = 'keyframes';
  const keyframesRender = () => {
    $$keyframes.updated = false;
    const keyframesPrefix = keyframesToken + ' ';
    const prefixes = cssPropertiesStringify.prefixes;
    setStyle(keyframesToken, reduce($$keyframes.map, (output, v, k) => {
      for (let prefix in prefixes) push(output, '@' + prefix + keyframesPrefix + k + v);
      push(output, '@' + keyframesPrefix + k + v);
    }, []).join(''), defaultCCSPriority);
  };
  const __render = mn.compile = () => {
    $$keyframes.updated && keyframesRender();
    if ($$css.updated) {
      $$css.updated = false;
      setStyle('css', reduce($$css.map, __cssReducer, []).join(''), defaultCCSPriority);
    }
    if ($$force) {
      __clear();
      forIn($$compilers, __compilerRecompile);
    } else {
      forIn($$compilers, __compilerCompile);
    }
    forIn($$root, __mode);
    $$updated && styleRender();
    $$updated = $$force = false;
    return mn;
  };
  mn.recompile = () => {
    $$force = true;
    return __render();
  };
  const deferCompile = mn.deferCompile = withDefer(__render, mn);
  mn.deferRecompile = () => {
    $$force = true;;
    return deferCompile();
  };

  mn.setKeyframes = (name, body) => {
    let map = $$keyframes.map;
    if (body) {
      const output = [ '{' ];
      isObject(body)
        ? forIn(body, (css, k) => push(output, k + '{' + (isObject(css) ? cssPropertiesStringify(css) : css) + '}'))
        : push(output, body);
      push(output, '}');
      map[name] = output.join('');
    } else {
      delete map[name];
    }
    $$keyframes.updated = true;
    return mn;
  };

  mn.css = (selector, css) => {
    const map = $$css.map;
    const baseSetCSS = (css, s) => {
      if (css) {
        const instance = map[s] || (map[s] = { css: {} });
        instance.content = [ s , '{', cssPropertiesStringify(
          isObject(css)
            ? extend(instance.css, css)
            : cssPropertiesParse(css, instance.css)
        ), '}' ].join('');
      } else {
        delete map[s];
      }
    };
    isObject(selector) ? forIn(selector, baseSetCSS) : baseSetCSS(css, selector);
    $$css.updated = true;
    return mn;
  };
  mn.setPresets = (presets) => {
    eachTry(presets, [ mn ]);
    return mn;
  };
  mn.utils = utils;
  return mn;
};

const __cssReducer = (output, v) => {
  push(output, v.content);
};

const defaultPriority = -2000;
const defaultCCSPriority = defaultPriority - 2000;
const defaultOtherCCSPriority = defaultPriority - 4000;

const parseMediaValue = (mediaValue) => {
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

const __pi = (v) => routeParseProvider(v);
const handlerWrap = (essenceHandler, paramsMatchPath) => {
  const parse = paramsMatchPath instanceof Array
    ? aggregate(paramsMatchPath.map(__pi), eachApply)
    : routeParseProvider(paramsMatchPath);
  return (p) => {
    parse(p.suffix, p);
    return essenceHandler(p);
  };
};

const splitSpace = splitProvider(/\s+/);
const splitExts = splitProvider(/[\s,]+/);
const splitSelector = splitProvider(/\s*,+\s*/);
const __matchName = routeParseProvider('^([a-z]+):name(.*?):suffix$');
const __matchImportant = routeParseProvider('^(.*?):suffix(-i):ni$');
const __matchValue = routeParseProvider('^(([A-Z][a-z]+):camel|((\\-):negative?[0-9]+):num):value([a-z%]+):unit?(.*?):other?$');

const __norm = (essence) => {
  essence.style || (essence.style = {});
  let selectors = essence.selectors;
  isString(selectors)
    ? (essence.selectors = [ selectors ])
    : ((selectors && selectors.length) || (essence.selectors = [ '' ]));
  forIn(essence.childs, child => child && __norm(child));
  return essence;
};

const __compilerClear = (compiler) => {
  compiler.clear();
};
const __compilerRecompile = (compiler) => {
  compiler._recompile();
};
const __compilerCompile = (compiler) => {
  compiler._compile();
};

const __normalize = (essence) => {
  const exts = essence.exts;
  exts && (essence.exts = normalizecomboNames(exts));
  const include = essence.include;
  include && (essence.include = normalizecomboNames(include));
  return __norm(essence);
};
const normalizecomboNames = (_comboNames) =>
  isArray(_comboNames) ? reduce(
    _comboNames,
    (comboNames, comboName) => pushArray(comboNames, splitExts(comboName)),
    []
  ) : splitExts(_comboNames);

const __priotitySort = (a, b) => a.priority - b.priority;
const $$mergeDepth = 50;
const regexpBrowserPrefix = /(\:\:\-|\:\:|\:\-)(([a-z]+)\-)?/;
const baseGetEessenceRules = (output, essenceRules, selectors) => {
  forEach(essenceRules, (rule) => {
    push(output, joinArrays([], selectors, rule.selectors).join(',') + rule.css)
  });
};

const baseGetEessenceContent = (essenceRules, essencesMap) => {
  const l = essenceRules && essenceRules.length || 0;
  if (l < 1) return '';
  const specifics = {}, other = [];
  let matchs, prefix, k;
  for (k in essencesMap) push(
    (matchs = regexpBrowserPrefix.exec(k))
      ? (specifics[prefix = matchs[3] || 'specific'] || (specifics[prefix] = []))
      : other, k);
  const output = [];
  for (k in specifics) baseGetEessenceRules(output, essenceRules, specifics[k]);
  other.length && baseGetEessenceRules(output, essenceRules, other);
  return output.join('');
};
//const reNgClass = /"([^"]+)"|'([^']+)'|([A-Za-z0-9_]+)\s*\:/;
