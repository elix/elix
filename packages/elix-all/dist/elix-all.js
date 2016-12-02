(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _globals = require('../elix-simple-element/globals');

var simpleElement = _interopRequireWildcard(_globals);

var _globals2 = require('../elix-mixins/globals');

var componentMixins = _interopRequireWildcard(_globals2);

var _globals3 = require('../elix-all/globals');

var webComponents = _interopRequireWildcard(_globals3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

},{"../elix-all/globals":1,"../elix-mixins/globals":2,"../elix-simple-element/globals":5}],2:[function(require,module,exports){
'use strict';

var _SimpleAttribute = require('./src/SimpleAttribute');

var _SimpleAttribute2 = _interopRequireDefault(_SimpleAttribute);

var _SimpleTemplate = require('./src/SimpleTemplate');

var _SimpleTemplate2 = _interopRequireDefault(_SimpleTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * This file is transpiled to create an ES5-compatible distribution in which
 * the package's main feature(s) are available via the window.Basic global.
 * If you're already using ES6 yourself, ignore this file, and instead import
 * the source file(s) you want from the src folder.
 */

window.Elix = window.Elix || {};

window.Elix.SimpleAttribute = _SimpleAttribute2.default;
window.Elix.SimpleTemplate = _SimpleTemplate2.default;

},{"./src/SimpleAttribute":3,"./src/SimpleTemplate":4}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Exported function extends a base class with SimpleAttribute. */
exports.default = function (base) {

  /**
   * Simple mixin for having attribute changes update properties.
   */
  var SimpleAttribute = function (_base) {
    _inherits(SimpleAttribute, _base);

    function SimpleAttribute() {
      _classCallCheck(this, SimpleAttribute);

      return _possibleConstructorReturn(this, (SimpleAttribute.__proto__ || Object.getPrototypeOf(SimpleAttribute)).apply(this, arguments));
    }

    _createClass(SimpleAttribute, [{
      key: "attributeChangedCallback",

      /*
       * Handle a change to the attribute with the given name.
       */
      value: function attributeChangedCallback(attributeName, oldValue, newValue) {
        if (_get(SimpleAttribute.prototype.__proto__ || Object.getPrototypeOf(SimpleAttribute.prototype), "attributeChangedCallback", this)) {
          _get(SimpleAttribute.prototype.__proto__ || Object.getPrototypeOf(SimpleAttribute.prototype), "attributeChangedCallback", this).call(this);
        }
        // If the attribute name corresponds to a property name, set the property.
        // Ignore standard HTMLElement properties handled by the DOM.
        if (attributeName in this && !(attributeName in HTMLElement.prototype)) {
          this[attributeName] = newValue;
        }
      }

      /**
       * Set/unset the attribute with the indicated name.
       *
       * This method exists primarily to handle the case where an element wants to
       * set a default property value that should be reflected as an attribute. An
       * important limitation of custom element consturctors is that they cannot
       * set attributes. A call to `reflectAttribute` during the constructor will
       * be deferred until the element is connected to the document.
       *
       * @param {string} attribute - The name of the *attribute* (not property) to set.
       * @param {object} value - The value to set. If null, the attribute will be removed.
       */

    }, {
      key: "reflectAttribute",
      value: function reflectAttribute(attribute, value) {
        // For documentation purposes only  
      }
    }]);

    return SimpleAttribute;
  }(base);

  return SimpleAttribute;
};

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Exported function extends a base class with SimpleTemplate. */
exports.default = function (base) {

  /**
   * Simple mixin for cloning a string template into a new shadow root.
   */
  var SimpleTemplate = function (_base) {
    _inherits(SimpleTemplate, _base);

    function SimpleTemplate() {
      _classCallCheck(this, SimpleTemplate);

      var _this = _possibleConstructorReturn(this, (SimpleTemplate.__proto__ || Object.getPrototypeOf(SimpleTemplate)).call(this));

      var template = _this.template;
      if (template) {
        var root = _this.attachShadow({ mode: 'open' });
        root.innerHTML = template;
      }
      return _this;
    }

    /**
     * Set/unset the class with the indicated name.
     *
     * This method exists primarily to handle the case where an element wants to
     * set a default property value that should be reflected as as class. An
     * important limitation of custom element consturctors is that they cannot
     * set attributes, including the `class` attribute. A call to
     * `reflectClass` during the constructor will be deferred until the element
     * is connected to the document.
     *
     * @param {string} className - The name of the class to set.
     * @param {object} value - True to set the class, false to remove it.
     */


    _createClass(SimpleTemplate, [{
      key: 'reflectClass',
      value: function reflectClass(className, value) {
        // For documentation purposes only
      }
    }]);

    return SimpleTemplate;
  }(base);

  return SimpleTemplate;
};

},{}],5:[function(require,module,exports){
'use strict';

var _SimpleElement = require('./src/SimpleElement');

var _SimpleElement2 = _interopRequireDefault(_SimpleElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.Elix = window.Elix || {}; /*
                                  * This file is transpiled to create an ES5-compatible distribution in which
                                  * the package's main feature(s) are available via the window.Elix global.
                                  * If you're already using ES6 yourself, ignore this file, and instead import
                                  * the source file(s) you want from the src folder.
                                  */

window.Elix.SimpleElement = _SimpleElement2.default;

},{"./src/SimpleElement":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SimpleAttribute = require('../../elix-mixins/src/SimpleAttribute');

var _SimpleAttribute2 = _interopRequireDefault(_SimpleAttribute);

var _SimpleTemplate2 = require('../../elix-mixins/src/SimpleTemplate');

var _SimpleTemplate3 = _interopRequireDefault(_SimpleTemplate2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A simple element
 *
 * [Live demo](http://elix.org/elix/packages/elix-simple-element/)
 *
 * This is a simple element.
 *
 * @mixes SimpleAttribute
 * @mixes SimpleTemplate
 */
var SimpleElement = function (_SimpleTemplate) {
  _inherits(SimpleElement, _SimpleTemplate);

  function SimpleElement() {
    _classCallCheck(this, SimpleElement);

    return _possibleConstructorReturn(this, (SimpleElement.__proto__ || Object.getPrototypeOf(SimpleElement)).apply(this, arguments));
  }

  _createClass(SimpleElement, [{
    key: 'greeting',

    /**
     * Specifies the greeting.
     * 
     * @type {string}
     * @default greeting
     */
    get: function get() {
      return this.shadowRoot.getElementById('greeting').textContent;
    },
    set: function set(value) {
      this.shadowRoot.getElementById('greeting').textContent = value;
    }
  }, {
    key: 'template',
    get: function get() {
      return '<span id="greeting">Hello</span>, <slot></slot>.';
    }
  }], [{
    key: 'observedAttributes',
    get: function get() {
      return ['greeting'];
    }
  }]);

  return SimpleElement;
}((0, _SimpleTemplate3.default)((0, _SimpleAttribute2.default)(HTMLElement)));

customElements.define('elix-simple-element', SimpleElement);
exports.default = SimpleElement;

},{"../../elix-mixins/src/SimpleAttribute":3,"../../elix-mixins/src/SimpleTemplate":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwYWNrYWdlcy9lbGl4LWFsbC9nbG9iYWxzLmpzIiwicGFja2FnZXMvZWxpeC1taXhpbnMvZ2xvYmFscy5qcyIsInBhY2thZ2VzL2VsaXgtbWl4aW5zL3NyYy9TaW1wbGVBdHRyaWJ1dGUuanMiLCJwYWNrYWdlcy9lbGl4LW1peGlucy9zcmMvU2ltcGxlVGVtcGxhdGUuanMiLCJwYWNrYWdlcy9lbGl4LXNpbXBsZS1lbGVtZW50L2dsb2JhbHMuanMiLCJwYWNrYWdlcy9lbGl4LXNpbXBsZS1lbGVtZW50L3NyYy9TaW1wbGVFbGVtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNXQTs7SUFBWSxhOztBQUNaOztJQUFZLGU7O0FBQ1o7O0lBQVksYTs7Ozs7OztBQ05aOzs7O0FBQ0E7Ozs7OztBQVJBOzs7Ozs7O0FBVUEsT0FBTyxJQUFQLEdBQWMsT0FBTyxJQUFQLElBQWUsRUFBN0I7O0FBRUEsT0FBTyxJQUFQLENBQVksZUFBWjtBQUNBLE9BQU8sSUFBUCxDQUFZLGNBQVo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNaQTtrQkFDZSxVQUFDLElBQUQsRUFBVTs7QUFFdkI7OztBQUZ1QixNQUtqQixlQUxpQjtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQU1yQjs7O0FBTnFCLCtDQVNJLGFBVEosRUFTbUIsUUFUbkIsRUFTNkIsUUFUN0IsRUFTdUM7QUFDN0QsNklBQW9DO0FBQUU7QUFBbUM7QUFDekU7QUFDQTtBQUNBLFlBQUksaUJBQWlCLElBQWpCLElBQXlCLEVBQUUsaUJBQWlCLFlBQVksU0FBL0IsQ0FBN0IsRUFBd0U7QUFDbkUsZUFBSyxhQUFMLElBQXNCLFFBQXRCO0FBQ0o7QUFDQzs7QUFFRDs7Ozs7Ozs7Ozs7OztBQWxCcUI7QUFBQTtBQUFBLHVDQThCSixTQTlCSSxFQThCTyxLQTlCUCxFQThCYztBQUNqQztBQUNEO0FBaENvQjs7QUFBQTtBQUFBLElBS08sSUFMUDs7QUFvQ3ZCLFNBQU8sZUFBUDtBQUNELEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdENEO2tCQUNlLFVBQUMsSUFBRCxFQUFVOztBQUV2Qjs7O0FBRnVCLE1BS2pCLGNBTGlCO0FBQUE7O0FBTXJCLDhCQUFjO0FBQUE7O0FBQUE7O0FBRWIsVUFBTSxXQUFXLE1BQUssUUFBdEI7QUFDQSxVQUFJLFFBQUosRUFBYztBQUNYLFlBQU0sT0FBTyxNQUFLLFlBQUwsQ0FBa0IsRUFBRSxNQUFNLE1BQVIsRUFBbEIsQ0FBYjtBQUNBLGFBQUssU0FBTCxHQUFpQixRQUFqQjtBQUNGO0FBTlk7QUFPYjs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7O0FBZnFCO0FBQUE7QUFBQSxtQ0E0QlIsU0E1QlEsRUE0QkcsS0E1QkgsRUE0QlU7QUFDN0I7QUFDRDtBQTlCb0I7O0FBQUE7QUFBQSxJQUtNLElBTE47O0FBa0N2QixTQUFPLGNBQVA7QUFDRCxDOzs7OztBQzlCRDs7Ozs7O0FBRUEsT0FBTyxJQUFQLEdBQWMsT0FBTyxJQUFQLElBQWUsRUFBN0IsQyxDQVRBOzs7Ozs7O0FBVUEsT0FBTyxJQUFQLENBQVksYUFBWjs7Ozs7Ozs7Ozs7QUNWQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7OztJQVVNLGE7Ozs7Ozs7Ozs7OztBQUNKOzs7Ozs7d0JBTWU7QUFDYixhQUFPLEtBQUssVUFBTCxDQUFnQixjQUFoQixDQUErQixVQUEvQixFQUEyQyxXQUFsRDtBQUNELEs7c0JBQ1ksSyxFQUFPO0FBQ2xCLFdBQUssVUFBTCxDQUFnQixjQUFoQixDQUErQixVQUEvQixFQUEyQyxXQUEzQyxHQUF5RCxLQUF6RDtBQUNEOzs7d0JBTWM7QUFDYjtBQUNEOzs7d0JBTitCO0FBQzlCLGFBQU8sQ0FBQyxVQUFELENBQVA7QUFDRDs7OztFQWhCeUIsOEJBQWUsK0JBQWdCLFdBQWhCLENBQWYsQzs7QUF1QjVCLGVBQWUsTUFBZixDQUFzQixxQkFBdEIsRUFBNkMsYUFBN0M7a0JBQ2UsYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICogVGhpcyBmaWxlIGlzIHRyYW5zcGlsZWQgdG8gY3JlYXRlIGFuIEVTNS1jb21wYXRpYmxlIGRpc3RyaWJ1dGlvbiBvZiBhbGxcbiAqIGNvbXBvbmVudHMgaW4gdGhlIHByb2plY3QuIElmIHlvdSdyZSBhbHJlYWR5IHVzaW5nIEVTNiB5b3Vyc2VsZiwgaWdub3JlIHRoaXNcbiAqIGZpbGUsIGFuZCBpbnN0ZWFkIGltcG9ydCB0aGUgc291cmNlIGZpbGUocykgeW91IHdhbnQgZnJvbSB0aGUgc3BlY2lmaWNcbiAqIHBhY2thZ2UgeW91IHdhbnQuXG4gKi9cblxuLy8gSW1wb3J0IGFsbCB0aGUgZ2xvYmFscyBmcm9tIGVhY2ggcGFja2FnZS5cbi8vIFdlIHRlbGwganNoaW50IHRvIGlnbm9yZSB0aGUgZmFjdCB0aGF0IHdlJ3JlIG5vdCBhY3R1YWxseSB1c2luZyB0aGVtIGhlcmUuXG4vKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cbmltcG9ydCAqIGFzIHNpbXBsZUVsZW1lbnQgZnJvbSAnLi4vZWxpeC1zaW1wbGUtZWxlbWVudC9nbG9iYWxzJztcbmltcG9ydCAqIGFzIGNvbXBvbmVudE1peGlucyBmcm9tICcuLi9lbGl4LW1peGlucy9nbG9iYWxzJztcbmltcG9ydCAqIGFzIHdlYkNvbXBvbmVudHMgZnJvbSAnLi4vZWxpeC1hbGwvZ2xvYmFscyc7XG5cbi8qIGpzaGludCBpZ25vcmU6ZW5kICovXG4iLCIvKlxuICogVGhpcyBmaWxlIGlzIHRyYW5zcGlsZWQgdG8gY3JlYXRlIGFuIEVTNS1jb21wYXRpYmxlIGRpc3RyaWJ1dGlvbiBpbiB3aGljaFxuICogdGhlIHBhY2thZ2UncyBtYWluIGZlYXR1cmUocykgYXJlIGF2YWlsYWJsZSB2aWEgdGhlIHdpbmRvdy5CYXNpYyBnbG9iYWwuXG4gKiBJZiB5b3UncmUgYWxyZWFkeSB1c2luZyBFUzYgeW91cnNlbGYsIGlnbm9yZSB0aGlzIGZpbGUsIGFuZCBpbnN0ZWFkIGltcG9ydFxuICogdGhlIHNvdXJjZSBmaWxlKHMpIHlvdSB3YW50IGZyb20gdGhlIHNyYyBmb2xkZXIuXG4gKi9cblxuaW1wb3J0IFNpbXBsZUF0dHJpYnV0ZSBmcm9tICcuL3NyYy9TaW1wbGVBdHRyaWJ1dGUnO1xuaW1wb3J0IFNpbXBsZVRlbXBsYXRlIGZyb20gJy4vc3JjL1NpbXBsZVRlbXBsYXRlJztcblxud2luZG93LkVsaXggPSB3aW5kb3cuRWxpeCB8fCB7fTtcblxud2luZG93LkVsaXguU2ltcGxlQXR0cmlidXRlID0gU2ltcGxlQXR0cmlidXRlO1xud2luZG93LkVsaXguU2ltcGxlVGVtcGxhdGUgPSBTaW1wbGVUZW1wbGF0ZTsiLCJcbi8qIEV4cG9ydGVkIGZ1bmN0aW9uIGV4dGVuZHMgYSBiYXNlIGNsYXNzIHdpdGggU2ltcGxlQXR0cmlidXRlLiAqL1xuZXhwb3J0IGRlZmF1bHQgKGJhc2UpID0+IHtcblxuICAvKipcbiAgICogU2ltcGxlIG1peGluIGZvciBoYXZpbmcgYXR0cmlidXRlIGNoYW5nZXMgdXBkYXRlIHByb3BlcnRpZXMuXG4gICAqL1xuICBjbGFzcyBTaW1wbGVBdHRyaWJ1dGUgZXh0ZW5kcyBiYXNlIHtcbiAgICAvKlxuICAgICAqIEhhbmRsZSBhIGNoYW5nZSB0byB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICAgICovXG4gICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJpYnV0ZU5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuXHQgIGlmIChzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2spIHsgc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKCk7IH1cblx0ICAvLyBJZiB0aGUgYXR0cmlidXRlIG5hbWUgY29ycmVzcG9uZHMgdG8gYSBwcm9wZXJ0eSBuYW1lLCBzZXQgdGhlIHByb3BlcnR5LlxuXHQgIC8vIElnbm9yZSBzdGFuZGFyZCBIVE1MRWxlbWVudCBwcm9wZXJ0aWVzIGhhbmRsZWQgYnkgdGhlIERPTS5cblx0ICBpZiAoYXR0cmlidXRlTmFtZSBpbiB0aGlzICYmICEoYXR0cmlidXRlTmFtZSBpbiBIVE1MRWxlbWVudC5wcm90b3R5cGUpKSB7XG4gICAgICAgIHRoaXNbYXR0cmlidXRlTmFtZV0gPSBuZXdWYWx1ZTtcblx0ICB9XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIFNldC91bnNldCB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGluZGljYXRlZCBuYW1lLlxuICAgICAqXG4gICAgICogVGhpcyBtZXRob2QgZXhpc3RzIHByaW1hcmlseSB0byBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgYW4gZWxlbWVudCB3YW50cyB0b1xuICAgICAqIHNldCBhIGRlZmF1bHQgcHJvcGVydHkgdmFsdWUgdGhhdCBzaG91bGQgYmUgcmVmbGVjdGVkIGFzIGFuIGF0dHJpYnV0ZS4gQW5cbiAgICAgKiBpbXBvcnRhbnQgbGltaXRhdGlvbiBvZiBjdXN0b20gZWxlbWVudCBjb25zdHVyY3RvcnMgaXMgdGhhdCB0aGV5IGNhbm5vdFxuICAgICAqIHNldCBhdHRyaWJ1dGVzLiBBIGNhbGwgdG8gYHJlZmxlY3RBdHRyaWJ1dGVgIGR1cmluZyB0aGUgY29uc3RydWN0b3Igd2lsbFxuICAgICAqIGJlIGRlZmVycmVkIHVudGlsIHRoZSBlbGVtZW50IGlzIGNvbm5lY3RlZCB0byB0aGUgZG9jdW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlIC0gVGhlIG5hbWUgb2YgdGhlICphdHRyaWJ1dGUqIChub3QgcHJvcGVydHkpIHRvIHNldC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gc2V0LiBJZiBudWxsLCB0aGUgYXR0cmlidXRlIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICAgKi9cbiAgICByZWZsZWN0QXR0cmlidXRlKGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICAgIC8vIEZvciBkb2N1bWVudGF0aW9uIHB1cnBvc2VzIG9ubHkgIFxuICAgIH1cbiAgICBcbiAgfVxuICBcbiAgcmV0dXJuIFNpbXBsZUF0dHJpYnV0ZTtcbn07IiwiXG4vKiBFeHBvcnRlZCBmdW5jdGlvbiBleHRlbmRzIGEgYmFzZSBjbGFzcyB3aXRoIFNpbXBsZVRlbXBsYXRlLiAqL1xuZXhwb3J0IGRlZmF1bHQgKGJhc2UpID0+IHtcblxuICAvKipcbiAgICogU2ltcGxlIG1peGluIGZvciBjbG9uaW5nIGEgc3RyaW5nIHRlbXBsYXRlIGludG8gYSBuZXcgc2hhZG93IHJvb3QuXG4gICAqL1xuICBjbGFzcyBTaW1wbGVUZW1wbGF0ZSBleHRlbmRzIGJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuXHQgICAgc3VwZXIoKTtcblx0ICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcblx0ICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICBjb25zdCByb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIHJvb3QuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG5cdCAgICB9XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIFNldC91bnNldCB0aGUgY2xhc3Mgd2l0aCB0aGUgaW5kaWNhdGVkIG5hbWUuXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBleGlzdHMgcHJpbWFyaWx5IHRvIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSBhbiBlbGVtZW50IHdhbnRzIHRvXG4gICAgICogc2V0IGEgZGVmYXVsdCBwcm9wZXJ0eSB2YWx1ZSB0aGF0IHNob3VsZCBiZSByZWZsZWN0ZWQgYXMgYXMgY2xhc3MuIEFuXG4gICAgICogaW1wb3J0YW50IGxpbWl0YXRpb24gb2YgY3VzdG9tIGVsZW1lbnQgY29uc3R1cmN0b3JzIGlzIHRoYXQgdGhleSBjYW5ub3RcbiAgICAgKiBzZXQgYXR0cmlidXRlcywgaW5jbHVkaW5nIHRoZSBgY2xhc3NgIGF0dHJpYnV0ZS4gQSBjYWxsIHRvXG4gICAgICogYHJlZmxlY3RDbGFzc2AgZHVyaW5nIHRoZSBjb25zdHJ1Y3RvciB3aWxsIGJlIGRlZmVycmVkIHVudGlsIHRoZSBlbGVtZW50XG4gICAgICogaXMgY29ubmVjdGVkIHRvIHRoZSBkb2N1bWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgLSBUaGUgbmFtZSBvZiB0aGUgY2xhc3MgdG8gc2V0LlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZSAtIFRydWUgdG8gc2V0IHRoZSBjbGFzcywgZmFsc2UgdG8gcmVtb3ZlIGl0LlxuICAgICAqL1xuICAgIHJlZmxlY3RDbGFzcyhjbGFzc05hbWUsIHZhbHVlKSB7XG4gICAgICAvLyBGb3IgZG9jdW1lbnRhdGlvbiBwdXJwb3NlcyBvbmx5XG4gICAgfVxuXG4gIH1cbiAgXG4gIHJldHVybiBTaW1wbGVUZW1wbGF0ZTtcbn07IiwiLypcbiAqIFRoaXMgZmlsZSBpcyB0cmFuc3BpbGVkIHRvIGNyZWF0ZSBhbiBFUzUtY29tcGF0aWJsZSBkaXN0cmlidXRpb24gaW4gd2hpY2hcbiAqIHRoZSBwYWNrYWdlJ3MgbWFpbiBmZWF0dXJlKHMpIGFyZSBhdmFpbGFibGUgdmlhIHRoZSB3aW5kb3cuRWxpeCBnbG9iYWwuXG4gKiBJZiB5b3UncmUgYWxyZWFkeSB1c2luZyBFUzYgeW91cnNlbGYsIGlnbm9yZSB0aGlzIGZpbGUsIGFuZCBpbnN0ZWFkIGltcG9ydFxuICogdGhlIHNvdXJjZSBmaWxlKHMpIHlvdSB3YW50IGZyb20gdGhlIHNyYyBmb2xkZXIuXG4gKi9cblxuaW1wb3J0IFNpbXBsZUVsZW1lbnQgZnJvbSAnLi9zcmMvU2ltcGxlRWxlbWVudCc7XG5cbndpbmRvdy5FbGl4ID0gd2luZG93LkVsaXggfHwge307XG53aW5kb3cuRWxpeC5TaW1wbGVFbGVtZW50ID0gU2ltcGxlRWxlbWVudDtcbiIsImltcG9ydCBTaW1wbGVBdHRyaWJ1dGUgZnJvbSAnLi4vLi4vZWxpeC1taXhpbnMvc3JjL1NpbXBsZUF0dHJpYnV0ZSc7XG5pbXBvcnQgU2ltcGxlVGVtcGxhdGUgZnJvbSAnLi4vLi4vZWxpeC1taXhpbnMvc3JjL1NpbXBsZVRlbXBsYXRlJztcblxuLyoqXG4gKiBBIHNpbXBsZSBlbGVtZW50XG4gKlxuICogW0xpdmUgZGVtb10oaHR0cDovL2VsaXgub3JnL2VsaXgvcGFja2FnZXMvZWxpeC1zaW1wbGUtZWxlbWVudC8pXG4gKlxuICogVGhpcyBpcyBhIHNpbXBsZSBlbGVtZW50LlxuICpcbiAqIEBtaXhlcyBTaW1wbGVBdHRyaWJ1dGVcbiAqIEBtaXhlcyBTaW1wbGVUZW1wbGF0ZVxuICovXG5jbGFzcyBTaW1wbGVFbGVtZW50IGV4dGVuZHMgU2ltcGxlVGVtcGxhdGUoU2ltcGxlQXR0cmlidXRlKEhUTUxFbGVtZW50KSkge1xuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSBncmVldGluZy5cbiAgICogXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0IGdyZWV0aW5nXG4gICAqL1xuICBnZXQgZ3JlZXRpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hhZG93Um9vdC5nZXRFbGVtZW50QnlJZCgnZ3JlZXRpbmcnKS50ZXh0Q29udGVudDtcbiAgfVxuICBzZXQgZ3JlZXRpbmcodmFsdWUpIHtcbiAgICB0aGlzLnNoYWRvd1Jvb3QuZ2V0RWxlbWVudEJ5SWQoJ2dyZWV0aW5nJykudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfVxuICBcbiAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgcmV0dXJuIFsnZ3JlZXRpbmcnXTtcbiAgfVxuICBcbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBgPHNwYW4gaWQ9XCJncmVldGluZ1wiPkhlbGxvPC9zcGFuPiwgPHNsb3Q+PC9zbG90Pi5gO1xuICB9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnZWxpeC1zaW1wbGUtZWxlbWVudCcsIFNpbXBsZUVsZW1lbnQpO1xuZXhwb3J0IGRlZmF1bHQgU2ltcGxlRWxlbWVudDsiXX0=
