/**
 * @overview minimalist-notation/selectors
 * Генеририрует селекторы в Minimalist Notation
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 * // изменил порядок деления контекста на родительскиеи дочериние,
 * чтобы было удобнее в нотации юзать такие штуки:
 * //(cF<.parent1|f30<.parent2)>.child1
 */

const {
  extend,
  unslash,
  escapedSplitProvider,
  joinMaps,
  escapedBreakupProvider,
  variance,
  reduce,
  push,
  escapeQuote,
  intval
} = require('../utils');
const baseVariance = variance.core;
const regexpDepth = /^(\d+)(.*)$/;
const splitParent = escapedSplitProvider(/<|>\-/).core;
const splitChild = escapedSplitProvider(/>|<\-/).core;
const splitMedia = escapedSplitProvider('@').core;
const splitMultiplier = escapedSplitProvider('*').core;
const regexpScope = /^(.*?)\[(.*)\]$/;

const selectorsCompileProvider = module.exports = (instance) => {
  const parseId = (comboName) => parseComboName(comboName, '#' + CSS.escape(comboName));
  const parseClass = (comboName) => parseComboName(comboName, '.' + CSS.escape(comboName));
  const parseAttrProvider = (attrName) => {
    const prefix = '[' + attrName + '~=\'';
    return (comboName) => parseComboName(comboName, prefix + escapeQuote(comboName) + '\']');
  };
  let $$states;
  const $$parsers = {
    id: parseId,
    'class': parseClass
  };
  const parseComboNameProvider = (attrName) => $$parsers[attrName] || ($$parsers[attrName] = parseAttrProvider(attrName));
  const parseComboName = (comboName, targetName) => {
    $$states = instance.states || {};
    const multiplierParts = splitMultiplier(comboName);
    if (multiplierParts.length > 1) {
      const multiplier = parseInt(multiplierParts.pop());
      if (!isNaN(multiplier)) {
        comboName = multiplierParts.join('*');
        if (multiplier > 1) targetName = targetName.repeat(multiplier);
      }
    }
    return reduce(
      reduce(baseVariance(comboName), suffixesReduce, {}),
      (items, essences, suffix) => {
        const parts = splitChild(suffix);
        const mediaNames = [];
        let selectors = getParents(mediaNames, parts[0], targetName);
        for (let part, l = parts.length, i = 1; i < l; i++) {
          part = getPart(parts[i]);
          selectors = joinMaps({}, selectors, getParents(mediaNames, part.name), part.prefix);
        }
        push(items, {
          essences,
          selectors,
          mediaName: mediaNames[0] || 'all'
        });
      },
      []
    );
  };


  const getMap = (name) => {
    const synonyms = {};
    synonyms[name || '*'] = true;
    return synonyms;
  };

  const procMedia = (mediaNames, partName) => {
    const mediaParts = splitMedia(partName);
    const mediaPartsLength = mediaParts.length;
    const prefix = mediaParts[0];
    if (mediaPartsLength < 2) return prefix;
    const sp = extractSelector(mediaParts[mediaPartsLength - 1]);
    push(mediaNames, mediaPartsLength > 2 ? mediaParts[1] : sp.prefix);
    return prefix + sp.value;
  };

  const getParents = (mediaNames, name, targetName) => {
    const parts = splitParent(name);
    const l = parts.length;
    let partName = procMedia(mediaNames, parts[0]);
    let essence = getEssence(partName);
    let alts = joinMaps({}, getMap((targetName || '') + essence.selector), essence.states);
    for (let part, i = 1; i < l; i++) {
      part = getPart(procMedia(mediaNames, parts[i]));
      essence = getEssence(part.name);
      alts = joinMaps({}, joinMaps({}, getMap(essence.selector), essence.states), alts, part.prefix);
    }
    return alts;
  };

  const getEssence = (name) => {
    const stateExtract = extractState(name);
    const value = stateExtract.value;
    const selector = unslash(stateExtract.prefix);
    if (!value) {
      return { selector, states: {'': 1} };
    }
    const states = {};
    let state = value, scopeMatchs, v = '', ns, si;
    if (scopeMatchs = regexpScope.exec(value)) {
      state = scopeMatchs[1];
      if (v = scopeMatchs[2] || '') v = '(' + v + ')';
    }
    if ((ns = $$states[state]) && (si = ns.length)) {
      for (;si--;) states[ns[si] + v] = true;
    } else {
      states[':' + state + v] = true;
    }
    return { selector, states };
  };

  return extend(instance || (instance = parseComboName), {
    states: {},
    parseComboName,
    parseComboNameProvider,
    parseAttrProvider,
    parseId,
    parseClass,
    getParents,
    getEssence
  });
};
const extractSuffix = selectorsCompileProvider.extractSuffix = escapedBreakupProvider(/[<>:\.\[\]#+@]/).core;
const extractSelector = selectorsCompileProvider.extractSelector = escapedBreakupProvider('<').core;
const extractState = selectorsCompileProvider.extractState = escapedBreakupProvider(':').core;
const getPrefix = selectorsCompileProvider.getPrefix = (depth) => {
  if (depth < 1) return '';
  let output = '>';
  for (depth--; depth--;) output += '*>';
  return output;
};
const getPart = selectorsCompileProvider.getPart = (name) => {
  const depthMatchs = regexpDepth.exec(name);
  return depthMatchs ? {
    prefix: getPrefix(parseInt(depthMatchs[1])),
    name: depthMatchs[2] || ''
  } : { prefix: ' ', name };
};
const suffixesReduce = (suffixes, altComboName) => {
  const extract = extractSuffix(altComboName);
  const suffix = extract.suffix;
  (suffixes[suffix] || (suffixes[suffix] = {}))[unslash(extract.prefix)] = true;
};
