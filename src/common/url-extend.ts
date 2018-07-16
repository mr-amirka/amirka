
/**
 * @overview urlExtend
 * - парсит и мерджит url
 */

import {mergeDepth} from '../base/merge-depth';
import {urlParse, UrlOptions} from './url-parse';
import {param} from './param';

export { UrlOptions };

const __normalize = (v: string | UrlOptions): UrlOptions => {
  if (!v) return {};
  let type = typeof v;
  if (type === 'string') return urlParse(<string> v);
  if (type === 'object') return <UrlOptions> v;
  return {};
};

export const urlExtend = (dst: string | UrlOptions, src: string | UrlOptions): UrlOptions => {
  dst = __normalize(dst);
  src = __normalize(src);
  const dirname = (src.dirname === undefined ? dst.dirname : src.dirname) || '';
  const hostname = src.hostname === undefined ? dst.hostname : src.hostname;
  const protocol = src.protocol === undefined ? dst.protocol : src.protocol;
  const port = src.port === undefined ? dst.port : src.port;
  const host = hostname || port ? (hostname + (port ? (':' + port) : '')) : '';

  const unalias = (hostname ? (protocol + '://' + host ) : '') + dirname;
  const alias = (src.alias === undefined ? dst.alias : src.alias) || '';
  const
    extension = (src.extension === undefined ? dst.extension : src.extension) || '',
    filename = alias + (extension ? '.' + extension : ''),
    unextension = unalias + alias,
    unsearch = unextension + (extension ? '.' + extension : ''),
    path = dirname + filename,
    query = src.query === null ? {} : mergeDepth([ dst.query, src.query ], {}),
    search = param(query);
 
  const unhash = unsearch + (search ? '?' + search : '');
  const srcChild = src.child, dstChild = dst.child;
  const child = (srcChild || dstChild) ? urlExtend(dstChild || {}, srcChild || {}) : undefined;
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
    child
  };
};

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
