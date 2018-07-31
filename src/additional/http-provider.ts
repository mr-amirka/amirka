
import { request, RequestOptions } from './request';
import { Deal} from '../base/deal';

export interface HttpMethod {
	(url: string, options?: RequestOptions): Deal;
}

export interface Http {
	post: HttpMethod;
	put: HttpMethod;
	get: HttpMethod;
	delete: HttpMethod;
}

export const httpProvider = (rootUrl?: string): Http => {
	rootUrl || (rootUrl = '');
	const instance: Http = <Http> {};
	[ 'post', 'put', 'get', 'delete' ].forEach((method) => {
		instance[method] = (url: string, options?: RequestOptions) => {
			return request(rootUrl + url, { ...options, method });
		};
	});
	return instance;
}