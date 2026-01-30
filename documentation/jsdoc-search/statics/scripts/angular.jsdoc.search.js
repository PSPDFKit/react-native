angular
  .module('search', ['angucomplete-alt'])
  .controller('SearchController', ['SEARCH_DATA', '$window', function (searchData, $window) {
      var me = this;

      me.docs = searchData.data;
      me.src = searchData.src;

      me.search = function (selected) {
          var doc, path, url;

          if (selected) {
              doc = selected.originalObject;
              if (doc.href) {
                  $window.location = doc.href;
                  return;
              }
              if (!doc.meta || !doc.meta.path) { return; }
              me.src.forEach(function (src) {
                  if (src[src.length - 1] === '/') { src = src.slice(0, src.length - 1); }
                  if (doc.meta.path.indexOf(src) === 0) {
                      path = doc.meta.path.slice(src.length);
                  }
              });
              if (path !== undefined) {
                  url = path.split('/').concat([doc.meta.filename]).filter(function (p) { return p; }).join('_') + '.html#line' + (doc.meta.lineno || 1);
                  if (url.indexOf('.js.html') === -1) {
                      $window.location = url;
                  }
              }
          }
      };
  }]);
