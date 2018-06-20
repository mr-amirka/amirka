

import {extend, forEach, lowerCase, lowerFirst, upperCase, kebabCase} from 'lodash';
import {flags} from 'minimalist/base/flags';
import {joinArrays} from 'minimalist/base/join-arrays';
import {intval} from 'minimalist/base/any-val';
import {css} from 'minimalist/common/css';
import {color as __color} from 'minimalist/additional/color';

const sides = {
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

const generateRulesForSides = (dst, essencePrefix, attrPrefix, attrSuffix) => {
  attrPrefix || (attrPrefix = '');
  attrSuffix || (attrSuffix = '');
  if (attrPrefix) {
    dst[essencePrefix] = [ attrPrefix ];
    attrPrefix += '-';
  }
  let props, sideMap, sideSuffix, sideName;
  for (sideName in sides) {
    props = dst[essencePrefix + sideName] = [];
    sideMap = sides[sideName];
    for (sideSuffix in sideMap) {
      props.push(attrPrefix + sideSuffix + attrSuffix);
    }
  }
};

const mnWrapSides = (propName, sideName, value, suffix) => {
  suffix || (suffix = '');
  const style = {}, side = sideName && sides[sideName];
  if (!side) {
  	style[propName + suffix] = value;
  	return {style, priority: 0};
  }
  let k, priority = 4;
  propName && (propName += '-');
  for (k in side) {
    priority--;
    style[propName + k + suffix] = value;
  }
  return {style, priority};
};

//grid rows, grid columns, grid-auto-rows: 1fr
const essencesMap = {
  tn: [ 'transition' ],

  g: [ 'grid-template' ],
  gr: [ 'grid-template-rows' ],
  gc: [ 'grid-template-columns' ],
  gar: [ 'grid-auto-rows' ],

  gg: [ 'grid-gap' ],

  gRow: [ 'grid-row' ],
  gCol: [ 'grid-column' ],

  fx: [ 'flex' ],

  ff: [ 'font-family' ],

  tp: [ 'transition-property' ],
  r: [ 'border-radius' ]
};

[ 
  [ 'b', 'border' ],
  [ 'm', 'margin' ],
  [ 'p', 'padding' ],
  [ 'd' ]
].forEach((v) => generateRulesForSides(essencesMap, v[0], v[1], v[2]));

export const mnStyle = (mn) => {

	const mnKeyframes = mn.setKeyframes;

	(() => {
    const replacer = (all, escaped) => escaped ? '_' : ' ';
    const regexp = /(\\_)|(_)/;
    const paramsPattern = '_(.*):value';
    forEach(essencesMap, (propNames, essencePrefix) => {
      const length = propNames.length;
      const priority = 4 - length;
      mn(essencePrefix + paramsPattern, (req, set) => {
        const params = req.params;
        const value = (params.value || '').replace(regexp, replacer);
        const style = {};
        for (let i = length; i--;) {
        	style[ propNames[i] ] = value;
        }
        set.essence({ style, priority });
      });
    });
	})();


	mn((req, set, next) => {
    var value = req.value;
    if (!value) return next();
    var options = req.options;
    var params = req.params;
    set.essence(mnWrapSides(options.prop, lowerCase(params.side),
            value + (params.w ? '%' : 'px') + (params.i ? '' : ' !important'), options.suffix));
	}, {
    p: {prop: 'padding'},
    m: {prop: 'margin'},
    b: {prop: 'border', suffix: '-width'},
    d: {prop: ''}
	}, [ '(w|\\%):w?([A-Za-z]+):side?(-i):i?$' ]);


	forEach({
    rlv: 'relative',
    fxd: 'fixed',
    abs: 'absolute',
    static: 'static'
	}, (position, essenceName) => mn(essenceName, { style: { position }, priority: 2 }));



	mn((req, set, next) => {
    if(req.camel)return next();
    var options = req.options;
    var v = (req.value || '0') + (req.params.w || 'px');
    var style = {};
    for(var l = options.length; l--;)style[ options[l] ] = v;
    set.essence({ style });
	}, {
    st: [ 'top', 'left', 'right' ],
    sb: [ 'bottom', 'left', 'right' ],
    sl: [ 'top', 'left', 'bottom' ],
    sr: [ 'top', 'right', 'bottom' ],
    slt: [ 'left', 'top' ],
    slb: [ 'left', 'bottom' ],
    srt: [ 'right', 'top' ],
    srb: [ 'right', 'bottom' ]
	}, [ '(%):w' ]);



	mn((req, set) => {
    var params = req.params;
    set({transform: 'translate(' +
        ((params.x || '0') + (params.xu || 'px')) + ',' +
        ((params.y || '0') + (params.yu || 'px')) +
    ')' + (params.s ? (' scale(' + (0.01 * params.s) + ')') : '') + (params.important ? '' : '!important') });
	}, [ 'x' ], [ '^(-?[0-9]+):x?(%):xu?([yY](-?[0-9]+):y(%):yu?)?([sS]([0-9]+):s)?(-i):important?$' ]);


(() => {
    var inited = false;
    mn(({ options, value, params }, set) => {
        isNaN(v = value ? parseInt(value) : 3000) || v > 0 && set({
            animation: 'spinner-animate ' + v + 'ms infinite linear'
        });

        if(inited)return;
        inited = true;
        mnKeyframes('spinner-animate', {
            from: { transform: 'rotateZ(0deg)' },
            to: { transform: 'rotateZ(360deg)' }
        });   

    }, [ 'spnr' ]);
})();



mn((req, set, next) => {
    var value = req.value;
    if(!value)return next();
    var options = req.options;
    var params = req.params;
    set.essence(
        mnWrapSides(options.prop, lowerCase(params.side),
        value + (params.w || 'px') + (params.i ? '' : '!important'), options.suffix)
    );
}, {
    p: {prop: 'padding'},
    m: {prop: 'margin'},
    b: {prop: 'border', suffix: '-width'},
    d: {prop: ''}
}, [ '^\\d+(%):w?([A-Za-z]*):side(.*?)(-i):i?$' ]);



  mn('break', {
    style: {
      whiteSpace: 'normal',
      wordBreak: 'break-word'
    }
  });


//.shadow1{
//  @include echo( cross(box-shadow,inset 0px 0px 10px 5px rgba(0, 0, 0, .15)) );
//}
//.sh10-5c0001
  mn(({ name, value, params, options }, set, next) => {
    var repeatCount = intval(params.m, 1, 0);
    if(!value || repeatCount < 1)return next();
    var x = params.x || 0, y = params.y || 0, r = params.r || 0;
    var altColors = __color(params.c || '0');
    var prefixIn = (params['in'] ? 'inset ' : '');
    var sample, v, ci = 0, cl = altColors.length;
    var output = new Array(cl), color;
    for(;ci < cl; ci++){
        color = altColors[ci];
        sample = prefixIn + (name == 'sh' ? [ x , y, value, r, color ] : [ x , y, value, color ]).join('px ');
        v = new Array(repeatCount);
        for(i = repeatCount; i--;)v[i] = sample;
        output[ci] = v.join(', ');
    }
    var style = {};
    style[options] = output;
    set(style);
  }, {
    sh: 'boxShadow',
    tsh: 'textShadow'
  }, [
    '((r|R)(\\-?[0-9]+):r)',
    '((x|X)(\\-?[0-9]+):x)',
    '((y|Y)(\\-?[0-9]+):y)',
    '((m|M)([0-9]+):m)',
    '(c([0-9A-F]+):c)',
    '(in):in'
  ]);


/*
//font-size
@each $size in 10, 11, 12, 13, 14, 16, 17, 18, 20, 22, 24, 26, 30, 36, 40, 50, 60, 80
{ #{'.f' + $size + $suffix} { font-size:$size + px; } }
*/

/*
//border-radius
.r{border-radius: 10000px;};
@each $size in 0, 3, 4, 5, 10, 15, 20 { #{'.r' + $size} { border-radius:$size + px; } }
*/
mn((req, set, next) => {
    if(req.camel || req.negative)return next();
    var options = req.options;
    var params = req.params;
    var style = {};
    style[options.prop] = (req.num || options.val) + (params.unit || options.unit)
    set.essence({ style });
}, {
    f: {prop: 'font-size', val: 14, unit: 'px'},
    r: {prop: 'borderRadius', val: 10000, unit: 'px'}
}, [ '([a-z%]+):unit']);




/*
//z-index
@each $size in -1, 0, 1, 2 { #{'.z' + $size} { z-index:$size; } }
*/
mn((req, set, next) =>
    req.camel ? next() : set({zIndex: (req.num || '1') + (req.params.important ? '' : ' !important') }), 
[ 'z' ], [ '(-i):important' ]);


/*
.lh{line-height:1;}
//line-height
@each $size in 6, 7, 8, 9, 10, 11, 12, 13 { #{'.lh' + $size} { &, &>*{ line-height: 0.1 * $size; } } }
*/
mn((req, set, next) => {
    var num = req.num;
    req.camel ? next() : set({lineHeight: num ? (req.params.w ? (num * 0.01) : (num + 'px')) : '1' })
}, [ 'lh' ], [ '(%):w' ]);



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


  mn((req, set, next) => {
    console.log('req', req);
    if (req.negative) return next();
    var options = req.options;
    var params = req.params;
    var num = params.num;
    var camel = params.camel;
    var suffix = params.suffix;
    var unit = params.unit || 'px';

    var size = 
        (camel && camel !== suffix ? lowerCase(camel) : (num ? (num + unit) : '100%')) 
        + (params.important ? '' : ' !important');

    suffix = suffix ? (lowerCase(suffix) + '-') : '';

    var props = options.props, css = {};
    for (var i = 0, l = props.length; i < l; i++) css[suffix + props[i]] = size;
    set(css, options.priority || 0);
  }, {
    sq: {priority: 0, props: [ 'width', 'height' ]},
    w: {priority: 1, props: [ 'width' ]},
    h: {priority: 1, props: [ 'height' ]}
  }, [
    '((M|m)(in|ax)):suffix?',
    '^((\\d+):num|([A-Z][a-z]+):camel)?(\\%|vw|vh):unit?((M|m)(in|ax)):suffix?(-i):important?$'
  ]);



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
        float: 'none !important',
        display: 'table-cell',
        verticalAlign: 'middle'
    }
});

