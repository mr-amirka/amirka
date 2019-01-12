/**
 * @overview urlExtend
 * - парсит и мерджит url
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const mergeDepth = require('./merge-depth');
const urlParse = require('./url-parse');
const param = require('./param');
const __normalize = v => {
  if (!v) return {};
  let type = typeof v;
  if (type === 'string') return urlParse(v);
  if (type === 'object') return v;
  return {};
};
const __def = (src, dst) => ((src === undefined ? dst : src) || '');
const urlExtend = module.exports = (dst, src) => {
  dst = __normalize(dst);
  src = __normalize(src);
  const dirname = __def(src.dirname, dst.dirname);
  const hostname = __def(src.hostname, dst.hostname);
  const protocol = __def(src.protocol, dst.protocol);
  const port = __def(src.port, dst.port);
  const username = __def(src.username, dst.username);
  const password =  __def(src.password, dst.password);
  const userpart = username ? (username + ':' + password) : '';
  const host = hostname || port ? (hostname + (port ? (':' + port) : '')) : '';
  const email = username ? (username + '@' + host) : '';
  const login = userpart ? (userpart + '@' + host) : '';
  const unpath = login ? (protocol + '://' + login) : (host ? (protocol + '://' + host) : '');
  const extension = (src.extension === undefined ? dst.extension : src.extension) || '';
  const alias = (src.alias === undefined ? dst.alias : src.alias) || '';
  const filename = alias + (extension ? '.' + extension : '');

  const unalias = unpath + (dirname ? ('/' + dirname) : '') + (filename ? '/' : '');

  const
    unextension = unalias + alias,
    unsearch = unextension + (extension ? '.' + extension : ''),
    path = dirname + filename,
    query = src.query === null ? {} : mergeDepth([ dst.query, src.query ], {}),
    search = param(query);

  const unhash = unsearch + (search ? '?' + search : '');
  const srcChild = src.child, dstChild = dst.child;
  const child = (srcChild || dstChild) ? urlExtend(dstChild || {}, srcChild || {}) : null;
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
    child
  };
};

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
