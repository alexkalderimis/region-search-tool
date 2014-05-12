define(['react', 'q', 'lodash/collections/sortBy', 'lodash/utilities/property', './mixins'],
    function (React, Q, sortBy, property, mixins) {
  'use strict';

  var d = React.DOM;

  var headers = ['Feature', 'Type', 'Location'];
  var accessors = {
    Feature: featureIdent,
    Type: property('class'),
    Location: featureLocation
  };

  var queryCache = {};

  var Region = React.createClass({

    displayName: 'Region',

    getInitialState: function () {
      return {
        selected: {},
        sorting: {},
        results: []
      };
    },

    mixins: [mixins.SetStateProperty, mixins.ComputableState],

    render: function () {
      var that = this;
      return d.li(
        {className: this.props.className},
        d.button(
          {
            onClick: this._select.bind(this, 'all'),
            className: 'pull-right btn btn-default' + (this.state.selected.all ? ' active' : '')
          },
          'Select all in region'),
        d.a(
          {onClick: this._toggleCollapsed},
          d.i({className: 'fa fa-caret-' + (this.state.collapsed ? 'right' : 'down')}),
          ' ',
          d.strong(null, this.props.region),
          ' ',
          this.state.results.length,
          ' features'),
        this._renderResults());
    },

    _renderResults: function () {
      var results = this._results();
      var that = this;
      var props = this.props;
      var state = this.state;
      var sort = this.state.sorting;

      if (results.length) {
        return d.table(
            {className: 'table found-regions' + (this.state.collapsed ? ' collapsed' : '')},
            d.thead(
              null,
              d.tr(
                null,
                d.th(null),
                headers.map(function (h, i) {
                  var sorted = sort.on === h;
                  return d.th(
                    {key: h, onClick: that.setStateProperty.bind(null, 'sorting', {on: h, asc: (!sorted || !sort.asc)})},
                    d.i({className: 'fa fa-sort' + (sorted ? ('-' + (sort.asc ? 'asc' : 'desc')) : '')}),
                    ' ', h);
                }))),
            d.tbody(
              null,
              results.map(this._renderFeatureRow)));
      } else {
        return d.div(
            {className: 'progress progress-striped active'},
            d.div(
              {className: 'progress-bar', role: 'progressbar', style: {width: '100%'}}));
      }
    },

    _toggleCollapsed: function () {
      this.setStateProperty('collapsed', !this.state.collapsed);
    },

    _select: function (what) {
      var state = this.state;
      state.selected[what] = !state.selected[what];
      this.setState(state);
    },

    _results: function () {
      var sorting = (this.state.sorting || {});
      var results = this.state.results.slice();
      var f = (accessors[sorting.on] || property('objectId'));

      results = sortBy(results, f);
      return !sorting.asc ? results.reverse() : results;
    },

    _renderFeatureRow: function (feature, i) {
      return d.tr(
          {key: feature.objectId, onClick: this._select.bind(this, feature.objectId)},
          d.td(
            null,
            d.input(
              {
                type: 'checkbox',
                onChange: function () {},
                checked: (this.state.selected.all || this.state.selected[feature.objectId])
              })),
          headers.map(function (h) { return d.td({key: h}, accessors[h](feature)); }));
    },

    computeState: function (props) {
      var that = this;
      var query = {
        select: ['primaryIdentifier', 'symbol', 'chromosomeLocation.*'],
        from: 'SequenceFeature',
        where: [
          ['organism.shortName', '=', props.organism],
          ['SequenceFeature.chromosomeLocation', 'OVERLAPS', [props.region]]
          , ['SequenceFeature', 'ISA', props.types]
        ]
      };
      if (props.types.length) {
        runQuery(props.service, query).then(this.setStateProperty.bind(null, 'results'));
      } else {
        this.setStateProperty('results', []);
      }
    }

  });

  return Region;

  function runQuery (service, query) {
    var key = service.root + JSON.stringify(query);
    if (queryCache[key]) {
      return queryCache[key];
    } else {
      return queryCache[key] = service.records(query);
    }
  }

  function featureIdent (feature) {
    return (feature.symbol || feature.primaryIdentifier);
  }

  function featureLocation (feature) {
    var location = (feature.chromosomeLocation || {locatedOn: {}});
    return [location.locatedOn.primaryIdentifier, ':', location.start, '..', location.end].join('');
  }

});

