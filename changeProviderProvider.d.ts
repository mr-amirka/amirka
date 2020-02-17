/**
 * @overview changeProviderProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {cancel} from "./global";

/**
 * @example
 * ```js
 * const changeProvider = changeProviderProvider(setState);
 * const change = changeProvider('name', 'value');
 * <input onChange={change}/>
 * ```
 */

type IChange = (e: Event) => void;
type IChangeProvider = (name: string, prop: string, map: ((v: any) => any) | undefined | null) => IChange;
declare function changeProviderProvider(setState: (state: {[name: string]: any}) => any): IChangeProvider;
export = changeProviderProvider;
