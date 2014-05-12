define(['react', 
    'q',
    'lodash/arrays/zipObject',
    './mixins',
    './region',
    './toolbar'
    ], function (React, Q, zipObject, mixins, Region, ToolBar) {
  'use strict';

  var d = React.DOM;

  var Main = React.createClass({

    displayName: 'Main',

    mixins: [mixins.SetStateProperty, mixins.ComputableState],

    getInitialState: function () {
      return {
        totals: this.props.regions.map(always(0)),
        activeTypes: zipObject(this.props.types.map(function (_, i) { return [i, true]; })),
        typeNames: this.props.types
      };
    },

    render: function () {
      var that = this;
      var title = this._getTitle();
      var activeTypes = this.state.activeTypes;
      var props = this.props;
      var types = props.types.filter(function (t, i) { return activeTypes[i]; });
      console.log(types, activeTypes);
      return d.div(
        null,
        d.div(
          {className: 'page-header'},
          d.h1(
            null,
            this.state.totals.reduce(add, 0),
            ' ',
            title,
            d.small(null, " found in ", props.organism))),
        ToolBar({activeTypes: activeTypes, typeNames: this.state.typeNames, toggleType: this.toggleType}),
        d.ul(
          {className: 'list-group'},
          this.props.regions.map(function (region, i) {
            return Region({
              key: region,
              className: 'list-group-item',
              region: region,
              service: props.service,
              types: types, 
              onCount: that.onCount.bind(that, i),
              organism: props.organism
            });
          })));
    },

    onCount: function (index, n) {
      var state = this.state;
      if (state.totals[index] !== n) {
        state.totals[index] = (n || 0);
        this.setState(state);
      }
    },

    computeState: function (props) {
      props.service.fetchModel().then(nameTypes).then(this.setStateProperty.bind(this, 'typeNames'));

      function nameTypes (model) {
        return Q.all(props.types.map(function (type) {
          return model.makePath(type).getDisplayName();
        }));
      }
    },

    toggleType: function (index) {
      var activeTypes = this.state.activeTypes;
      activeTypes[index] = !activeTypes[index];
      this.setStateProperty('activeTypes', activeTypes);
    },

    _getTitle: function () {
      var names = this.state.typeNames.map(function (n) { return n + 's'; });
      if (names.length >= 3) {
        var last = names.pop();
        return names.join(', ') + ' and ' + last;
      } else {
        return names.join(' and ');
      }
    }
  });

  return Main;

  function add (a, b) {
    return a + b;
  }

  function always (value) {
    return function () { return value; };
  }
});
