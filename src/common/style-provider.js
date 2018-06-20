/**
 * @overview styleProvider
 * - предоставляет хранилище стилей
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {
  values as __values,
  extend,
  sortBy,
  set as __set,
  get as __get
} from 'lodash';
import {css as __css} from './css';

const __escape = __css.escape;

export const styleProvider = (ready, document, containerId, prefix) => {
  let $$container = null;
  const $$cache = {};
  const $$styles = {};

  const domFind = (selector) => document.querySelector(selector);
  const domCreate = (name, attrs, parentNode) => {
    const node = document.createElement(name);
    for (let k in attrs) node.setAttribute(k, attrs[k]);
    if (parentNode) parentNode.appendChild(node);
    return node;
  };

  const getNode = (id) => domFind('#' + __escape(id)) || domCreate('style', { id });
  const styleSheet = (node, text) => {
    const styleSheet = node.styleSheet;
    if (styleSheet) {
      styleSheet.cssText = text;
    } else {
      for (let cs = node.childNodes, ci = 0, cl = cs.length; ci < cl; ci++) {
        node.removeChild(cs[ci]);
      }
      node.appendChild(document.createTextNode(text));
    }
  };

  function __setStyle(_name, content, priority) {
    var name = prefix + _name;
    var item = $$cache[name] || ($$cache[name] = { node: getNode(name), priority: 0 });
    if (arguments.length > 2) item.priority = priority || 0;
    styleSheet(item.node, content || '');
  }

  let setStyle = function(_name, content, priority){
    const name = prefix + _name;
    const item = $$cache[name] || ($$cache[name] = {priority: 0});
    if (arguments.length > 2) item.priority = priority || 0;
    item.content = content || '';
  };

  const render = () => {
    if (!$$container) return;
    const items = sortBy(__values($$cache), item => -item.priority);
    for (let i = items.length, item; i--;) $$container.appendChild(items[i].node);
    return instance;    
  };

  ready(() => {
    $$container = domFind('#' + containerId) || domCreate('x', { id: containerId }, domFind('body'));
    let item, name;
    for (name in $$cache) {
      item = $$cache[name];
      styleSheet(item.node = getNode(name), item.content);
      delete item.content;
    }
    setStyle = __setStyle;
    render();
  });

  function set(){
    setStyle.apply(null, arguments);
    return instance;
  }

  const instance = set;
  
  extend(instance, {
    set,
    remove(name) {
      const item = $$cache[name];
      if (!item) return instance;
      const node = item.node;
      const p = node.parent;
      if (p) p.removeChild(node);
      delete $$cache[name];
      return instance;  
    },
    render
  });
  return instance;    
};
