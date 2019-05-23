/**
 * @overview complement
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

declare namespace complement {
  export interface complement {
    (dst?: any, src?: any, depth?: number): any;
    readonly core: (dst: any, src: any, depth: number) => any;
  }
}
declare const complement: complement.complement;
export = complement;
