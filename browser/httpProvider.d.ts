
import * as request from './request';
import * as Deal from 'mn-utils/CancelablePromise';

declare namespace httpProvider {
  export interface HttpMethod {
    (url: string, options?: request.RequestOptions): Deal;
  }
  export interface Http {
    post: HttpMethod;
    put: HttpMethod;
    get: HttpMethod;
    delete: HttpMethod;
  }

}
declare const httpProvider: ((rootUrl?: string) => httpProvider.Http);
export = httpProvider
