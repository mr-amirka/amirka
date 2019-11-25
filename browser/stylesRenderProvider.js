/**
 * @overview styleProvider
 * - предоставляет хранилище стилей
 *
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = (document, prefix) => {
  const __escape = CSS.escape;
  const domFind = (selector) => document.querySelector(selector);
  const domCreate = (parent, name, id) => {
    const node = document.createElement(name);
    parent.appendChild(node);
    node.setAttribute('id', id);
    return node;
  };
  const getNode = (id) => domFind('#' + __escape(id)) || domCreate(head, 'style', id);
  const styleSheet = (node, text) => {
    const styleSheet = node.styleSheet;
    if (styleSheet) {
      styleSheet.cssText = text;
    } else {
      const cs = node.childNodes;
      for (let ci = cs.length; ci--;) node.removeChild(cs[ci]);
      node.appendChild(document.createTextNode(text));
    }
  };
  let last = {}, head;
  return (styles) => {
    if (!(head || (head = domFind('head')))) return
    const trash = last;
    last = {};
		styles.forEach((item) => {
      const name = item.name;
      const node = last[name] = trash[name] || getNode(prefix + name);
      delete trash[name];
      item.updated && styleSheet(node, item.content || '');
      head.appendChild(node);
    });
    let node, p;
    for (let name in trash) (p = (node = trash[name]).parent) && p.removeChild(node);
	};
};
