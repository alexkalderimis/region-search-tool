define([
    'react',
    'lodash/objects/values',
    'lodash/arrays/compact',
    'lodash/objects/isEmpty',
    './mixins'], function (React, values, compact, isEmpty, mixins) {

  'use strict';

  var d = React.DOM;

  var ToolBar = React.createClass({

    displayName: 'ToolBar',

    mixins: [mixins.ComputableState, mixins.SetStateProperty],

    getInitialState: function () {
      return {exportFormat: 'fasta', selectedCount: 0};
    },

    render: function () {
      var props = this.props;
      var that = this;
      var state = this.state;
      return d.div(
          {className: 'btn-toolbar'},
          this.renderTypeControls(),
          d.div(
            {className: 'btn-group'},
            d.button(
              {
                onClick: props.toggleSelected.bind(null, 'all'),
                className: 'btn btn-default' + (props.selected.all ? ' active' : '')
              },
              "Select all")),
          d.div(
            {className: 'btn-group'},
            d.button(
              {className: 'btn btn-primary'},
              'Download ',
              this.state.selectedCount,
              ' features as ', d.strong(null, state.exportFormat)),
            d.button(
              {className: 'btn btn-primary dropdown-toggle', 'data-toggle': 'dropdown'},
              d.span({className: 'caret'}),
              d.span({className: 'sr-only'}, "toggle dropdown")),
            d.ul(
              {className: 'dropdown-menu'},
              ['fasta', 'gff3', 'json', 'xml'].map(function (fmt) {
                return d.li(
                  {
                    key: fmt,
                    onClick: that.setStateProperty.bind(that, 'exportFormat', fmt), 
                    className: state.exportFormat === fmt ? 'active' : ''
                  }, d.a(null, fmt));
              }))));
    },

    computeState: function (props) {
      var selected = props.selected;
      var regions = props.regions;
      var regionOf = props.regionOf;
      var typeOf = props.typeOf;
      var totals = props.totals;

      var selectedCount;

      if (selected.all || isEmpty(compact(values(selected)))) {
        selectedCount = totals.reduce(function (a, b) { return a + b; }, 0);
      } else {
        selectedCount = regions.reduce(function (total, region) {
          if (selected[region]) {
            return total + totals[regions.indexOf(region)];
          } else {
            return total + numSelectedInRegion(region);
          }
        }, 0);
      }

      this.setStateProperty('selectedCount', selectedCount);

      function numSelectedInRegion (region) {
        return Object.keys(selected).filter(function (thing) {
          return selected[thing] && isActive(thing) && regionOf[thing] === region;
        }).length;
      }

      function isActive (thing) {
        return props.activeTypes[props.types.indexOf(typeOf[thing])];
      }
    },

    renderTypeControls: function () {
      var that = this;
      var activeTypes = this.props.activeTypes;
      var names = this.props.typeNames;
      if (names.length < 5) {
        return d.div(
            {className: 'btn-group'},
            names.map(makeButton));
      } else {
        return d.div(
            {className: 'btn-group'},
            d.button(
              {className: 'btn btn-default dropdown-toggle', 'data-toggle': 'dropdown'},
              names.length,
              ' types',
              d.span({className: 'caret'})),
            d.ul(
              {className: 'dropdown-menu'},
              names.map(makeLi)));
      }

      function makeButton (name, i) {
        return d.button(
          {
            key: i,
            ref: name,
            onClick: that.toggleType.bind(null, name, i),
            className: 'btn btn-default' + (activeTypes[i] ? ' active' : '')
          }, name);
      }

      function makeLi (name, i) {
        return d.li(
          {
            key: i,
            ref: name,
            onClick: that.toggleType.bind(null, name, i),
            className: activeTypes[i] ? 'active' : ''
          }, d.a(null, name));
      }
    },

    toggleType: function (name, index) {
      this.props.toggleType(index);
      this.refs[name].getDOMNode().blur();
    }

  });

  return ToolBar;
});
