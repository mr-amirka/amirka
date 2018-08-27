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


interface item {
  node: HTMLStyleElement;
  priority: number;
}

export interface StyleStorage {
  set: (name: string, value: string, priority?: number) => StyleStorage;
  remove: (name: string) => StyleStorage;
  render: () => StyleStorage;
}

export const styleProvider = (document: Document, containerId: string, prefix?: string):  StyleStorage => {
  const __escape = CSS.escape;

  let $$container: Element | null = null;
  const $$cache = {};

  const domFind = (selector: string) => document.querySelector(selector);
  const domCreate = (parent: Element, name: string, id: string) => {
    const node = document.createElement(name);
    parent.appendChild(node);
    node.setAttribute('id', id);
    return node;
  };

  const getNode = (id: string) => domFind('#' + __escape(id)) || domCreate(<Element> $$container, 'style', id);
  const styleSheet = (node: HTMLStyleElement, text: string) => {
    const styleSheet = (<any> node).styleSheet;
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
    const items: item[] = sortBy(__values($$cache), (item: item) => -item.priority);
    for (let i = items.length; i--;) (<Element> $$container).appendChild(items[i].node);
    return instance;    
  };

  function set(name: string, content: string, priority?: number) {
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

  const instance: StyleStorage = <any> set;
  
  extend(instance, {
    set,
    remove: (name: string) => {
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