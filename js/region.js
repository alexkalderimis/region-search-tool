define([
    'react',
    'q',
    'lodash/collections/sortBy',
    'lodash/utilities/property',
    './feature-accessors',
    './mixins',
    './feature-row'
    ], function (React, Q, sortBy, property, Feature, mixins, FeatureRow) {

  'use strict';

  var d = React.DOM;

  var queryCache = {};

  var Region = React.createClass({

    displayName: 'Region',

    getInitialState: function () {
      return {
        complete: false,
        sorting: {},
        results: []
      };
    },

    mixins: [mixins.SetStateProperty, mixins.ComputableState],

    render: function () {
      var that = this;
      var state = this.state;
      var props = this.props;
      var region = props.region;
      return d.li(
        {className: props.className},
        d.button(
          {
            ref: 'selectAll',
            onClick: this._toggleAll,
            className: 'pull-right btn btn-default' + (props.selected[region] ? ' active' : '')
          },
          'Select all in region'),
        d.a(
          {onClick: this._toggleCollapsed},
          d.i({className: 'fa fa-caret-' + (state.collapsed ? 'right' : 'down')}),
          ' ',
          d.strong(null, region),
          ' ',
          state.results.length,
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
                Feature.headers.map(function (h, i) {
                  var sorted = sort.on === h;
                  return d.th(
                    {
                      key: h,
                      onClick: that.setStateProperty.bind(null,
                                      'sorting', {on: h, asc: (!sorted || !sort.asc)})
                    },
                    d.i({className: 'fa fa-sort' + (sorted ? ('-' + (sort.asc ? 'asc' : 'desc')) : '')}),
                    ' ', h);
                }))),
            d.tbody(
              null,
              results.map(this._renderFeatureRow)));
      } else if (this.state.complete) {
        return d.div(
            {className: 'alert alert-warning'},
            d.strong(null, 'Sorry'),
            d.p(null, "no features found"));
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

    _toggleAll: function () {
      this.refs.selectAll.getDOMNode().blur();
      this.props.toggleSelected(this.props.region);
    },

    _results: function () {
      var sorting = (this.state.sorting || {});
      var results = this.state.results.slice();
      var f = (Feature.accessors[sorting.on] || property('objectId'));

      results = sortBy(results, f);
      return !sorting.asc ? results.reverse() : results;
    },

    _renderFeatureRow: function (feature, i) {
      return FeatureRow({
        key: feature.objectId,
        region: this.props.region,
        feature: feature,
        selected: this.props.selected,
        toggleSelect: this.props.toggleSelected.bind(null, feature.objectId)
      });
    },

    computeState: function (props) {
      var that = this;
      var running;
      var query = {
        select: ['name', 'primaryIdentifier', 'symbol', 'chromosomeLocation.*'],
        from: 'SequenceFeature',
        where: [
          ['organism.shortName', '=', props.organism],
          ['SequenceFeature.chromosomeLocation', 'OVERLAPS', [props.region]]
          , ['SequenceFeature', 'ISA', props.types]
        ]
      };
      if (props.filter) {
        query.where.push(['SequenceFeature', 'LOOKUP', props.filter]);
      }
      var queryString = JSON.stringify(query);
      if (queryString !== this.state.lastQuery) {
        this.setStateProperty('lastQuery', queryString);
        if (props.types.length) {
          running = runQuery(props.service, query);
          running.then(this.setStateProperty.bind(this, 'results'));
          running.then(this.setStateProperty.bind(this, 'complete', true));
          running.then(function (results) {
            props.foundFeatures(results);
            props.onCount(results.length);  
          });
        } else if (this.state.results.length !== 0) {
          this.setStateProperty('results', []);
          this.setStateProperty('complete', true);
          props.onCount(0);
        }
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

});

