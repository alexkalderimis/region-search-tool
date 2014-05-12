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
        typeNames: this.props.types.slice(),
        regionOf: {},
        typeOf: {},
        selected: {}
      };
    },

    render: function () {
      var that = this;
      var title = this._getTitle();
      var activeTypes = this.state.activeTypes;
      var props = this.props;
      var types = props.types.filter(function (t, i) { return activeTypes[i]; });
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
        ToolBar({
          activeTypes: activeTypes,
          types: props.types,
          totals: this.state.totals.slice(),
          regions: this.props.regions,
          typeNames: this.state.typeNames,
          toggleType: this.toggleType,
          regionOf: this.state.regionOf,
          typeOf: this.state.typeOf,
          selected: this.state.selected,
          toggleSelected: this._toggleSelected
        }),
        d.ul(
          {className: 'list-group'},
          this.props.regions.map(function (region, i) {
            return Region({
              key: region,
              className: 'list-group-item',
              region: region,
              service: props.service,
              types: types, 
              selected: that.state.selected,
              toggleSelected: that._toggleSelected,
              foundFeatures: that._foundFeatures.bind(that, region),
              onCount: that.onCount.bind(that, i),
              organism: props.organism
            });
          })));
    },

    _foundFeatures: function (region, features) {
      var state = this.state;
      var regionOf = state.regionOf;
      var typeOf = state.typeOf;
      var changed = false;
      features.forEach(function (feature) {
        var id = feature.objectId;
        if (regionOf[id] !== region) {
          changed = true;
          regionOf[id] = region;
        }
        if (typeOf[id] !== feature['class']) {
          changed = true;
          typeOf[id] = feature['class'];
        }
      });
      if (changed) {
        this.setState(state);
      }
    },

    _toggleSelected: function (what) {
      var state = this.state;
      state.selected[what] = !state.selected[what];
      this.setState(state);
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
