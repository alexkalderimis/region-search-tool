define([
    'react',
    'lodash/objects/values',
    'lodash/arrays/compact',
    'lodash/collections/contains',
    'lodash/objects/isEmpty',
    './mixins',
    './multi-action-button',
    './input-group',
    './type-controls'
    ], function (React, values, compact, contains, isEmpty, mixins, MultiActionButton, InputGroup, TypeControls) {

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
        {className: 'container-fluid region-toolbar'},
        d.div(
          {className: 'row'},
          d.div(
            {className: 'col-sm-9 btn-toolbar'},
            this.renderTypeControls(),
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
                d.span(
                  {className: 'visible-lg visible-xl'},
                  'Download ', state.selectedCount, ' features as '),
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
                d.span(
                  {className: 'visible-lg visible-xl'},
                  ' of ', state.selectedCount, ' features')),
              options: ['list', 'table'].map(function (action) {
                return d.a(
                  {
                    select: that.setStateProperty.bind(that, 'actionType', action),
                    selected: state.actionType === action
                  }, (action === 'list') ? "Make list" : "View table");
              })
            })),
          InputGroup({
            className: 'col-sm-3',
            name: 'filter',
            onChange: this.props.changeFilter,
            model: this.props.filter
          })));
    },

    _doAction: function () {
      var state = this.state;
      var message = {
        what: state.actionType,
        data: {request: {query: state.actionQuery}}
      };
      if (state.actionType === 'list') {
        message.data.request.query.select = ['id'];
      }

      this.props.wants(message);
    },

    _export: function () {
      // TODO: perform export.
    },

    _setActionQuery: function (props, allPlease, model) {
      try {
      var service = props.service;
      var selected = props.selected;
      var regions = props.regions;
      var regionOf = props.regionOf;
      var typeOf = props.typeOf;
      var totals = props.totals;
      var from = model.findCommonType(props.types);

      var actionQuery = { // The query to run when call by doAction.
        from: from,
        select: [
          'name', 'symbol', 'secondaryIdentifier',
          'organism.name',
          'chromosomeLocation.*'],
        constraints: [
          ['organism.shortName', '=', props.organism],
          [from, 'ISA', props.types]
        ]
      };
      if (allPlease) {
        actionQuery.constraints.push([
            'chromosomeLocation', 'OVERLAPS', regions
        ]);
      } else {
        var selectedRegions = Object.keys(selected).filter(function (thing) {
          return selected[thing] && regions.indexOf(thing) >= 0;
        });
        if (selectedRegions.length) {
          actionQuery.constraints.push([
              'chromosomeLocation', 'OVERLAPS', selectedRegions
          ]);
        }
        var selectedIds = Object.keys(selected).filter(function (thing) {
          return selected[thing] && typeOf[thing] && !contains(selectedRegions, regionOf[thing]);
        });
        if (selectedIds.length) {
          actionQuery.constraints.push({
            path: from,
            op: 'IN',
            ids: selectedIds
          });
        }

        if (selectedRegions.length && selectedIds.length) {
          actionQuery.constraintLogic = 'A and B and (C or D)';
        }

      }

      if (props.filter && !/^\s*$/.test(props.filter)) {
        actionQuery.constraints.push([from, 'LOOKUP', props.filter]);
        if (actionQuery.constraintLogic) {
          actionQuery.constraintLogic += ' and E';
        }
      }

      if (JSON.stringify(this.state.actionQuery) !== JSON.stringify(actionQuery)) {
        this.setStateProperty('actionQuery', actionQuery);
      }
      } catch (e) {
        console.error(String(e), e);
      }
    },

    computeState: function (props) {
      var selected = props.selected;
      var regions = props.regions;
      var regionOf = props.regionOf;
      var typeOf = props.typeOf;
      var totals = props.totals;
      var allPlease = (selected.all || isEmpty(compact(values(selected))));

      props.modelPromise.then(this._setActionQuery.bind(this, props, allPlease));

      var selectedCount;

      if (allPlease) {
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
        return props.activeTypes[props.allTypes.indexOf(typeOf[thing])];
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
    }

  });

  return ToolBar;
});
