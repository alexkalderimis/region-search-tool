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

require(['react', 'q', 'imjs', 'predicates', '../js/enrichment-controls'],
    function (React, Q, imjs, predicates, Controls) {
    'use strict';

    var listName = "PL FlyAtlas_tubules_top";
    var url = "http://beta.flymine.org/beta";
    var rootNode = document.body;
    var service = imjs.Service.connect({root: url});

    var fetchingList = service.fetchList(listName);
    var fetchingWidgets = service.fetchWidgets();
    var isEnrichment = predicates.eq('widgetType', 'enrichment');
    
    Q.spread([fetchingList, fetchingWidgets], function (list, widgets) {
      var enrichmentWidgets = widgets.filter(isEnrichment);
      var controls = Controls({
        service: service,
        list: list,
        onChange: console.log.bind(console, 'changed'),
        correction: 'Benjamini-Hochberg',
        maxp: 0.05,
        backgroundPopulation: null,
        listPromise: service.fetchLists(),
        widgets: enrichmentWidgets
      });
      React.renderComponent(controls, rootNode);
    });

});
