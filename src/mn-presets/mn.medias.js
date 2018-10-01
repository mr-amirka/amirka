/**
 * @overview MinimalistNotation preset "default medias"
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

module.exports = (mn) => {
  const media = mn.media;
  [
    [ 'sm', '(max-width: 991px)' ],
    [ 'sm-md', '(min-width: 768px) and (max-width: 991px)' ],
    [ 'xs', '(max-width: 767px)' ],
    [ 'xs-sm', '(min-width: 480px) and (max-width: 767px)' ],
    [ 'xv', '(max-width: 639px)' ],
    [ 'xm', '(max-width: 479px)' ],
    [ 'xm-xs', '(min-width: 360px) and (max-width: 479px)' ],
    [ 'mm', '(max-width: 359px)' ],
    [ 'md', '(min-width: 992px)' ],
    [ 'md-lg', '(min-width: 992px) and (max-width: 1199px)' ],
    [ 'lg', '(min-width: 1200px)' ],
    [ 'lg-ll', '(min-width: 1200px) and (max-width: 1559px)' ],
    [ 'll', '(min-width: 1600px)' ],
    [ 'pt', 'print' ]
  ].forEach((v, i) => media[v[0]] = {query: v[1], priority: i});
};
