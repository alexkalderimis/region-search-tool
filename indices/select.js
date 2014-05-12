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

require(['react', 'select-input'], function (React, Select) {
    'use strict';

    var d = React.DOM;

    var rootNode = document.body;

    var daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    var main = React.createClass({

      displayName: 'Main',

      getInitialState: function () {
        return {day: 'Monday'}
      },

      render: function () {
        return d.div(
          null,
          d.strong(null, "Currently selected: ", (this.state.day || d.em(null, 'None'))),
          d.form(
            {className: 'form'},
            d.div(
              {className: 'form-group'},
              d.label(null, 'Choose a day'),
              Select({
                options: daysOfTheWeek,
                selected: this.state.day,
                onChange: this._chooseDay
              }))));
      },

      _chooseDay: function (day) {
        this.setState({day: day});
      }
    });

    React.renderComponent(main(), rootNode);

});
