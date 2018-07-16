/**
 * @overview url
 * - парсит URL 
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {breakup, breakupLast} from '../base/breakup';
import {unparam} from './unparam';

export interface UrlOptions {
  href?: string,
  search?: string,
  unhash?: string,
  hash?: string,
  query?: any,
  protocol?: string,
  path?: string,
  hostname?: string,
  host?: string,
  port?: string,
  unalias?: string,
  dirname?: string,
  filename?: string,
  alias?: string,
  unextension?: string,
  extension?: string,
  unsearch?: string,
  child?: UrlOptions
}

export const urlParse = (href: string): UrlOptions => {
  let parts = breakup(href, '#');
  const hash = parts[1];
  const unhash = parts[0];
  const unsearch = (parts = breakup(unhash, '?'))[0];
  const search = parts[1];
  const query = unparam(search);
  const child = hash ? urlParse(hash) : {};
  const protocol = (parts = breakup(unsearch, '://' ,true))[0];
  const path = protocol ? (parts = breakup(parts[1], '/'))[1] : parts[1];
  const host = protocol ? parts[0] : '';
  const hostname = protocol ? (parts = breakup(host, ':'))[0] : '';
  const port = protocol ? parts[1] : '';
  const unalias = (parts = breakupLast(unsearch, '/', true))[0] + '/';
  const filename = parts[1];
  const alias = (parts = breakupLast(filename, '.'))[0];
  const unextension = unalias + alias;
  const extension = parts[1];
  const dirname = host ? breakup(unalias, host, true)[1] : unalias;
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