mn('cfx.pale', {
    selectors: [':before', ':after'], 
    style: {content: '" "', clear: 'both', display: 'table'}
});

mn('layout', {
    style: {
        boxSizing: 'border-box',
        display: [ '-webkit-box', '-webkit-flex', 'flex' ]
    }
});
mn('layout-row', {
    exts: [ 'layout' ],
    style: {
        '-webkit-box-direction': 'normal',
        '-webkit-box-orient': 'horizontal',
        '-webkit-flex-direction': 'row',
        'flex-direction': 'row',

        
        '-webkit-box-pack': 'start', 
        '-webkit-justify-content': 'flex-start', 
        'justify-content': 'flex-start',

        '-webkit-box-align': 'center',
        '-webkit-align-items': 'center',
        'align-items': 'center',
        '-webkit-align-content': 'center',
        'align-content': 'center'
    }
});
mn('layout-column', {
    exts: [ 'layout' ],
    style: {
        '-webkit-box-direction': 'normal',
        '-webkit-box-orient': 'vertical',
        '-webkit-flex-direction': 'column',
        'flex-direction': 'column'
    }
});



//flex horizontal align
((aligns) => {
    mn('ha(Start|Center|End|Around|Between):direction', (req, set, next) => {
        set(aligns[ lowerFirst(req.params.direction) ], 1);
    });
})({
    start: {'-webkit-box-pack': 'start', '-webkit-justify-content': 'flex-start', 'justify-content': 'flex-start'},
    center: {'-webkit-box-pack': 'center', '-webkit-justify-content': 'center', 'justify-content': 'center'},
    end: {'-webkit-box-pack': 'end', '-webkit-justify-content': 'flex-end', 'justify-content': 'flex-end'},
    around: {'-webkit-justify-content': 'space-around', 'justify-content': 'space-around'},
    between: {'-webkit-box-pack': 'justify', '-webkit-justify-content': 'space-between', 'justify-content': 'space-between'}
});

