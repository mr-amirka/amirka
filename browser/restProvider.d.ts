
import { fn } from "mn-utils";

import * as Deal from 'mn-utils/CancelablePromise';
import { Http } from './httpProvider';

declare namespace restProvider {
  export interface Rest {
    post: (body: any) => Deal;
    put: (body: any, where: any) => Deal;
    get: (where: any, limit?: number, offset?: number) => Deal;
    delete: (where: any) => Deal;
  }
}
declare const restProvider: ((http: Http, essenceName: string, wrappers?: {[methodName: string]: fn}) => restProvider.Rest);
export = restProvider;
