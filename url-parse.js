/**
 * @overview url
 * - парсит URL
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const breakup = require('./breakup');
const unparam = require('./unparam');
const breakupLast = breakup.last;
const urlParse = module.exports = (href) => {
  let parts = breakup(href, '#');
  const hash = parts[1];
  const unhash = parts[0];
  const unsearch = (parts = breakup(unhash, '?'))[0];
  const search = parts[1];
  const query = unparam(search);
  const child = hash ? urlParse(hash) : null;
  const protocol = (parts = breakup(unsearch, '://' ,true))[0];
  const rootPath = parts[1];

  parts = protocol ? breakup(rootPath, '/') : [ '', rootPath ];

  const path = parts[1];
  const hasDelimeter = parts[2];

  const userpart = (parts = breakup(parts[0], '@', true))[0];
  const userParts = breakup(userpart, ':');
  const username = userParts[0];
  const password = userParts[1];
  const host = protocol ? parts[1] : '';
  const email = username ? (username + '@' + host) : '';
  const hostname = protocol ? (parts = breakup(host, ':'))[0] : '';
  const port = protocol ? parts[1] : '';

  const login = userpart ? (userpart + '@' + host) : '';

  const unpath = login ? (protocol + '://' + login) : (host ? (protocol + '://' + host) : '');

  parts = breakupLast(path, '/', true);
  const dirname = (hasDelimeter ? '/' : '') + parts[0] + (parts[2] ? '/' : '');
  const filename = parts[1];

  const unalias = unpath + dirname;

  const alias = (parts = breakupLast(filename, '.'))[0];
  const unextension = unalias + alias;
  const extension = parts[1];

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
    login,
    password,
    email,
    child,
    rootPath
  };
};

//console.log(urlParse('http://eko-press.dartline.ru/api/'));

//console.log(urlParse('http://username:password@eko-press.dartline.ru/api.php?callback=JSONP_1&entity=navigation&method=GET&timestamp=1546178631496'));


//console.log(urlParse('http://eko-press.dartline.ru/api.php'));
//console.log(urlParse('https://localhost:80/api/v1/method.json?sa=10#path/as?asd=29'));
