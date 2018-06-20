/**
 * @overview MinimalistNotation styles
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {extend, forEach, lowerCase, lowerFirst, upperCase, kebabCase} from 'lodash';
import {flags} from '../../base/flags';
import {intval} from '../../base/any-val';
import {joinArrays} from '../../common/join-arrays';
import {css} from '../../common/css';
import {color as __color} from '../../minimalist-notation/color';

const sides = {
  '': {'': 1},
  t: {top: 1},
  b: {bottom: 1},
  l: {left: 1},
  r: {right: 1},
  v: {top: 1, bottom: 1},
  h: {left: 1, right: 1},
  lt: {top: 1, left: 1},
  rt: {top: 1, right: 1},
  lb: {bottom: 1, left: 1},
  rb: {bottom: 1, right: 1}
};

export const mnStyle = (mn) => {

	const mnKeyframes = mn.setKeyframes;

  forEach({
    p: [ 'padding' ],
    m: [ 'margin' ],
    b: [ 'border', '-width' ],
    d: [ '' ]
  }, (args, pfx) => {
    const propName = args[0];
    const propSuffix = args[1] || '';
    forEach(sides, (side, sideSuffix) => {
      const propsMap = {};
      let priority = 4;
      for (let propSide in side) {
        propsMap[propName + propSide + propSuffix] = 1;
        priority--;
      }
      mn(pfx + sideSuffix, p => {
        const value = p.value || 0;
        const camel = p.camel;
        const v = (camel ? lowerCase(camel) : (value + (p.unit || 'px'))) + p.i;
        const style = {};
        for (let pName in propsMap) style[pName] = v;
        return {
          style,
          priority
        };
      });
    });
  });

  
/*
 //spaces
 @each $size in (20, 25, 34, 40, 55, 150){
     .sq#{$size}{
         width: $size + px;
         height: $size + px;
     }
 }
#{'.w' +  $suffix} { width: 100%; }
#{'.min-w' + $suffix} { min-width: 100%; }
#{'.max-w' + $suffix} { max-width: 100%; }


@each $size in 70 {
    #{'.w' + $size + $suffix} { width:$size + px; }
    #{'.min-w' + $size + $suffix} { min-width:$size + px; }
    #{'.max-w' + $size + $suffix} { max-width:$size + px; }
}


#{'.h' +  $suffix} { height: 100%; }
#{'.hMin' + $suffix} { hMineight: 100%; }
#{'.max-h' + $suffix} { max-height: 100%; }
@each $size in 0, 34, 40, 50, 70, 90, 100, 130 {
    #{'.h' + $size + $suffix} { height:$size + px; }
    #{'.hMin' + $size + $suffix} { hMineight:$size + px; }
    #{'.max-h' + $size + $suffix} { max-height:$size + px; }
}
*/

  forEach({
    sq:  [ 'width', 'height' ],
    w: [ 'width' ],
    h: [ 'height' ]
  }, (props, essencePrefix) => {
    const length = props.length;
    const priority = 4 - length;
    [ '', 'min', 'max' ].forEach((sfx) => {
      const propMap = {};
      for (let propName, i = 0; i < length; i++) {
        propName = props[i];
        propMap[sfx ? (sfx + '-' + propName) : propName] = 1;
      }
      mn(essencePrefix + sfx, p => {
        if (p.negative) return;
        const num = p.num;
        const camel = p.camel;
        const unit = p.unit || 'px';
        const size = (camel ? lowerCase(camel) : (num ? (num + unit) : '100%')) + p.i;
        const style = {};

        for (let propName in propMap) style[propName] = size;

        return {
          style,
          priority
        };
      });
    });
  });


