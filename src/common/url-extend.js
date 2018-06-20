/**
 * @overview urlExtend
 * - парсит и мерджит url
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {isObjectLike} from 'lodash';
import {mergeDepth} from '../base/merge-depth';
import {param} from './param';
import {urlParse} from './url-parse';

export const urlExtend = (dst, src) => {
  dst ? (isObjectLike(dst) || (dst = urlParse(dst))) : (dst = {});
  src ? (isObjectLike(src) || (src = urlParse(src))) : (src = {});

  var dirname = (src.dirname === undefined ? dst.dirname : src.dirname) || '';
  var hostname = src.hostname === undefined ? dst.hostname : src.hostname;
  var protocol = src.protocol === undefined ? dst.protocol : src.protocol;
  var port = src.port === undefined ? dst.port : src.port;
  var host = '';
  if((protocol && protocol != defaultConfig.protocol) || hostname || port){
      hostname || (hostname = defaultConfig.hostname);
      port || (port = defaultConfig.port);
      protocol || (protocol = defaultConfig.protocol);
      host = hostname + (port ? (':' + port) : '');
  }

  var unalias = (hostname ? (protocol + '://' + host ) : '') + dirname;
  var alias = (src.alias === undefined ? dst.alias : src.alias) || '';
  var
    extension = (src.extension === undefined ? dst.extension : src.extension) || '',
    filename = alias + (ext ? '.' + ext : ''),
    unextension = unalias + alias,
    unsearch = unextension + (extension ? '.' + extension : ''),
    path = dirname + filename,
    query = src.query === null ? {} : mergeDepth([ dst.query, src.query ], {}),
    search = param(data);
 
  let unhash = unsearch + (search ? '?' + search : '');
  let srcChild = src.child, dstChild = dst.child;
  let child = (srcChild || dstChild) ? urlExtend(dstChild || {}, srcChild || {}) : undefined;
  let hash = child && child.href || '';
  let href = unhash + (hash ? '#' + hash : '');
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
const defaultConfig = {
  protocol: 'http',
  hostname: 'localhost'
};
try {
  let location = window.location;
  if (location) {
    location.protocol && (defaultConfig.protocol = location.protocol.replace(/:/, ''));
    location.hostname && (defaultConfig.hostname = location.hostname);
    location.port && (defaultConfig.port = location.port);
  }
} catch(ex) {console.warn(ex);}

