var env = require('jsdoc/env'),
    path = require('path'),
    fs = require('fs'),
    _ = require('underscore');

exports.handlers = {
    parseComplete: function (e) {
        var src = env.opts._.map(function (src) { return path.join(env.pwd, src); }),
          destinationPath = path.join(env.opts.destination, 'angular.jsdoc.search.data.js'),
          destinationDir = path.dirname(destinationPath),
          fd, data;

        // Ensure destination directory exists
        if (!fs.existsSync(destinationDir)) {
            fs.mkdirSync(destinationDir, { recursive: true });
        }

        data = e.doclets.filter(function(doclet) {
          // Exclude @ignore doclets so they don't appear in search (e.g. Props typedef)
          if (doclet.ignore) {
            return false;
          }
          // Include all documented items except standalone members (members that aren't properties of types/interfaces)
          // Properties of interfaces/types should be included even though they have kind 'member'
          if (doclet.undocumented) {
            return false;
          }
          
          // Include members that are properties of interfaces/types (they have memberof)
          if (doclet.kind === 'member' && doclet.memberof) {
            return true;
          }
          
          // Include all other documented items (classes, interfaces, functions, etc.)
          return doclet.kind !== 'member';
        });

        // Add href to each doclet so the frontend can link to the correct JSDoc output file.
        // Only link to canonical .html pages (e.g. Processor.html, global.html#BlankPDFConfiguration),
        // never to source .js.html files (e.g. lib_configuration_PDFConfiguration.js.html).
        // - Top-level classes, interfaces, etc. get their own {longname}.html.
        // - Top-level typedefs and other globals live on global.html#longname.
        // - Members and the rest link to their parent's page: {memberof}.html or the first segment of longname.
        data.forEach(function(doclet) {
          var longname = doclet.longname;
          if (longname) {
            if (['class', 'interface', 'module', 'namespace', 'mixin', 'external'].indexOf(doclet.kind) >= 0 && longname.indexOf('.') < 0) {
              doclet.href = longname + '.html';
            } else if (longname.indexOf('.') < 0 && longname.indexOf('#') < 0 && longname.indexOf('~') < 0) {
              doclet.href = 'global.html#' + longname;
            } else if (!doclet.href && (doclet.memberof || longname.indexOf('.') >= 0 || longname.indexOf('#') >= 0 || longname.indexOf('~') >= 0)) {
              var base = (doclet.memberof || longname.split(/[.#~]/)[0]) + '.html';
              var memberName = doclet.name || longname.split(/[.#~]/).pop();
              doclet.href = base + (memberName ? '#' + '.' + memberName : '');
            }
          }
        });

        // Expand @property members from interfaces/typedefs into searchable doclets so e.g.
        // "documentPassword" in PDFConfiguration can be found. JSDoc stores these in
        // doclet.properties but does not emit separate doclets. Each virtual doclet links
        // to the parent's page (e.g. PDFConfiguration.html).
        var expanded = [];
        data.forEach(function(doclet) {
          expanded.push(doclet);
          // Don't expand properties for @ignore doclets (they're already excluded above, but skip expansion if any slip through)
          if (doclet.ignore) {
            return;
          }
          var props = doclet.properties;
          if (props && Array.isArray(props) && props.length > 0) {
            var parentLongname = doclet.longname || doclet.name;
            var parentHref = doclet.href || (parentLongname ? parentLongname + '.html' : 'global.html');
            if (parentLongname) {
              for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                if (prop && prop.name) {
                  var propHref = parentHref + (prop.name ? '#' + '.' + prop.name : '');
                  expanded.push({
                    name: prop.name,
                    longname: parentLongname + '.' + prop.name,
                    kind: 'member',
                    memberof: parentLongname,
                    href: propHref
                  });
                }
              }
            }
          }
        });
        data = expanded;

        fd = fs.openSync(destinationPath, 'w');
        fs.writeSync(fd, 'angular.module("search").constant("SEARCH_DATA", ');
        fs.writeSync(fd, JSON.stringify({ src: src, data: data }));
        fs.writeSync(fd, ');');
        fs.closeSync(fd);
    }
};
