import { MnPreset, attrsMap } from './minimalist-notation-provider';

declare const compileProvider: (presets: MnPreset[]) => (attrsMap: attrsMap) => string;
export = compileProvider;
