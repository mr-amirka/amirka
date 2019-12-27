module.exports = (document, prefix) => {
  function getNode(id) {
    let node = document.getElementById(id);
    if (node) return node;
    head.appendChild(node = document.createElement('style'));
    node.setAttribute('id', id);
    return node;
  }
  function styleSheet(node, text) {
    const styleSheet = node.styleSheet;
    const cs = node.childNodes;
    let ci = cs && cs.length || 0;
    if (styleSheet) {
      styleSheet.cssText = text;
    } else {
      while (--ci > -1) node.removeChild(cs[ci]);
      node.appendChild(document.createTextNode(text));
    }
  }
  let last = {}, head; // eslint-disable-line
  return (styles) => {
    head = head || document.getElementsByTagName('head')[0];
    if (!head) return;
    let trash = last, node, item, p, name, l = styles.length, i = 0; // eslint-disable-line
    last = {};
    while (i < l) {
      item = styles[i++];
      name = item.name;
      node = last[name] = trash[name] || getNode(prefix + name);
      delete trash[name];
      item.updated && styleSheet(node, item.content || '');
      head.appendChild(node);
    }
    for (name in trash) (p = (node = trash[name]).parent) && p.removeChild(node); // eslint-disable-line
  };
};
