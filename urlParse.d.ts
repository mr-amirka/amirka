/**
 * @overview url
 * - парсит URL
 *
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

declare namespace urlParse {
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
    userpart?: string,
    username?: string,
    password?: string,
    email?: string,
    child?: UrlOptions
  }
}
declare const urlParse: (href: string) => urlParse.UrlOptions;
export = urlParse;
