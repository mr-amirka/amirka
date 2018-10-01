
module.exports = (mn) => {

  mn.css({
    '*, *:before, *:after': {
      boxSizing: 'border-box'
    },
    html: {
      '-ms-text-size-adjust': '100%',
      '-webkit-text-size-adjust': '100%',
      '-webkit-tap-highlight-color': '#000'
    }
  });

  mn.assign({
    body: 'm0'
  });

  //mn.assign('[m~="container"]', '(mhAuto-i|ph10-i|w970-i@md|w1170-i@lg|w1570-i@ll)');

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
