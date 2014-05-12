define(['react'], function (React) {

  'use strict';

  var d = React.DOM;

  var TypeControls = React.createClass({

    displayName: 'TypeControls',

    render: function () {
      var that = this;
      var names = this.props.typeNames;
      if (names.length < 5) {
        return d.div(
            {className: 'btn-group'},
            names.map(this.makeButton));
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
              names.map(this.makeLi)));
      }
    },

    makeButton:  function (name, i) {
      return d.button(
        {
          key: i,
          ref: name,
          onClick: this.props.toggleType.bind(null, name, i),
          className: 'btn btn-default' + (this.props.activeTypes[i] ? ' active' : '')
        }, name);
    },

    makeLi: function (name, i) {
      return d.li(
        {
          key: i,
          ref: name,
          onClick: this.props.toggleType.bind(null, name, i),
          className: this.props.activeTypes[i] ? 'active' : ''
        }, d.a(null, name));
    }

  });

  return TypeControls;
});