//flex vertical align
((aligns) => {
    mn('va(Start|Center|End|Stretch):direction', (req, set, next) => {
        set(aligns[ lowerFirst(req.params.direction) ], 1);
    });
})({
    start: {
        '-webkit-box-align': 'start',
        '-webkit-align-items': 'flex-start',
        'align-items': 'flex-start',
        '-webkit-align-content': 'flex-start',
        'align-content': 'flex-start'
    },
    center: {
        '-webkit-box-align': 'center',
        '-webkit-align-items': 'center',
        'align-items': 'center',
        '-webkit-align-content': 'center',
        'align-content': 'center'
    },
    end: {
        '-webkit-box-align': 'end',
        '-webkit-align-items': 'flex-end',
        'align-items': 'flex-end',
        '-webkit-align-content': 'flex-end',
        'align-content': 'flex-end'
    },
    stretch: {
        '-webkit-box-align': 'stretch',
        '-webkit-align-items': 'stretch',
        'align-items': 'stretch',
        '-webkit-align-content': 'stretch',
        'align-content': 'stretch'
    }
});



mn((req, set, next) => {
    if(req.camel || req.negative)return next();
    var important = req.params.important || '';
    var num = req.num;
    if(num){
        set({ transitionDuration: num + 'ms' + (important ? '' : '!important') });
        return;
    }
    set.essence({
        exts: [ 'dn250' + important ]
    });
}, [ 'dn' ], ['(-i):important' ] );

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

