/**
 * @overview Api
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

import {noop, isObjectLike, once} from 'lodash';
import {mapCollection} from '../base/map-collection';
import {getByType} from '../base/get-by-type';
import {mergeDepth} from '../base/merge-depth';
import {extendByPathsMap} from '../base/extend-by-paths-map';
import {routeParseProvider} from './route-parse-provider';
import {Deal} from './deal';
import {responsibilityChain} from './responsibility-chain';
import {urlParse} from './url-parse';
import {urlExtend} from './url-extend';

const argsTypes = {
  'string': [ 'route' ],
  'function': [ 'handler' ]
};

export function Api() {
  const self = this;
  self.end = noop;
  self.$$chain = [];

  const emit = self.emit = (req, res, next) => {
    req.params = {};
    responsibilityChain(self.$$chain, req, res, next);
    return self;
  };
  const request = self.request = (url, _options) => {
    url = isObjectLike(url) ? mergeDepth([ url, urlExtend(url.url, url) ]) : urlParse(url);
    const requestInstance = mergeDepth([ _options, url ], {}, 10);
    return new Deal(name, (resolve, reject, store) => {
      const send = once((response) => {
        resolve(response);
        return responseInstance;
      });
      const responseInstance = {store, send};
      emit(requestInstance, responseInstance, self.end);
    });
  };
  self.use = function(){
    const options = getByType(arguments, argsTypes);
    const handler = options.handler;
    if(!handler)return self;
    const chain = self.$$chain;
    const route = options.route;
    if(!route){
      chain.push(handler);
      return self;
    }
    const routeMatch = routeParseProvider('^/?' + route + '$');
    chain.push((req, res, next) => {
      if(req.path && routeMatch(req.path, req.params))return handler(req, res, next);
      next();
    });
    return self;
  };

  self.getAll = (requests, options) => {
    return Deal.all(mapCollection(requests, v => request(v, options)));
  };
  self.aggregate = (requests, scope) => {
    return Deal.all(mapCollection(requests || (requests = {}), o => request({
      url: o.url,
      data: extendByPathsMap({}, scope, o.input)
    }))).then(responses => mapCollection(requests, (o, k) => {
      let res = responses[k], output = o.output;
      return output ? extendByPathsMap({}, res, output) : res;
    }));
  };
}

