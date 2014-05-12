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
    'package': [
      {
        name: 'lodash',
        location: loc + 'bower_components/lodash/'
      },
      {
        name: 'underscore',
        location: loc + 'bower_components/lodash/'
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

require(['react', 'imjs', './main', 'jschannel', 'bootstrap'], function (React, imjs, Main, Channel) {
  'use strict';

  // Connect to the parent window and listen for life-cycle events.
  var chan = Channel.build({
    window: window.parent,
    origin: '*',
    scope: 'CurrentStep'
  });

  chan.bind('init', onInit);

  chan.bind('style', loadStyle);
  
  function onInit (trans, params) {
    if (!params || !params.request || !params.service) {
      return trans.error("Bad parameters. 'request' and 'service' are required");
    }

    var options = {};

    options.regions = params.request.regions;
    options.types = params.request.types;
    options.service = imjs.Service.connect(params.service);
    options.want = wants;
    options.has = has;

    React.renderComponent(Main(options), document.body);

    return 'ok';
  }

  function loadStyle (trans, params) {

    var head = document.getElementsByTagName("head")[0];
    var link = document.createElement('link');

    link.rel = "stylesheet";
    link.href = params.stylesheet;

    head.appendChild(link);
  }

  function wants (message) {
    chan.notify({method: 'wants', params: message});
  }

  function has (message) {
    chan.notify({method: 'has', params: message});
  }

});
