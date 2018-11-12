

declare namespace withoutEmpty {
  export interface withoutEmpty {
    (data: any, depth?: number): any;
    base: (data: any, depth?: number) => any;
  }
}

declare const withoutEmpty: withoutEmpty.withoutEmpty;
export = withoutEmpty;