mn((req, set, next) => {
    var params = req.params;
    var value = params.value;
    if(!value)return next();
    var alts = __color(value);
    if(!params.important)alts = joinArrays([], alts, [ '!important' ]);
    var style = {};
    style[req.options] = alts;
    set(style);
}, { 
    c: 'color',
    stroke: 'stroke'
}, [ '^(([A-Z][a-z]+):camel|([A-F0-9]+):color):value(.*)(-i):important?$' ]);


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
    
mn((req, set, next) => {
  console.log('bg req', req);

  var params = req.params;
  var v = params.bg || req.suffix;
  if(req.negative || !v)return next();
  var bg = __color.getBackground(v);
  var background = bg.alts;
  if(!params.important)background = joinArrays([], background, [ '!important' ]);
  set({ background });
}, [ 'bg' ], ['^(.+):bg(-i):important?$' ]);


/*
//rotate x
@each $v in 180
{ .rot#{$v}x, .rot#{$v}x-h:hover{ @include echo( cross(transform, rotateX( $v + deg )) ); } }
//rotate y
@each $v in 90
{ .rot#{$v}y, .rot#{$v}y-h:hover{ @include echo( cross(transform, rotateY( $v + deg )) ); } }
//rotate z
@each $v in -90, -45, 0, 45, 90
{ .rot#{$v}z, .rot#{$v}z-h:hover{ @include echo( cross(transform, rotateZ( $v + deg )) ); } }
*/

	mn(({ options, value, params }, set) => {
    var suffix = params.suffix;
    set({
      transform: 'rotate' + (suffix ? upperCase(suffix) : 'X') + '(' + (value || '180') + 'deg)'
    });
	}, [ 'rot' ], [ '(x|y|z):suffix' ]);

/*
.vc#{$suffix}{&, & td, &.tbl>*, &[class*='tbl-']>*{vertical-align:middle;}}
.vt#{$suffix}{&, & td, &.tbl>*, &[class*='tbl-']>*{vertical-align:top;}}
.vb#{$suffix}{&, & td, &.tbl>*, &[class*='tbl-']>*{vertical-align:bottom;}}
*/
	mn((req, set) => {
    var v = req.options;
    if (!req.params.important) v += '!important';
    set.essence({       
      priority: 1,
      style: {
        verticalAlign: v
      } 
    })
	}, { vc: 'middle', vt: 'top', vb: 'bottom', vbase: 'baseline' }, [ '(-i):important' ]);

/*
.tl#{$suffix}{text-align:left;}
.tc#{$suffix}{text-align:center;}
.tr#{$suffix}{text-align:right;}
*/
mn((req, set, next) => {
    req.value ? next() : set({textAlign: req.options + (!req.params.important ? ' !important' : '')});
}, { tl: 'left', tc: 'center', tr: 'right'}, [ '(-i):important' ]);





