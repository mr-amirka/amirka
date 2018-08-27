
export const mnTheme = (mn: any) => {
  
  const assign = mn.assign;

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
      

  [
    [ 
      [ 
        'crPointer-i', 'olNone-i', 'dn-i', 'cInitial-i', 
        'tdNone-i'
      ],
      [ 'a' ] 
    ]
  ].forEach(([ essenseNames, selectors ]) => assign(essenseNames, selectors));

};