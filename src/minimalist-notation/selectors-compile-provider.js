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
import {css} from '../common/css';
import {escapedBreakupProvider} from '../common/escaped-breakup-provider';

const __variance = variance.core;
const __escape = css.escape;
const regexpDepth = /^(\d+)(.*)$/;
const splitParent = escapedSplitProvider(/<|>\-/).core;
const splitChild = escapedSplitProvider(/>|<\-/).core;
const splitState = escapedSplitProvider(':').core;
const regexpScope = /^(.*?)\[(.*)\]$/;


export const selectorsCompileProvider = (instance) => {

  const classNameCompile = (path) => 
    getSelectors(path, '.' + __escape(path));

  const attrCompile = (path, attrName) => 
    getSelectors(path, '[' + attrName + '~=\'' + escapeQuote(path) + '\']');

  const getSelectors = (value, targetName) => {
    $$states = instance.states || {};

    const rules = {};
    const suffixes = {};
    const initial = {};
    initial[targetName] = 1;

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
      item = rules[_suffix] = { essences: suffixes[_suffix] };
      parts = splitChild(suffix);
      mediaNames = [];
      l = parts.length;
      alts = getParents(mediaNames, parts[0], initial);
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
    let mp = extractMedia(partName);
    let mediaValue = mp.value;
    if (!mediaValue) return mp.prefix;
    let sp = extractSelector(mediaValue);
    let mediaName = sp.prefix;
    if (mediaName) {
      mediaNames.push(mediaName);
    }
    return mp.prefix + sp.value;
  };

  const getParents = (mediaNames, name, alts) => {       
    const parts = splitParent(name);
    const l = parts.length;
    let partName = procMedia(mediaNames, parts[0]);
    let essence = getEssence(partName);

    let partAlts = joinMaps({}, getMap(essence.selector), essence.states);
    if (alts) {
      if (partName) alts = joinMaps({}, partAlts, alts);
    } else {
      alts = partAlts;
    }
    for (let part, i = 1; i < l; i++) {
      part = getPart(procMedia(mediaNames, parts[i]));
      essence = getEssence(part.name);
      alts = joinMaps({}, joinMaps({}, getMap(essence.selector), essence.states), alts, part.prefix);
    }
    return alts;
  };
  
  const getEssence = (name) => {
    const statesCollection = splitState(name);
    if (statesCollection.length < 2) {
      return { selector: unslash(name), states: {'': true} };
    }
    const selector = unslash(statesCollection.shift());
    const states = {};
    let state, ns, si, v, scopeMatchs, i = statesCollection.length;
    for (;i--;) {
      if (state = unslash(statesCollection[i])) {
        if (scopeMatchs = regexpScope.exec(state)) {
          state = scopeMatchs[1];
          if (v = '' || scopeMatchs[2]) v = '(' + v + ')';
        } else {
          v = '';
        }
        if ((ns = $$states[state]) && (si = ns.length)) {
          for (;si--;) states[ns[si] + v] = true;
        } else {
          states[':' + state + v] = true; 
        }
      } else {
        states[''] = true;
      }
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

const extractMedia = selectorsCompileProvider.extractMedia = escapedBreakupProvider('@');
const extractSuffix = selectorsCompileProvider.extractSuffix = escapedBreakupProvider(/[<>:\.\[\]#+@]/);
const extractSelector = selectorsCompileProvider.extractSelector = escapedBreakupProvider('<');
const getPrefix = selectorsCompileProvider.getPrefix = (depth) => {
  let i = 0, output = '';
  for (; i < depth; i++) output += '>';
  return output;
};
const getPart = selectorsCompileProvider.getPart = (name) => {
  const depthMatchs = regexpDepth.exec(name);
  return depthMatchs ? {
    prefix: getPrefix(parseInt(depthMatchs[1])),
    name: depthMatchs[2] || ''
  } : { prefix: ' ', name };
};