/*
.lt#{$suffix},[class*='tbl']>.lt#{$suffix}{float:left !important;}
.ct#{$suffix}{margin-left:auto;margin-right:auto;}
.rt#{$suffix},[class*='tbl']>.rt#{$suffix}{float:right !important;}
*/
mn((req, set) => {
    var options = req.options;
    if(!req.params.important){
        var dst = {};
        for(var k in options)dst[k] = options[k] + ' !important';
        set(dst);
    }else{
        set(options);
    }
}, {
    lt: {float: 'left'},
    ct: {marginLeft: 'auto', marginRight: 'auto'},
    rt: {float: 'right'}
}, [ '(-i):important' ]);

/*
.wt9#{$suffix}{font-weight:900;}
.wt8#{$suffix}{font-weight:800;}
.wt7#{$suffix}{font-weight:700;}
.wt6#{$suffix}{font-weight:600;}
.wt5#{$suffix}{font-weight:500;}
.wt4#{$suffix}{font-weight:400;}
.wt3#{$suffix}{font-weight:300;}
.wt2#{$suffix}{font-weight:200;}
.wt1#{$suffix}{font-weight:100;}
*/
mn(({ options, num, camel, negative, params }, set, next) => {
    var v = num ? parseInt(num) : 9;
    if(camel || negative || v < 1 || v > 9)return next();
    set({fontWeight: 100 * v});
}, [ 'fw' ]);


/*
.overlay{
  position: absolute;
  display: block;
  top:0px;left:0px;right:0px;bottom:0px;
}
*/
mn((req, set, next) => {
    if(req.camel)return next();
    var v = (req.num || '0') + (req.params.w || 'px');
    set({
        display: 'block',
        position: 'absolute',
        top: v, left: v, right: v, bottom: v
    });
}, [ 'overlay' ], [ '((%):w)?' ]);

/*
%hide{
  @include duration(.25s);
  @include echo( cross(pointer-events, none) );
  @include opacity(0);
  z-index:-1;
}
%show{
  @include duration(.25s);
  @include echo( cross(pointer-events, auto) );
  @include opacity(1);
  z-index:1;
}
*/

	mn('xHide', {
    exts: [ 'dn' ],
    style: {
      pointerEvents: 'none',
      opacity: 0,
      zIndex: -1
    }
	});
	mn('xShow', {
    exts: [ 'dn' ],
    priority: 1,
    style: {
      pointerEvents: 'auto',
      opacity: 1,
      zIndex: 1
    }
	});

/*
//opacity
.o,.o-h:hover{ @include opacity(0); }
.no-o,.no-o-h:hover{ @include opacity(1); }
@each $size in 50, 70, 90 {
  #{'.o' + $size}, #{'.o' + $size + '-h:hover'} { @include opacity( 0.01 * $size ); }
}
*/
	mn((req, set, next) => {
    if (req.camel || req.negative) return next();
    set({ opacity: (req.num || 0) * 0.01 });
	}, [ 'o' ]);


/*
.noSelect{ @include echo( cross(user-select, none) ); }
.select{ @include echo( cross(user-select, initial) ); }
.noEvent{ @include echo( cross(pointer-events, none) ); }
.event{ @include echo( cross(pointer-events, auto) ); }
*/

	mn((req, set, next) => {
    if (req.num) return next();
    var style = {};
    style[req.options] = lowerCase(req.camel || 'initial') + ' !important';
    set.essence({ style });
	}, {
    e: 'pointerEvents',
    select: 'userSelect'
	});

/*
.blur{ @include echo( cross( filter, blur(4px) ) ); }
*/
mn((req, set, next) => {
    req.camel || req.negative ? next() : set({filter: 'blur(' + (req.value || '4') + 'px)'});
}, [ 'blur' ]);


mn('col([0-9]+):space?(/([0-9]+):from)?(min):min?(-i):i?', (req, set, next) => {
    if(req.negative)return next();
    var params = req.params;
    var from = params.from || 12;
    var space = params.space || 1;
    var width = (100 * space / from) + '%';
    var style = {minHeight: '1px'};
    if (params.min) {
        style.minWidth = width;
    } else {
        style.width = width;
    }
    if(!params.i){
        for(var k in style)style[k] += ' !important';
    }
    set.essence({ style });

});


