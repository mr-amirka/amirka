
import { attrsMap } from './minimalist-notation-provider';

declare const parserProvider: (attrs: string[]) => ((dst: attrsMap, text: string) => number) | null;
export = parserProvider;
