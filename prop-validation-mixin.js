/**
 * Mix this in to a component to check that all its props are also in propTypes.
 * This uses the ES6 Proxy object, currently only available in Firefox or
 * Chrome with special flags.
 */
var PropertyValidationMixin = {
  getInitialState: function() {
    if (typeof(Proxy) == 'undefined') {
      console.warn('Proxy is not available in this browser; props will be unchecked.');
      return;
    }

    // "this" here refers to the Component.
    var component = this;
    var rawProps = this.props;
    var propTypes = this._descriptor.type.propTypes;

    this.props = new Proxy(rawProps, {
      get: function(obj, prop) {
        if (prop == 'ref') {
          // ... what is this?
        } else {
          if (!(prop in propTypes)) {
            console.warn('Accessing property', prop, 'in', component,
                         'which is not declared in its propTypes.');
          } else {
            console.log('Validated', prop);
          }
        }

        return rawProps[prop];
      }
    });

    return {};  // Otherwise you can get Invariant Violation.
  }
};
