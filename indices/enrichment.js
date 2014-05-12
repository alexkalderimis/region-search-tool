// main.js
require.config({
    baseUrl: '/js',
    paths: {
        jquery: '/bower_components/jquery/dist/jquery',
        q: '/bower_components/q/q',
        underscore: '/bower_components/underscore/underscore',
        bootstrap: '/bower_components/bootstrap/dist/js/bootstrap.min',
        react: '/bower_components/react/react-with-addons', 
        jschannel: '/bower_components/jschannel/src/jschannel',
        imjs:  '/bower_components/imjs/js/im'
    },
    shim: {
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
          deps: ['jquery'],
          exports: '$'
        },
        jschannel: {
          exports: 'Channel'
        },
        underscore: {
            deps: [
            ],
            exports: '_'
        },
        react: {
            exports: 'React',
        }
    }
});

require(['react', 'imjs', 'enrichment-tab'], function (React, imjs, View) {
    'use strict';

    var listName = "PL FlyAtlas_tubules_top";
    var url = "http://beta.flymine.org/beta";
    var rootNode = document.body;
    var service = imjs.Service.connect({root: url});

    service.fetchList(listName).then(function showList (list) {
      var listView = new View({
        service: service,
        list: list,
        widgetPromise: service.fetchWidgets()
      });
      React.renderComponent(listView, rootNode);
    });

});
