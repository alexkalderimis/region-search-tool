define(['react'], function (React) {

  'use strict';

  var d = React.DOM;

  var InputGroup = React.createClass({

    displayName: 'InputGroup',

    render: function () {
      return d.div(
        {className: 'form-group' + (this.props.className ? ' ' + this.props.className : '')},
        d.div(
          {className: 'input-group'},
          d.span(
            {className: 'input-group-addon'}, this.props.name),
          d.input(
            {
              className: 'form-control',
              ref: 'inputNode',
              onChange: this._onChange,
              type: 'text',
              value: this.props.model,
              placeholder: this.props.name
            }),
          d.span(
            {className: 'input-group-btn'},
            d.button(
              {
                className: 'btn btn-default',
                type: 'button',
                onClick: this.props.onChange.bind(null, "")
              },
              d.i({className: 'fa fa-times'})))));
    },

    _onChange: function (event) {
      var value = this.refs.inputNode.getDOMNode().value;
      this.props.onChange(value);
    }
  });

  return InputGroup;
});
