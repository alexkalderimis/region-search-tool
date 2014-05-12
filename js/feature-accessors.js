define([
    'lodash/utilities/property',
    ], function (property) {

  'use strict';

  var accessors = {
    Feature: featureIdent,
    Type: property('class'),
    Location: featureLocation
  };

  var headers = ['Feature', 'Type', 'Location'];

  return {accessors: accessors, headers: headers};

  // ------------ FUNCTIONS

  function featureIdent (feature) {
    return (feature.symbol || feature.primaryIdentifier);
  }

  function featureLocation (feature) {
    var location = (feature.chromosomeLocation || {locatedOn: {}});
    return [location.locatedOn.primaryIdentifier, ':', location.start, '..', location.end].join('');
  }

});
