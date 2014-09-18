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

function err(message) {
  return Error('PropValidationMixin: ' + message);
}

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
      throw err('Component ' + componentName + ' does not have propTypes');
    }
    var propTypes = type.propTypes;

    if (typeof(Proxy) == 'undefined') {
      console.warn('Proxy is not available in this browser; props will be unchecked.');
      return {};
    }

    this.props = new Proxy(rawProps, {
      get: function(obj, prop, receiver) {
        if (!(prop in propTypes)) {
          throw err('Tried to access props.' + prop + ', which is not ' +
                    'declared in ' + componentName + '.propTypes');
        }

        return obj[prop];
      }
    });

    return {};  // Otherwise you can get Invariant Violation.
  }
};

return IS_DEV_MODE ? PropValidationMixin : {};

})();


/*
Tests to write:
- In prod mode, all of the above are OK.
*/
