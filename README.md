reactjs-prop-validation
=======================

A ReactJS Mixin which enforces that a Component document all its props in propTypes.

Usage
-----

```html

<script src="prop-validation-mixin.js"></script>

<div id="content"></div>

<script type="text/jsx">
/** @React.DOM */

var Root = React.createComponent({
  propTypes: {
    name: React.PropTypes.string.isRequired
  },
  mixins: [PropValidationMixin],
  render: function() {
    return <div>{this.props.name}</div>;
  }
});

React.renderComponent(<Root name="Bob" />, document.getElementById('content'));
</script>
```

This enforces a requirement that every `prop` that the `Root` component
accesses appears in `propTypes` (at least in dev mode on browsers which support
it, see below).


Why would you want this?
------------------------

It's good practice to document the API of your components. The `propTypes`
field lets you do this in a way that's enforced at runtime and hence unlikely
to drift vs. the implementation.

The built-in `propTypes` system is more of a property validation system than a
complete API spec. There's nothing that forces you to enumerate all your
component's `props` in the `propTypes` section. This Mixin changes that.

If you want to use a component and you see `mixins: [PropValidationMixin]`,
then you can be confident that its `propTypes` section specifies its complete API.

How does it work?
-----------------

When you mix in `PropValidationMixin`, it wraps an ES6 Proxy around
`this.props` which intercepts all reads from `this.props`. When you read
`this.props.foo`, it checks that `foo` appears in `this.propTypes`. This
ensures that the component can't ever use a property that it doesn't specify.

Note that this requires the ES6 Proxy, which is currently only supported in
Firefox.

Just like `propTypes`, `PropValidationMixin` is a no-op when you use the
production version of ReactJS (i.e. the minified version).  It won't affect the
performance or behavior of your site.

Development
-----------

To get going, run:

```bash
npm install
```

Then open test/dev.html in Firefox.