/*
.tbl#{$suffix}{ display:table; &>*{ float:none !important; display:table-cell; vertical-align:middle; } }
.inw#{$suffix}{display:inline-block;}
.inline#{$suffix}{display:inline;}
.block#{$suffix}{display:block; &.tbl, &[class*='tbl-']{&, &>*{display:block;}}}
@mixin clearfix(){
  &:before,&:after{
    content: " ";
    clear: both;
    display: table;
  }
  @content
}

*/

  mn('tbl', {
    style: {display: 'table'},
  });
  mn('tbl.cell', {
    selectors: [ '>*' ], 
    style: {
      display: 'table-cell',
      verticalAlign: 'middle'
    }
  });

  mn('cfx.pale', {
    selectors: [':before', ':after'], 
    style: {content: '" "', clear: 'both', display: 'table'}
  });

  mn('dn', p => {
    if (p.camel || p.negative) return
    const num = p.num;
    if (num) {
      return {
        style: {transitionDuration: num + 'ms' + p.i}
      };
    }
    return {
      exts: [ 'dn250' + p.ni]
    };
  });

/*

//color
@each $index, $color in (
    (1,#FFF), (2,#000), (3,#d6d6d6),
    (4,#6e91b7), (5,#39383d), (6,#6a6a6a),
    (7,#3b7aa9), (8, #ac3032),
) {
    .c#{$index}, .c#{$index}-h:hover{
        color: $color !important;
    }
}
*/
  
  const colorMatch = '^(([A-Z][a-z]+):camel|([A-F0-9]+):color):value(.*)?$';
  forEach({ 
    c: 'color',
    stroke: 'stroke'
  }, (propName, pfx) => {
    mn(pfx, p => {
      let alts = __color(p.value || '0');
      const important = p.i;
      if (important) alts = joinArrays([], alts, [ important ]);
      const style = {};
      style[propName] = alts;
      return {style};
    }, colorMatch);
  });
  

/*
//background color
@each $index, $color in (
    (1,#FFF), (2,#000), (3,#d6d6d6),
    (4,#6e91b7), (5,#f2f2f2), (6,#5b92ba), (7,#e30613)
) {
    .bg#{$index}, .bg#{$index}-h:hover{
        background-color: $color !important;
    }
}
*/
  mn('bg', p => {
    const v = p.suffix;
    if (p.negative || !v) return;
    const bg = __color.getBackground(v);
    let alts = bg.alts;
    const important = p.i 
    if (!important) alts = joinArrays([], alts, [ important ]);
    return {
      style: {
        background: alts
      }
    };
  });


/*
.tl#{$suffix}{text-align:left;}
.tc#{$suffix}{text-align:center;}
.tr#{$suffix}{text-align:right;}

.lt#{$suffix},[class*='tbl']>.lt#{$suffix}{float:left !important;}
.ct#{$suffix}{margin-left:auto;margin-right:auto;}
.rt#{$suffix},[class*='tbl']>.rt#{$suffix}{float:right !important;}
*/

  forEach({
    textAlign: { 
      tl: 'left',
      tc: 'center',
      tr: 'right'
    },
    float: { 
      lt: 'left',
      ct: 'none',
      rt: 'right'
    }
  }, (valsMap, propName) => {
    forEach(valsMap, (value, pfx) => {
      mn(pfx, p => {
        if (p.suffix) return;
        return {
          style: {
            [propName]: value + p.i
          }
        };
      });
    });
  });


/*
.fw9#{$suffix}{font-weight:900;}
.fw8#{$suffix}{font-weight:800;}
.fw7#{$suffix}{font-weight:700;}
.fw6#{$suffix}{font-weight:600;}
.fw5#{$suffix}{font-weight:500;}
.fw4#{$suffix}{font-weight:400;}
.fw3#{$suffix}{font-weight:300;}
.fw2#{$suffix}{font-weight:200;}
.fw1#{$suffix}{font-weight:100;}
*/
  mn('fw', p => {
    if (p.camel || p.negative) return;
    return {
      style: {
        fontWeight: 100 * intval(p.num, 1, 1, 9)
      }
    };
  });


/*
.overlay{
  position: absolute;
  display: block;
  top:0px;left:0px;right:0px;bottom:0px;
}
*/
  mn('overlay', {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  });


};