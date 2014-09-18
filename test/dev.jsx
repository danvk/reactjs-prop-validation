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
    React.renderComponent(<Root name="ReactJS" />, el);
  }, /does not have propTypes/);
});
