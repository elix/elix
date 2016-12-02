(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _globals = require('../elix-simple-element/globals');

var simpleElement = _interopRequireWildcard(_globals);

var _globals2 = require('../elix-mixins/globals');

var componentMixins = _interopRequireWildcard(_globals2);

var _globals3 = require('../elix-components/globals');

var webComponents = _interopRequireWildcard(_globals3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

},{"../elix-components/globals":1,"../elix-mixins/globals":2,"../elix-simple-element/globals":5}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwYWNrYWdlcy9lbGl4LWNvbXBvbmVudHMvZ2xvYmFscy5qcyIsInBhY2thZ2VzL2VsaXgtbWl4aW5zL2dsb2JhbHMuanMiLCJwYWNrYWdlcy9lbGl4LW1peGlucy9zcmMvU2ltcGxlQXR0cmlidXRlLmpzIiwicGFja2FnZXMvZWxpeC1taXhpbnMvc3JjL1NpbXBsZVRlbXBsYXRlLmpzIiwicGFja2FnZXMvZWxpeC1zaW1wbGUtZWxlbWVudC9nbG9iYWxzLmpzIiwicGFja2FnZXMvZWxpeC1zaW1wbGUtZWxlbWVudC9zcmMvU2ltcGxlRWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDV0E7O0lBQVksYTs7QUFDWjs7SUFBWSxlOztBQUNaOztJQUFZLGE7Ozs7Ozs7QUNOWjs7OztBQUNBOzs7Ozs7QUFSQTs7Ozs7OztBQVVBLE9BQU8sSUFBUCxHQUFjLE9BQU8sSUFBUCxJQUFlLEVBQTdCOztBQUVBLE9BQU8sSUFBUCxDQUFZLGVBQVo7QUFDQSxPQUFPLElBQVAsQ0FBWSxjQUFaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWkE7a0JBQ2UsVUFBQyxJQUFELEVBQVU7O0FBRXZCOzs7QUFGdUIsTUFLakIsZUFMaUI7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFNckI7OztBQU5xQiwrQ0FTSSxhQVRKLEVBU21CLFFBVG5CLEVBUzZCLFFBVDdCLEVBU3VDO0FBQzdELDZJQUFvQztBQUFFO0FBQW1DO0FBQ3pFO0FBQ0E7QUFDQSxZQUFJLGlCQUFpQixJQUFqQixJQUF5QixFQUFFLGlCQUFpQixZQUFZLFNBQS9CLENBQTdCLEVBQXdFO0FBQ25FLGVBQUssYUFBTCxJQUFzQixRQUF0QjtBQUNKO0FBQ0M7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7QUFsQnFCO0FBQUE7QUFBQSx1Q0E4QkosU0E5QkksRUE4Qk8sS0E5QlAsRUE4QmM7QUFDakM7QUFDRDtBQWhDb0I7O0FBQUE7QUFBQSxJQUtPLElBTFA7O0FBb0N2QixTQUFPLGVBQVA7QUFDRCxDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RDRDtrQkFDZSxVQUFDLElBQUQsRUFBVTs7QUFFdkI7OztBQUZ1QixNQUtqQixjQUxpQjtBQUFBOztBQU1yQiw4QkFBYztBQUFBOztBQUFBOztBQUViLFVBQU0sV0FBVyxNQUFLLFFBQXRCO0FBQ0EsVUFBSSxRQUFKLEVBQWM7QUFDWCxZQUFNLE9BQU8sTUFBSyxZQUFMLENBQWtCLEVBQUUsTUFBTSxNQUFSLEVBQWxCLENBQWI7QUFDQSxhQUFLLFNBQUwsR0FBaUIsUUFBakI7QUFDRjtBQU5ZO0FBT2I7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7OztBQWZxQjtBQUFBO0FBQUEsbUNBNEJSLFNBNUJRLEVBNEJHLEtBNUJILEVBNEJVO0FBQzdCO0FBQ0Q7QUE5Qm9COztBQUFBO0FBQUEsSUFLTSxJQUxOOztBQWtDdkIsU0FBTyxjQUFQO0FBQ0QsQzs7Ozs7QUM5QkQ7Ozs7OztBQUVBLE9BQU8sSUFBUCxHQUFjLE9BQU8sSUFBUCxJQUFlLEVBQTdCLEMsQ0FUQTs7Ozs7OztBQVVBLE9BQU8sSUFBUCxDQUFZLGFBQVo7Ozs7Ozs7Ozs7O0FDVkE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7SUFVTSxhOzs7Ozs7Ozs7Ozs7QUFDSjs7Ozs7O3dCQU1lO0FBQ2IsYUFBTyxLQUFLLFVBQUwsQ0FBZ0IsY0FBaEIsQ0FBK0IsVUFBL0IsRUFBMkMsV0FBbEQ7QUFDRCxLO3NCQUNZLEssRUFBTztBQUNsQixXQUFLLFVBQUwsQ0FBZ0IsY0FBaEIsQ0FBK0IsVUFBL0IsRUFBMkMsV0FBM0MsR0FBeUQsS0FBekQ7QUFDRDs7O3dCQU1jO0FBQ2I7QUFDRDs7O3dCQU4rQjtBQUM5QixhQUFPLENBQUMsVUFBRCxDQUFQO0FBQ0Q7Ozs7RUFoQnlCLDhCQUFlLCtCQUFnQixXQUFoQixDQUFmLEM7O0FBdUI1QixlQUFlLE1BQWYsQ0FBc0IscUJBQXRCLEVBQTZDLGFBQTdDO2tCQUNlLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAqIFRoaXMgZmlsZSBpcyB0cmFuc3BpbGVkIHRvIGNyZWF0ZSBhbiBFUzUtY29tcGF0aWJsZSBkaXN0cmlidXRpb24gb2YgYWxsXG4gKiBjb21wb25lbnRzIGluIHRoZSBwcm9qZWN0LiBJZiB5b3UncmUgYWxyZWFkeSB1c2luZyBFUzYgeW91cnNlbGYsIGlnbm9yZSB0aGlzXG4gKiBmaWxlLCBhbmQgaW5zdGVhZCBpbXBvcnQgdGhlIHNvdXJjZSBmaWxlKHMpIHlvdSB3YW50IGZyb20gdGhlIHNwZWNpZmljXG4gKiBwYWNrYWdlIHlvdSB3YW50LlxuICovXG5cbi8vIEltcG9ydCBhbGwgdGhlIGdsb2JhbHMgZnJvbSBlYWNoIHBhY2thZ2UuXG4vLyBXZSB0ZWxsIGpzaGludCB0byBpZ25vcmUgdGhlIGZhY3QgdGhhdCB3ZSdyZSBub3QgYWN0dWFsbHkgdXNpbmcgdGhlbSBoZXJlLlxuLyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuXG5pbXBvcnQgKiBhcyBzaW1wbGVFbGVtZW50IGZyb20gJy4uL2VsaXgtc2ltcGxlLWVsZW1lbnQvZ2xvYmFscyc7XG5pbXBvcnQgKiBhcyBjb21wb25lbnRNaXhpbnMgZnJvbSAnLi4vZWxpeC1taXhpbnMvZ2xvYmFscyc7XG5pbXBvcnQgKiBhcyB3ZWJDb21wb25lbnRzIGZyb20gJy4uL2VsaXgtY29tcG9uZW50cy9nbG9iYWxzJztcblxuLyoganNoaW50IGlnbm9yZTplbmQgKi9cbiIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgdHJhbnNwaWxlZCB0byBjcmVhdGUgYW4gRVM1LWNvbXBhdGlibGUgZGlzdHJpYnV0aW9uIGluIHdoaWNoXG4gKiB0aGUgcGFja2FnZSdzIG1haW4gZmVhdHVyZShzKSBhcmUgYXZhaWxhYmxlIHZpYSB0aGUgd2luZG93LkJhc2ljIGdsb2JhbC5cbiAqIElmIHlvdSdyZSBhbHJlYWR5IHVzaW5nIEVTNiB5b3Vyc2VsZiwgaWdub3JlIHRoaXMgZmlsZSwgYW5kIGluc3RlYWQgaW1wb3J0XG4gKiB0aGUgc291cmNlIGZpbGUocykgeW91IHdhbnQgZnJvbSB0aGUgc3JjIGZvbGRlci5cbiAqL1xuXG5pbXBvcnQgU2ltcGxlQXR0cmlidXRlIGZyb20gJy4vc3JjL1NpbXBsZUF0dHJpYnV0ZSc7XG5pbXBvcnQgU2ltcGxlVGVtcGxhdGUgZnJvbSAnLi9zcmMvU2ltcGxlVGVtcGxhdGUnO1xuXG53aW5kb3cuRWxpeCA9IHdpbmRvdy5FbGl4IHx8IHt9O1xuXG53aW5kb3cuRWxpeC5TaW1wbGVBdHRyaWJ1dGUgPSBTaW1wbGVBdHRyaWJ1dGU7XG53aW5kb3cuRWxpeC5TaW1wbGVUZW1wbGF0ZSA9IFNpbXBsZVRlbXBsYXRlOyIsIlxuLyogRXhwb3J0ZWQgZnVuY3Rpb24gZXh0ZW5kcyBhIGJhc2UgY2xhc3Mgd2l0aCBTaW1wbGVBdHRyaWJ1dGUuICovXG5leHBvcnQgZGVmYXVsdCAoYmFzZSkgPT4ge1xuXG4gIC8qKlxuICAgKiBTaW1wbGUgbWl4aW4gZm9yIGhhdmluZyBhdHRyaWJ1dGUgY2hhbmdlcyB1cGRhdGUgcHJvcGVydGllcy5cbiAgICovXG4gIGNsYXNzIFNpbXBsZUF0dHJpYnV0ZSBleHRlbmRzIGJhc2Uge1xuICAgIC8qXG4gICAgICogSGFuZGxlIGEgY2hhbmdlIHRvIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgICAgKi9cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0cmlidXRlTmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG5cdCAgaWYgKHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaykgeyBzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soKTsgfVxuXHQgIC8vIElmIHRoZSBhdHRyaWJ1dGUgbmFtZSBjb3JyZXNwb25kcyB0byBhIHByb3BlcnR5IG5hbWUsIHNldCB0aGUgcHJvcGVydHkuXG5cdCAgLy8gSWdub3JlIHN0YW5kYXJkIEhUTUxFbGVtZW50IHByb3BlcnRpZXMgaGFuZGxlZCBieSB0aGUgRE9NLlxuXHQgIGlmIChhdHRyaWJ1dGVOYW1lIGluIHRoaXMgJiYgIShhdHRyaWJ1dGVOYW1lIGluIEhUTUxFbGVtZW50LnByb3RvdHlwZSkpIHtcbiAgICAgICAgdGhpc1thdHRyaWJ1dGVOYW1lXSA9IG5ld1ZhbHVlO1xuXHQgIH1cbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogU2V0L3Vuc2V0IHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgaW5kaWNhdGVkIG5hbWUuXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBleGlzdHMgcHJpbWFyaWx5IHRvIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSBhbiBlbGVtZW50IHdhbnRzIHRvXG4gICAgICogc2V0IGEgZGVmYXVsdCBwcm9wZXJ0eSB2YWx1ZSB0aGF0IHNob3VsZCBiZSByZWZsZWN0ZWQgYXMgYW4gYXR0cmlidXRlLiBBblxuICAgICAqIGltcG9ydGFudCBsaW1pdGF0aW9uIG9mIGN1c3RvbSBlbGVtZW50IGNvbnN0dXJjdG9ycyBpcyB0aGF0IHRoZXkgY2Fubm90XG4gICAgICogc2V0IGF0dHJpYnV0ZXMuIEEgY2FsbCB0byBgcmVmbGVjdEF0dHJpYnV0ZWAgZHVyaW5nIHRoZSBjb25zdHJ1Y3RvciB3aWxsXG4gICAgICogYmUgZGVmZXJyZWQgdW50aWwgdGhlIGVsZW1lbnQgaXMgY29ubmVjdGVkIHRvIHRoZSBkb2N1bWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGUgLSBUaGUgbmFtZSBvZiB0aGUgKmF0dHJpYnV0ZSogKG5vdCBwcm9wZXJ0eSkgdG8gc2V0LlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBzZXQuIElmIG51bGwsIHRoZSBhdHRyaWJ1dGUgd2lsbCBiZSByZW1vdmVkLlxuICAgICAqL1xuICAgIHJlZmxlY3RBdHRyaWJ1dGUoYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgICAgLy8gRm9yIGRvY3VtZW50YXRpb24gcHVycG9zZXMgb25seSAgXG4gICAgfVxuICAgIFxuICB9XG4gIFxuICByZXR1cm4gU2ltcGxlQXR0cmlidXRlO1xufTsiLCJcbi8qIEV4cG9ydGVkIGZ1bmN0aW9uIGV4dGVuZHMgYSBiYXNlIGNsYXNzIHdpdGggU2ltcGxlVGVtcGxhdGUuICovXG5leHBvcnQgZGVmYXVsdCAoYmFzZSkgPT4ge1xuXG4gIC8qKlxuICAgKiBTaW1wbGUgbWl4aW4gZm9yIGNsb25pbmcgYSBzdHJpbmcgdGVtcGxhdGUgaW50byBhIG5ldyBzaGFkb3cgcm9vdC5cbiAgICovXG4gIGNsYXNzIFNpbXBsZVRlbXBsYXRlIGV4dGVuZHMgYmFzZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cdCAgICBzdXBlcigpO1xuXHQgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuXHQgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgIGNvbnN0IHJvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTtcbiAgICAgICAgcm9vdC5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcblx0ICAgIH1cbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogU2V0L3Vuc2V0IHRoZSBjbGFzcyB3aXRoIHRoZSBpbmRpY2F0ZWQgbmFtZS5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIGV4aXN0cyBwcmltYXJpbHkgdG8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIGFuIGVsZW1lbnQgd2FudHMgdG9cbiAgICAgKiBzZXQgYSBkZWZhdWx0IHByb3BlcnR5IHZhbHVlIHRoYXQgc2hvdWxkIGJlIHJlZmxlY3RlZCBhcyBhcyBjbGFzcy4gQW5cbiAgICAgKiBpbXBvcnRhbnQgbGltaXRhdGlvbiBvZiBjdXN0b20gZWxlbWVudCBjb25zdHVyY3RvcnMgaXMgdGhhdCB0aGV5IGNhbm5vdFxuICAgICAqIHNldCBhdHRyaWJ1dGVzLCBpbmNsdWRpbmcgdGhlIGBjbGFzc2AgYXR0cmlidXRlLiBBIGNhbGwgdG9cbiAgICAgKiBgcmVmbGVjdENsYXNzYCBkdXJpbmcgdGhlIGNvbnN0cnVjdG9yIHdpbGwgYmUgZGVmZXJyZWQgdW50aWwgdGhlIGVsZW1lbnRcbiAgICAgKiBpcyBjb25uZWN0ZWQgdG8gdGhlIGRvY3VtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0byBzZXQuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHZhbHVlIC0gVHJ1ZSB0byBzZXQgdGhlIGNsYXNzLCBmYWxzZSB0byByZW1vdmUgaXQuXG4gICAgICovXG4gICAgcmVmbGVjdENsYXNzKGNsYXNzTmFtZSwgdmFsdWUpIHtcbiAgICAgIC8vIEZvciBkb2N1bWVudGF0aW9uIHB1cnBvc2VzIG9ubHlcbiAgICB9XG5cbiAgfVxuICBcbiAgcmV0dXJuIFNpbXBsZVRlbXBsYXRlO1xufTsiLCIvKlxuICogVGhpcyBmaWxlIGlzIHRyYW5zcGlsZWQgdG8gY3JlYXRlIGFuIEVTNS1jb21wYXRpYmxlIGRpc3RyaWJ1dGlvbiBpbiB3aGljaFxuICogdGhlIHBhY2thZ2UncyBtYWluIGZlYXR1cmUocykgYXJlIGF2YWlsYWJsZSB2aWEgdGhlIHdpbmRvdy5FbGl4IGdsb2JhbC5cbiAqIElmIHlvdSdyZSBhbHJlYWR5IHVzaW5nIEVTNiB5b3Vyc2VsZiwgaWdub3JlIHRoaXMgZmlsZSwgYW5kIGluc3RlYWQgaW1wb3J0XG4gKiB0aGUgc291cmNlIGZpbGUocykgeW91IHdhbnQgZnJvbSB0aGUgc3JjIGZvbGRlci5cbiAqL1xuXG5pbXBvcnQgU2ltcGxlRWxlbWVudCBmcm9tICcuL3NyYy9TaW1wbGVFbGVtZW50Jztcblxud2luZG93LkVsaXggPSB3aW5kb3cuRWxpeCB8fCB7fTtcbndpbmRvdy5FbGl4LlNpbXBsZUVsZW1lbnQgPSBTaW1wbGVFbGVtZW50O1xuIiwiaW1wb3J0IFNpbXBsZUF0dHJpYnV0ZSBmcm9tICcuLi8uLi9lbGl4LW1peGlucy9zcmMvU2ltcGxlQXR0cmlidXRlJztcbmltcG9ydCBTaW1wbGVUZW1wbGF0ZSBmcm9tICcuLi8uLi9lbGl4LW1peGlucy9zcmMvU2ltcGxlVGVtcGxhdGUnO1xuXG4vKipcbiAqIEEgc2ltcGxlIGVsZW1lbnRcbiAqXG4gKiBbTGl2ZSBkZW1vXShodHRwOi8vZWxpeC5vcmcvZWxpeC9wYWNrYWdlcy9lbGl4LXNpbXBsZS1lbGVtZW50LylcbiAqXG4gKiBUaGlzIGlzIGEgc2ltcGxlIGVsZW1lbnQuXG4gKlxuICogQG1peGVzIFNpbXBsZUF0dHJpYnV0ZVxuICogQG1peGVzIFNpbXBsZVRlbXBsYXRlXG4gKi9cbmNsYXNzIFNpbXBsZUVsZW1lbnQgZXh0ZW5kcyBTaW1wbGVUZW1wbGF0ZShTaW1wbGVBdHRyaWJ1dGUoSFRNTEVsZW1lbnQpKSB7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIGdyZWV0aW5nLlxuICAgKiBcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgZ3JlZXRpbmdcbiAgICovXG4gIGdldCBncmVldGluZygpIHtcbiAgICByZXR1cm4gdGhpcy5zaGFkb3dSb290LmdldEVsZW1lbnRCeUlkKCdncmVldGluZycpLnRleHRDb250ZW50O1xuICB9XG4gIHNldCBncmVldGluZyh2YWx1ZSkge1xuICAgIHRoaXMuc2hhZG93Um9vdC5nZXRFbGVtZW50QnlJZCgnZ3JlZXRpbmcnKS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9XG4gIFxuICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcbiAgICByZXR1cm4gWydncmVldGluZyddO1xuICB9XG4gIFxuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIGA8c3BhbiBpZD1cImdyZWV0aW5nXCI+SGVsbG88L3NwYW4+LCA8c2xvdD48L3Nsb3Q+LmA7XG4gIH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdlbGl4LXNpbXBsZS1lbGVtZW50JywgU2ltcGxlRWxlbWVudCk7XG5leHBvcnQgZGVmYXVsdCBTaW1wbGVFbGVtZW50OyJdfQ==
