

interface mn {
  (essencePrefix: string, essenceOptions: EssenceOptions): mn;
  (essencePrefix: string, handler: EssenceHandler, matches?: string | string[]): mn;
  (essences: EssenceMapOptions): mn;
}
interface EssenceMapOptions {
  [essencePrefix: string]: EssenceOptions | EssenceHandler;
}

//функция-генератор эссенции
interface EssenceHandler {
  (params: ParamsOptions): EssenceOptions
}
interface ParamsOptions {
  [name: string]: string;
}

//Опции эссенции
interface EssenceOptions {
  inited?: boolean;
  priority?: number;
  style?: {
    [prop: string]: string | string[]
  };
  exts?: string[];
  include?: string[];
  selectors?: string[];
  childs?: {
    [childName: string]: EssenceOptions
  },
  media: {
    [mediaName: string]: EssenceOptions
  }
}