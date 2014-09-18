/** @jsx React.DOM */

var el = document.getElementById('content');

QUnit.test('Not specifying propTypes is an error', function(assert) {
  var Root = React.createClass({
    mixins: [PropValidationMixin],
    render: function() {
      return <div>Hello {this.props.name}!</div>;
    }
  });

  assert.throws(function() {
    React.renderComponentToStaticMarkup(<Root name="ReactJS" />);
  }, /Component Root does not have propTypes/);
});

QUnit.test('Accessing a prop not in propTypes is an error', function(assert) {
  var Root = React.createClass({
    mixins: [PropValidationMixin],
    propTypes: {name: React.PropTypes.string.isRequired},
    render: function() {
      return <div>Hello {this.props.foo}!</div>;
    }
  });

  assert.throws(function() {
    React.renderComponentToStaticMarkup(<Root name="ReactJS" />);
  }, /Tried to access props.foo, which is not declared in Root.propTypes/);
});

QUnit.test('Accessing props in propTypes is OK', function(assert) {
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

QUnit.asyncTest('Refs work OK', function(assert) {
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
