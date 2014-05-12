define([
    'react',
    'lodash/collections/some',
    './feature-accessors'
    ], function (React, any, Feature) {

  'use strict';

  var d = React.DOM;
  
  var FeatureRow = React.createClass({

    displayName: 'FeatureRow',

    render: function () {
      try {
      var props = this.props;
      var feature = props.feature;
      return d.tr(
          {onClick: props.toggleSelect},
          d.td(
            null,
            d.input(
              {
                type: 'checkbox',
                onChange: function () {},
                checked: any(['all', props.region, feature.objectId], this.isSelected)
              })),
          Feature.headers.map(function (h) {
            return d.td({key: h}, Feature.accessors[h](feature)); }));
      } catch (e) {
        return d.div({className: 'alert alert-danger'}, d.strong(null, 'Error'), String(e));
      }
    },

    isSelected: function (prop) {
      return this.props.selected[prop];
    }

  });

  return FeatureRow;
});
