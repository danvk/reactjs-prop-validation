/** @jsx React.DOM */

var el = document.getElementById('content');

QUnit.test('Prod: Not specifying propTypes is OK', function(assert) {
  var Root = React.createClass({
    mixins: [PropValidationMixin],
    render: function() {
      return <div>Hello {this.props.name}!</div>;
    }
  });

  assert.equal('<div>Hello ReactJS!</div>',
      React.renderComponentToStaticMarkup(<Root name="ReactJS" />));
});

QUnit.test('Prod: Accessing a prop not in propTypes is OK', function(assert) {
  var Root = React.createClass({
    mixins: [PropValidationMixin],
    propTypes: {name: React.PropTypes.string.isRequired},
    render: function() {
      return <div>Hello {this.props.foo}!</div>;
    }
  });

  assert.equal('<div>Hello ReactJS!</div>',
      React.renderComponentToStaticMarkup(<Root foo="ReactJS" />));
});

QUnit.test('Prod: Accessing props in propTypes is OK', function(assert) {
  var Root = React.createClass({
    mixins: [PropValidationMixin],
    propTypes: {name: React.PropTypes.string.isRequired},
    render: function() {
      return <div>Hello {this.props.name}!</div>;
    }
  });

  assert.equal('<div>Hello ReactJS!</div>',
      React.renderComponentToStaticMarkup(<Root name="ReactJS" />));
});

QUnit.asyncTest('Prod: Refs work OK', function(assert) {
  var RefRoot = React.createClass({
    mixins: [PropValidationMixin],
    propTypes: {name: React.PropTypes.string.isRequired},
    render: function() {
      return <div ref="foo">Hello {this.props.name}!</div>;
    },
    componentDidMount: function() {
      this.text = this.refs.foo.getDOMNode().textContent;
    }
  });

  React.renderComponent(<RefRoot name="ReactJS" />, el, function() {
    assert.equal(this.text, 'Hello ReactJS!');
    QUnit.start();
  });
});
