/**
 * @overview breakup
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

export const breakupProvider = (indexOf: fn) => {
	return (input: string, separator: string, right?: boolean) => {
	  const i = indexOf.call(input, separator);
	  return i < 0 ? (right ? [ '',  input ] : [ input, '' ]) : [ input.substr(0, i), input.substr(i + separator.length) ];
	};
}

export const breakup = breakupProvider(''.indexOf);
export const breakupLast = (<any> breakup).last = breakupProvider(''.lastIndexOf);