define(['lodash/collections/some', 'imjs'], function (_, imjs) {

  'use strict';

  var IS_BLANK = /^\s+$/;

  // Requires computeState
  var ComputableState = {
    componentWillMount: onPropChange,
    componentWillReceiveProps: onPropChange
  };

  var SetStateProperty = {setStateProperty: setStateProperty};

  var Filtered = {matchesFilter: matchesFilter};

  return {
    SetStateProperty: SetStateProperty,
    Filtered: Filtered,
    ComputableState: ComputableState
  };

  // Requires:
  //   * props.filterTerm
  function matchesFilter (thing) {
    var ft = this.props.filterTerm;
    if (ft == null) return true;
    return _.some([thing.name, thing.description], function (text) {
      return text ? text.toLowerCase().indexOf(ft) >= 0 : false;
    });
  }

  function setStateProperty (prop, val) {
      var state = this.state;
      state[prop] = val;
      this.setState(state);
  }

  function onPropChange (props) {
    props = (props || this.props);
    this.computeState(props);
  }

});
