var PropValidationMixin = (function() {
"use strict";

// Hack to check whether ReactJS is in dev mode.
// See http://stackoverflow.com/a/25922668/388951
var IS_DEV_MODE = (function() {
  try {
    React.createClass({});
  } catch(e) {
    return (e.message.indexOf('render') >= 0);
  }
  return false;  // should never happen, but play it safe.
})();

/**
 * Mix this in to a component to check that all its props are also in propTypes.
 *
 * This has no effect outside of ReactJS dev mode (i.e. non-minified source).
 *
 * It uses the ES6 Proxy object, currently only available in Firefox or Chrome
 * with special flags.
 */
var PropValidationMixin = {
  getInitialState: function() {
    // "this" here refers to the Component.
    var component = this;
    var rawProps = component.props;

    var type = component._descriptor.type;
    var componentName = type.displayName;
    if (!('propTypes' in type)) {
      throw Error('PropValidationMixin: Component ' + componentName + ' does not have propTypes');
    }
    var propTypes = type.propTypes;

    if (typeof(Proxy) == 'undefined') {
      console.warn('Proxy is not available in this browser; props will be unchecked.');
      return {};
    }

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

return IS_DEV_MODE ? PropValidationMixin : {};

})();


/*
Tests to write:
- In dev mode, not specifying propTypes is an error
- In dev mode, accessing a prop not in propTypes is an error
- In dev mode, accessing only props in propTypes is OK.
- In dev mode, you can use refs.

- In prod mode, all of the above are OK.
*/
