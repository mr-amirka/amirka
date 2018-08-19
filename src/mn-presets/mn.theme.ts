
export const mnTheme = (mn: any) => {
  
  /*
  TODO: добавить медиа-запросы в сами эссенции стилей
  mn('row', {
    include: [ 'cfx' ],
    style: {
      marginLeft: '-15px',
      marginRight: '-15px'
    },
    media: {
      sm: {
        style: {
          marginLeft: '-10px',
          marginRight: '-10px'
        }
      }
    }
  });

  mn('col', {
    inited: false,
    style: {
      paddingLeft: '10px',
      paddingRight: '10px'
    }
  });
  */

  /*
  TODO: добавить в ассоциирования имен эссенций с селекторами
    парсингом выражений нотации целиком 

  mn.assign([ '(mh-15|mh-10@sm)' ], [ '[m~=row]' ]);
  mn.assign([ 'ph15|ph10@sm)' ], [ '[m~=lay]' ]);
  */
  
  mn.css({
    '*, *:before, *:after': {
      boxSizing: 'border-box'
    },
    x: {
      display: 'block'
    },
    html: {
      '-ms-text-size-adjust': '100%',
      '-webkit-text-size-adjust': '100%',
      '-webkit-tap-highlight-color': '#000',
      position: 'relative'
    }
  });


  /*  
  const assign = mn.assign;

  [
    [ [ 'crPointer-i', 'olNone-i', 'dn-i', 'tdNone-i' ], [ 'a' ] ],
    [ [ 'mb5-i' ], [ 'p' ] ]
    //,[ [ 'bgE', 'cF', 'm0', 'p0', 'ovxHidden' ], [ 'body' ] ]
  ].forEach(([ essenseNames, selectors ]) => assign(essenseNames, selectors));

  */

  /*
   
  TODO: изменить порядок следования аргументов
    добавить взможность принимать строки вместо массивов строк
  mn.assign('[m~="container"]', '(mhAuto-i|ph10-i|w970-i@md|w1170-i@lg|w1570-i@ll)');
  */

  /*
  mn({
    ffTheme: {
      style: {
        fontFamily: "'Exo Two', 'Open Sans', 'Roboto', Arial, sans-serif"
      }
    },
    xs: {
      exts: [ 'vInline', 'cRed' ]
    }

  });

  */


};