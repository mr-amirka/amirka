/**
 * @overview styleProvider
 * - предоставляет хранилище стилей
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {
  values as __values,
  extend,
  sortBy
} from 'lodash';

const __escape = CSS.escape;

export const styleProvider = (document, containerId, prefix) => {
  let $$container = null;
  const $$cache = {};

  const domFind = (selector) => document.querySelector(selector);
  const domCreate = (parent, name, id) => {
    const node = document.createElement(name);
    parent.appendChild(node);
    node.setAttribute('id', id);
    return node;
  };

  const getNode = (id) => domFind('#' + __escape(id)) || domCreate($$container, 'style', id);
  const styleSheet = (node, text) => {
    const styleSheet = node.styleSheet;
    if (styleSheet) {
      styleSheet.cssText = text;
    } else {
      const cs = node.childNodes, cl = cs.length;
      for (let ci = 0; ci < cl; ci++) {
        node.removeChild(cs[ci]);
      }
      node.appendChild(document.createTextNode(text));
    }
  };

  const render = () => {
    const items = sortBy(__values($$cache), item => -item.priority);
    for (let i = items.length, item; i--;) $$container.appendChild(items[i].node);
    return instance;    
  };

  function set(name, content, priority) {
    if (!$$container) {
      const body = domFind('body');
      if (!body) return instance;
      $$container = domFind('#' + containerId) || domCreate(body, 'x', containerId);
    }
    const _name = prefix + name;
    const item = $$cache[_name] || ($$cache[_name] = { node: getNode(_name), priority: 0 });
    if (arguments.length > 2) item.priority = priority || 0;
    styleSheet(item.node, content || '');
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
