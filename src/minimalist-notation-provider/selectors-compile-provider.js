/**
 * @overview minimalist-notation/selectors
 * Генеририрует селекторы в Minimalist Notation
 * @author Absolutely Amir <mr.amirka@ya.ru>
 * 
 * // изменил порядок деления контекста на родительскиеи дочериние,
 * чтобы было удобнее в нотации юзать такие штуки:
 * //(cF<.parent1|f30<.parent2)>.child1 
 */

import {extend} from 'lodash';
import {isInsignificant} from '../base/is-insignificant';
import {unslash} from '../common/unslash';
import {escapeQuote} from '../common/escape-quote';
import {variance} from '../common/variance';
import {escapedSplitProvider} from '../common/escaped-split-provider';
import {joinMaps} from '../common/join-maps';
import {escapedBreakupProvider} from '../common/escaped-breakup-provider';

const __variance = variance.core;

const regexpDepth = /^(\d+)(.*)$/;
const splitParent = escapedSplitProvider(/<|>\-/).core;
const splitChild = escapedSplitProvider(/>|<\-/).core;
const splitState = escapedSplitProvider(':').core;
const splitMedia = escapedSplitProvider('@').core;
const regexpScope = /^(.*?)\[(.*)\]$/;

export const selectorsCompileProvider = (instance) => {
  const __escape = CSS.escape;

  const classNameCompile = (path) => 
    getSelectors(path, '.' + __escape(path));

  const attrCompile = (path, attrName) => 
    getSelectors(path, '[' + attrName + '~=\'' + escapeQuote(path) + '\']');

  const getSelectors = (value, targetName) => {
    $$states = instance.states || {};

    const rules = {};
    const suffixes = {};

    let map = __variance(value);
    let suffix;
    let extract;
    let parts;
    let mediaNames;
    let alts;
    let l, i, part, item;
    for (i = 0, l = map.length; i < l; i++) {
      extract = extractSuffix(map[i]);
      suffix = extract.suffix;
      (suffixes[suffix] || (suffixes[suffix] = {}))[unslash(extract.prefix)] = 1;
    }
    let _suffix;
    for (suffix in suffixes) { 
      _suffix = unslash(suffix);
      item = rules[_suffix] = { essences: suffixes[suffix] };
      parts = splitChild(suffix);
      mediaNames = [];
      l = parts.length;
      alts = getParents(mediaNames, parts[0], targetName);
      for (i = 1; i < l; i++) {
        part = getPart(parts[i]);
        alts = joinMaps({}, alts, getParents(mediaNames, part.name), part.prefix);
      }
      if (mediaNames.length) item.mediaName = mediaNames[0];
      item.selectors = alts;
    }    
    return rules;
  }

  instance || (instance = classNameCompile);
  let $$states;  
  const getMap = (name) => {
    const synonyms = {};
    synonyms[name || '*'] = 1;
    return synonyms;
  };

  const procMedia = (mediaNames, partName) => {
    const mediaParts = splitMedia(partName);
    const mediaPartsLength = mediaParts.length;
    const prefix = mediaParts[0];
    if (mediaPartsLength < 2) return prefix;
    const sp = extractSelector(mediaParts[mediaPartsLength - 1]);
    mediaNames.push(mediaPartsLength > 2 ? mediaParts[1] : sp.prefix);
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

  extend(instance, {
    states: {}, 
    classNameCompile,
    attrCompile,
    getSelectors,
    getParents, 
    getEssence, 
    getPrefix, 
    getPart,
    extractSuffix
  });
  return instance;
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