define(['react', './mixins'], function (React, mixins) {

  'use strict';

  var d = React.DOM;

  var ToolBar = React.createClass({

    displayName: 'ToolBar',

    mixins: [mixins.SetStateProperty],

    getInitialState: function () {
      return {exportFormat: 'fasta'};
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
              {className: 'btn btn-default'},
              "Select all")),
          d.div(
            {className: 'btn-group'},
            d.button(
              {className: 'btn btn-primary'},
              'Download as ', d.strong(null, state.exportFormat)),
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
