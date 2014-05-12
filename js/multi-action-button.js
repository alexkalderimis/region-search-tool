define(['react'], function (React) {
  'use strict';

  var d = React.DOM;

  /**
   * Requires the following properties:
   *  - mainAction: Component
   *  - options: Array[Component]
   *
   */
  var MultiActionButton = React.createClass({

    displayName: 'MultiActionButton',

    render: function () {
      var props = this.props;
      return d.div(
        {className: 'btn-group'},
        d.button(
          {onClick: this.props.act, className: 'btn btn-primary'},
          props.mainAction),
        d.button(
          {className: 'btn btn-primary dropdown-toggle', 'data-toggle': 'dropdown'},
          d.span({className: 'caret'}),
          d.span({className: 'sr-only'}, "toggle dropdown")),
        d.ul(
          {className: 'dropdown-menu'},
          props.options.map(function (opt, i) {
            return d.li(
              {
                key: i,
                onClick: opt.props.select,
                className: opt.props.selected ? 'active' : ''
              }, opt);
          })));
    }

  });

  return MultiActionButton;
});
