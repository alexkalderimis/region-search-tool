define([
    'react',
    'lodash/objects/values',
    'lodash/arrays/compact',
    'lodash/objects/isEmpty',
    './mixins',
    './multi-action-button',
    './input-group',
    './type-controls'
    ], function (React, values, compact, isEmpty, mixins, MultiActionButton, InputGroup, TypeControls) {

  'use strict';

  var d = React.DOM;

  var ToolBar = React.createClass({

    displayName: 'ToolBar',

    mixins: [mixins.ComputableState, mixins.SetStateProperty],

    getInitialState: function () {
      return {exportFormat: 'fasta', actionType: 'list', selectedCount: 0};
    },

    render: function () {
      var props = this.props;
      var that = this;
      var state = this.state;
      return d.div(
          {className: 'btn-toolbar'},
          this.renderTypeControls(),
          InputGroup({
            className: 'pull-right',
            name: 'filter',
            onChange: this.props.changeFilter,
            model: this.props.filter
          }),
          d.div(
            {className: 'btn-group'},
            d.button(
              {
                onClick: props.toggleSelected.bind(null, 'all'),
                className: 'btn btn-default' + (props.selected.all ? ' active' : '')
              },
              "Select all")),
          MultiActionButton({
            act: this._export,
            mainAction: d.span(
              {},
              'Download ', state.selectedCount, ' features as ',
              d.strong(null, state.exportFormat)),
            options: ['fasta', 'gff3', 'json', 'xml'].map(function (fmt) {
              return d.a(
                {
                  select: that.setStateProperty.bind(that, 'exportFormat', fmt),
                  selected: state.exportFormat === fmt
                }, fmt);
            })
          }),
          MultiActionButton({
            act: this._doAction,
            mainAction: d.span(
              {},
              d.strong(null, (state.actionType === 'list' ? 'Make list' : 'View table')),
              ' of ', state.selectedCount, ' features'),
            options: ['list', 'table'].map(function (action) {
              return d.a(
                {
                  select: that.setStateProperty.bind(that, 'actionType', action),
                  selected: state.actionType === action
                }, (action === 'list') ? "Make list" : "View table");
            })
          }));
    },

    _doAction: function () {
      // TODO: signal intention to make list.
    },

    _export: function () {
      // TODO: perform export.
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

      if (this.state.selectedCount !== selectedCount) {
        this.setStateProperty('selectedCount', selectedCount);
      }

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
      return TypeControls({
        activeTypes: this.props.activeTypes,
        typeNames: this.props.typeNames,
        toggleType: this.toggleType
      });
    },

    toggleType: function (name, index) {
      this.props.toggleType(index);
      this.refs[name].getDOMNode().blur();
    }

  });

  return ToolBar;
});
