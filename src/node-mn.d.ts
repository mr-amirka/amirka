
import { MnPreset } from './minimalist-notation-provider';
export interface compileSourceOptions {
  input: string | {
    [outputName: string]: string | compileSourceOptions
  },
  output?: string | undefined | null,
  include?: RegExp | RegExp[],
  exclude?: RegExp | RegExp[],
  attrs: string | string[],
  presets: MnPreset[]
}

export declare const defaultSettings: compileSourceOptions;
export declare const compileSource: (options: compileSourceOptions) => void;
