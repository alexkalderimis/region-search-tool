(function () {

// main.js
var loc = '../';
require.config({
    baseUrl: 'js',
    paths: {
        jquery:     loc + 'bower_components/jquery/dist/jquery',
        q:          loc + 'bower_components/q/q',
        bootstrap:  loc + 'bower_components/bootstrap/dist/js/bootstrap.min',
        react:      loc + 'bower_components/react/react-with-addons', 
        jschannel:  loc + 'bower_components/jschannel/src/jschannel',
        imjs:       loc + 'bower_components/imjs/js/im'
    },
    'packages': [
      {
        name: 'lodash',
        location: loc + 'bower_components/lodash-amd/modern'
      },
      {
        name: 'underscore',
        location: loc + 'bower_components/lodash-amd/'
      }
    ],
    shim: {
        bootstrap: {
          deps: ['jquery'],
          exports: '$'
        },
        jschannel: {
          exports: 'Channel'
        },
        react: {
            exports: 'React',
        }
    }
});

require(['react', 'imjs', 'region-search', 'bootstrap'], function (React, imjs, Main) {
  'use strict';

  var sessionRequest = new XMLHttpRequest();
  sessionRequest.onload = withSession;
  sessionRequest.open('GET', "http://www.flymine.org/query/service/session", true);
  sessionRequest.responseType = 'json';
  sessionRequest.send();

  function withSession (e) {

    var options = {};

    options.regions = [
      '2L:14615455..14619002',
      '2R:5866646..5868384',
      '3R:2578486..2580016'
    ];
    options.types = ['Gene', 'Intron', 'Exon'];
    options.organism = 'D. melanogaster';
    options.service = imjs.Service.connect({
      root: 'http://www.flymine.org/query/service',
      token: sessionRequest.response.token
    });
    options.want = wants;
    options.has = has;

    console.log(options, Main);

    try {
      React.renderComponent(Main(options), document.body);
    } catch (e) {
      console.error(e, e.stack);
    }
  }
});


function wants (message) {
  console.log("WANT", message);
}
function has (message) {
  console.log("HAS", message);
}

})();
