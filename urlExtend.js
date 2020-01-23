const merge = require('./merge');
const urlParse = require('./urlParse');
const param = require('./param');

function normalize(v, type) {
  return v ? (
    (type = typeof v) == 'string'
      ? urlParse(v)
      : (type == 'object' ? v : {})
  ) : {};
}
function __def(src, dst, def) {
  return (src === undefined ? dst : src) || def || '';
}
function urlExtend(dst, src) {
  dst = normalize(dst);
  src = normalize(src);

  const hostname = __def(src.hostname, dst.hostname);
  const protocol = __def(src.protocol, dst.protocol);
  const port = __def(src.port, dst.port);
  const username = __def(src.username, dst.username);
  const password = __def(src.password, dst.password);
  const userpart = username ? (username + ':' + password) : '';
  const host = hostname || port ? (hostname + (port ? (':' + port) : '')) : '';
  const email = username ? (username + '@' + host) : '';
  const login = userpart ? (userpart + '@' + host) : '';
  const unpath = login ? (protocol + '://' + login) : (host ? (protocol + '://' + host) : '');
  const extension = __def(src.extension, dst.extension);
  const alias = __def(src.alias, dst.alias);
  const filename = alias + (extension ? '.' + extension : '');
  const dirname = __def(src.dirname, dst.dirname, filename ? '/' : '');
  const path = dirname + filename;
  const unalias = unpath + dirname;
  const // eslint-disable-line
    unextension = unalias + alias,
    unsearch = unextension + (extension ? '.' + extension : ''),
    query = merge([dst.query, src.query], {}),
    search = param(query);
  const unhash = unsearch + (search ? '?' + search : '');
  const srcChild = src.child, dstChild = dst.child; // eslint-disable-line
  const child = srcChild || dstChild
    ? urlExtend(dstChild || {}, srcChild || {}) : 0;
  const hash = child && child.href || '';
  const href = unhash + (hash ? '#' + hash : '');

  return {
    href,
    search,
    unhash,
    hash,
    query,
    protocol,
    path,
    unpath,
    hostname,
    host,
    port,
    unalias,
    dirname,
    filename,
    alias,
    unextension,
    extension,
    unsearch,
    userpart,
    username,
    password,
    email,
    login,
    child,
  };
}
module.exports = urlExtend;

//console.log(urlExtend('http://eko-press.dartline.ru/api/'));

//console.log(urlExtend('http://username:password@eko-press.dartline.ru/api.php?callback=JSONP_1&entity=navigation&method=GET&timestamp=1546178631496'));

/*
const defaultConfig: UrlOptions = {
  protocol: 'http',
  hostname: 'localhost'
};

const location = support('location');
if (location) {
  location.protocol && (defaultConfig.protocol = location.protocol.replace(/:/, ''));
  location.hostname && (defaultConfig.hostname = location.hostname);
  location.port && (defaultConfig.port = location.port);
}
*/