/*
.overflow{overflow:hidden;}
.overflowX{overflow-x:hidden;}
.overflowY{overflow-y:hidden;}
.scrollX{overflow-x:scroll;}
.scrollY{overflow-y:scroll;}
.autoX{overflow-x:auto;}
.autoY{overflow-y:auto;}
*/
mn((req, set, next) => {
    var camel = req.camel;
    if(!camel)return next();
    var d = req.params.d;
    var prop = 'overflow';
    var priority = 0;
    if(d){
        prop += ('-' + lowerCase(d));
        priority++;
    }
    var style = {};
    style[prop] = lowerCase(camel);
    set(style, priority);
}, [ 'ov' ], [ '([XxYy]):d' ]);



/*
//border
@each $key, $value in (
    (1, solid 1px #eee),
(2, solid 1px #fff),
(3, solid 1px #ddd)
)
{ @include side-focus('.b' + $key, border, $value); }


/*
.dotted{border-style: dotted;}
.dashed{border-style: dashed;}
.solid{border-style: solid;}
*/
mn((req, set, next) => {
    var camel = req.camel;
    if(!camel)return next();
    var params = req.params;
    set.essence(mnWrapSides('border', params.side, lowerCase(camel) + 
        (!params.important ? ' !important' : ''), '-style')) ;
}, [ 'bs' ], [ '^[A-Z][a-z]+([A-Za-z]+):side?(.*)(-i):important?$' ]);

/*
//border-color
@each $key, $value in (
    (1, transparent),
)
{ @include side-focus('.bc' + $key, border, $value, '-color'); }
*/

mn((req, set, next) => {
    var params = req.params;
    var value = params.value;
    if(!value)return next();
    var alts = __color(value);
    if(!params.important)alts = joinArrays([], alts, [ ' !important' ]);
    var data = mnWrapSides('border', lowerCase(params.side), alts, '-color');
    var style = data.style;
    if(req.options == 2)style.color = alts;
    set.essence(data);
}, {
    bc: 1, cc: 2
}, [ '^(([A-Z][a-z]+):camel|([A-F0-9]+):color):value([A-Za-z]+):side?(.*)(-i):important?$' ]);



//flex-direction
mn((req, set, next) => {
    var suffix = req.suffix;
    if(!suffix)return next();
    var important = req.params.important;
    var importantSuffix = important ? '' : ' !important';
    if(important)suffix = suffix.substr(0, suffix.length - important.length);
    var style = {};
    style[req.options] = kebabCase(suffix) + importantSuffix;
    set(style); 
}, {
    fd: 'flex-direction',
    fs: 'font-style',
    jc: 'justify-content',
    ai: 'align-items',
    tt: 'text-transform',
    td: 'text-decoration',
    to: 'text-overflow',
    cr: 'cursor',
    ol: 'outline',
    ws: 'white-space',
    v: 'display'
}, [ '(-i):important' ]);



//other... example: border-collapse: separate; -> $borderCollapse_separate
(() => {
    var regexp = /^\$([^\$].+[^_])$/;
    mn((req, set, next) => {
        var path = req.path || '';
        var macths = regexp.exec(path);
        if(!macths)return next();
        var parts = macths[1].split('_');
        if(parts.length < 2)return next();
        var property = parts.shift(), value = parts.join(' ');
        var style = {};
        style[property] = value;
        set(style); 
    });

})();


mn((req, set, next) => {
    if(req.negative || req.camel)return next();
    var options = req.options;  
    var params = req.params;
    var paddingTop = 'calc(' + (params.v || '100') + '% ' + (params.sign || '+') + ' ' + (params.calc || '0') + 'px)' + (params.important ? '' : ' !important');

    set.essence({
        style: {
            position: 'relative',
            paddingTop: paddingTop
        },
        childs: {
            overlay: {
                selectors: [ '>*' ],
                style: {
                    position: 'absolute',
                    top: '0px',
                    bottom: '0px',
                    left: '0px',
                    right: '0px'
                }
            }
        }
    });
}, [ 'ratio' ], [ '(\\d+):v?(([-+]):sign(\\d+):calc)?(-i):important?' ]);


};