(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./src/SimpleAttribute":2,"./src/SimpleTemplate":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

var _globals = require('../elix-simple-element/globals');

var simpleElement = _interopRequireWildcard(_globals);

var _globals2 = require('../elix-component-mixins/globals');

var componentMixins = _interopRequireWildcard(_globals2);

var _globals3 = require('../elix-components/globals');

var webComponents = _interopRequireWildcard(_globals3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

},{"../elix-component-mixins/globals":1,"../elix-components/globals":4,"../elix-simple-element/globals":5}],5:[function(require,module,exports){
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

var _SimpleAttribute = require('../../elix-component-mixins/src/SimpleAttribute');

var _SimpleAttribute2 = _interopRequireDefault(_SimpleAttribute);

var _SimpleTemplate2 = require('../../elix-component-mixins/src/SimpleTemplate');

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

},{"../../elix-component-mixins/src/SimpleAttribute":2,"../../elix-component-mixins/src/SimpleTemplate":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwYWNrYWdlcy9lbGl4LWNvbXBvbmVudC1taXhpbnMvZ2xvYmFscy5qcyIsInBhY2thZ2VzL2VsaXgtY29tcG9uZW50LW1peGlucy9zcmMvU2ltcGxlQXR0cmlidXRlLmpzIiwicGFja2FnZXMvZWxpeC1jb21wb25lbnQtbWl4aW5zL3NyYy9TaW1wbGVUZW1wbGF0ZS5qcyIsInBhY2thZ2VzL2VsaXgtY29tcG9uZW50cy9nbG9iYWxzLmpzIiwicGFja2FnZXMvZWxpeC1zaW1wbGUtZWxlbWVudC9nbG9iYWxzLmpzIiwicGFja2FnZXMvZWxpeC1zaW1wbGUtZWxlbWVudC9zcmMvU2ltcGxlRWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDT0E7Ozs7QUFDQTs7Ozs7O0FBUkE7Ozs7Ozs7QUFVQSxPQUFPLElBQVAsR0FBYyxPQUFPLElBQVAsSUFBZSxFQUE3Qjs7QUFFQSxPQUFPLElBQVAsQ0FBWSxlQUFaO0FBQ0EsT0FBTyxJQUFQLENBQVksY0FBWjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1pBO2tCQUNlLFVBQUMsSUFBRCxFQUFVOztBQUV2Qjs7O0FBRnVCLE1BS2pCLGVBTGlCO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBTXJCOzs7QUFOcUIsK0NBU0ksYUFUSixFQVNtQixRQVRuQixFQVM2QixRQVQ3QixFQVN1QztBQUM3RCw2SUFBb0M7QUFBRTtBQUFtQztBQUN6RTtBQUNBO0FBQ0EsWUFBSSxpQkFBaUIsSUFBakIsSUFBeUIsRUFBRSxpQkFBaUIsWUFBWSxTQUEvQixDQUE3QixFQUF3RTtBQUNuRSxlQUFLLGFBQUwsSUFBc0IsUUFBdEI7QUFDSjtBQUNDOztBQUVEOzs7Ozs7Ozs7Ozs7O0FBbEJxQjtBQUFBO0FBQUEsdUNBOEJKLFNBOUJJLEVBOEJPLEtBOUJQLEVBOEJjO0FBQ2pDO0FBQ0Q7QUFoQ29COztBQUFBO0FBQUEsSUFLTyxJQUxQOztBQW9DdkIsU0FBTyxlQUFQO0FBQ0QsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Q0Q7a0JBQ2UsVUFBQyxJQUFELEVBQVU7O0FBRXZCOzs7QUFGdUIsTUFLakIsY0FMaUI7QUFBQTs7QUFNckIsOEJBQWM7QUFBQTs7QUFBQTs7QUFFYixVQUFNLFdBQVcsTUFBSyxRQUF0QjtBQUNBLFVBQUksUUFBSixFQUFjO0FBQ1gsWUFBTSxPQUFPLE1BQUssWUFBTCxDQUFrQixFQUFFLE1BQU0sTUFBUixFQUFsQixDQUFiO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLFFBQWpCO0FBQ0Y7QUFOWTtBQU9iOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7QUFmcUI7QUFBQTtBQUFBLG1DQTRCUixTQTVCUSxFQTRCRyxLQTVCSCxFQTRCVTtBQUM3QjtBQUNEO0FBOUJvQjs7QUFBQTtBQUFBLElBS00sSUFMTjs7QUFrQ3ZCLFNBQU8sY0FBUDtBQUNELEM7Ozs7O0FDMUJEOztJQUFZLGE7O0FBQ1o7O0lBQVksZTs7QUFDWjs7SUFBWSxhOzs7Ozs7O0FDTlo7Ozs7OztBQUVBLE9BQU8sSUFBUCxHQUFjLE9BQU8sSUFBUCxJQUFlLEVBQTdCLEMsQ0FUQTs7Ozs7OztBQVVBLE9BQU8sSUFBUCxDQUFZLGFBQVo7Ozs7Ozs7Ozs7O0FDVkE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7SUFVTSxhOzs7Ozs7Ozs7Ozs7QUFDSjs7Ozs7O3dCQU1lO0FBQ2IsYUFBTyxLQUFLLFVBQUwsQ0FBZ0IsY0FBaEIsQ0FBK0IsVUFBL0IsRUFBMkMsV0FBbEQ7QUFDRCxLO3NCQUNZLEssRUFBTztBQUNsQixXQUFLLFVBQUwsQ0FBZ0IsY0FBaEIsQ0FBK0IsVUFBL0IsRUFBMkMsV0FBM0MsR0FBeUQsS0FBekQ7QUFDRDs7O3dCQU1jO0FBQ2I7QUFDRDs7O3dCQU4rQjtBQUM5QixhQUFPLENBQUMsVUFBRCxDQUFQO0FBQ0Q7Ozs7RUFoQnlCLDhCQUFlLCtCQUFnQixXQUFoQixDQUFmLEM7O0FBdUI1QixlQUFlLE1BQWYsQ0FBc0IscUJBQXRCLEVBQTZDLGFBQTdDO2tCQUNlLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAqIFRoaXMgZmlsZSBpcyB0cmFuc3BpbGVkIHRvIGNyZWF0ZSBhbiBFUzUtY29tcGF0aWJsZSBkaXN0cmlidXRpb24gaW4gd2hpY2hcbiAqIHRoZSBwYWNrYWdlJ3MgbWFpbiBmZWF0dXJlKHMpIGFyZSBhdmFpbGFibGUgdmlhIHRoZSB3aW5kb3cuQmFzaWMgZ2xvYmFsLlxuICogSWYgeW91J3JlIGFscmVhZHkgdXNpbmcgRVM2IHlvdXJzZWxmLCBpZ25vcmUgdGhpcyBmaWxlLCBhbmQgaW5zdGVhZCBpbXBvcnRcbiAqIHRoZSBzb3VyY2UgZmlsZShzKSB5b3Ugd2FudCBmcm9tIHRoZSBzcmMgZm9sZGVyLlxuICovXG5cbmltcG9ydCBTaW1wbGVBdHRyaWJ1dGUgZnJvbSAnLi9zcmMvU2ltcGxlQXR0cmlidXRlJztcbmltcG9ydCBTaW1wbGVUZW1wbGF0ZSBmcm9tICcuL3NyYy9TaW1wbGVUZW1wbGF0ZSc7XG5cbndpbmRvdy5FbGl4ID0gd2luZG93LkVsaXggfHwge307XG5cbndpbmRvdy5FbGl4LlNpbXBsZUF0dHJpYnV0ZSA9IFNpbXBsZUF0dHJpYnV0ZTtcbndpbmRvdy5FbGl4LlNpbXBsZVRlbXBsYXRlID0gU2ltcGxlVGVtcGxhdGU7IiwiXG4vKiBFeHBvcnRlZCBmdW5jdGlvbiBleHRlbmRzIGEgYmFzZSBjbGFzcyB3aXRoIFNpbXBsZUF0dHJpYnV0ZS4gKi9cbmV4cG9ydCBkZWZhdWx0IChiYXNlKSA9PiB7XG5cbiAgLyoqXG4gICAqIFNpbXBsZSBtaXhpbiBmb3IgaGF2aW5nIGF0dHJpYnV0ZSBjaGFuZ2VzIHVwZGF0ZSBwcm9wZXJ0aWVzLlxuICAgKi9cbiAgY2xhc3MgU2ltcGxlQXR0cmlidXRlIGV4dGVuZHMgYmFzZSB7XG4gICAgLypcbiAgICAgKiBIYW5kbGUgYSBjaGFuZ2UgdG8gdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBnaXZlbiBuYW1lLlxuICAgICAqL1xuICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyaWJ1dGVOYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcblx0ICBpZiAoc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKSB7IHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaygpOyB9XG5cdCAgLy8gSWYgdGhlIGF0dHJpYnV0ZSBuYW1lIGNvcnJlc3BvbmRzIHRvIGEgcHJvcGVydHkgbmFtZSwgc2V0IHRoZSBwcm9wZXJ0eS5cblx0ICAvLyBJZ25vcmUgc3RhbmRhcmQgSFRNTEVsZW1lbnQgcHJvcGVydGllcyBoYW5kbGVkIGJ5IHRoZSBET00uXG5cdCAgaWYgKGF0dHJpYnV0ZU5hbWUgaW4gdGhpcyAmJiAhKGF0dHJpYnV0ZU5hbWUgaW4gSFRNTEVsZW1lbnQucHJvdG90eXBlKSkge1xuICAgICAgICB0aGlzW2F0dHJpYnV0ZU5hbWVdID0gbmV3VmFsdWU7XG5cdCAgfVxuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBTZXQvdW5zZXQgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBpbmRpY2F0ZWQgbmFtZS5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIGV4aXN0cyBwcmltYXJpbHkgdG8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIGFuIGVsZW1lbnQgd2FudHMgdG9cbiAgICAgKiBzZXQgYSBkZWZhdWx0IHByb3BlcnR5IHZhbHVlIHRoYXQgc2hvdWxkIGJlIHJlZmxlY3RlZCBhcyBhbiBhdHRyaWJ1dGUuIEFuXG4gICAgICogaW1wb3J0YW50IGxpbWl0YXRpb24gb2YgY3VzdG9tIGVsZW1lbnQgY29uc3R1cmN0b3JzIGlzIHRoYXQgdGhleSBjYW5ub3RcbiAgICAgKiBzZXQgYXR0cmlidXRlcy4gQSBjYWxsIHRvIGByZWZsZWN0QXR0cmlidXRlYCBkdXJpbmcgdGhlIGNvbnN0cnVjdG9yIHdpbGxcbiAgICAgKiBiZSBkZWZlcnJlZCB1bnRpbCB0aGUgZWxlbWVudCBpcyBjb25uZWN0ZWQgdG8gdGhlIGRvY3VtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZSAtIFRoZSBuYW1lIG9mIHRoZSAqYXR0cmlidXRlKiAobm90IHByb3BlcnR5KSB0byBzZXQuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHZhbHVlIC0gVGhlIHZhbHVlIHRvIHNldC4gSWYgbnVsbCwgdGhlIGF0dHJpYnV0ZSB3aWxsIGJlIHJlbW92ZWQuXG4gICAgICovXG4gICAgcmVmbGVjdEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgICAvLyBGb3IgZG9jdW1lbnRhdGlvbiBwdXJwb3NlcyBvbmx5ICBcbiAgICB9XG4gICAgXG4gIH1cbiAgXG4gIHJldHVybiBTaW1wbGVBdHRyaWJ1dGU7XG59OyIsIlxuLyogRXhwb3J0ZWQgZnVuY3Rpb24gZXh0ZW5kcyBhIGJhc2UgY2xhc3Mgd2l0aCBTaW1wbGVUZW1wbGF0ZS4gKi9cbmV4cG9ydCBkZWZhdWx0IChiYXNlKSA9PiB7XG5cbiAgLyoqXG4gICAqIFNpbXBsZSBtaXhpbiBmb3IgY2xvbmluZyBhIHN0cmluZyB0ZW1wbGF0ZSBpbnRvIGEgbmV3IHNoYWRvdyByb290LlxuICAgKi9cbiAgY2xhc3MgU2ltcGxlVGVtcGxhdGUgZXh0ZW5kcyBiYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcblx0ICAgIHN1cGVyKCk7XG5cdCAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGU7XG5cdCAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgY29uc3Qgcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pO1xuICAgICAgICByb290LmlubmVySFRNTCA9IHRlbXBsYXRlO1xuXHQgICAgfVxuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBTZXQvdW5zZXQgdGhlIGNsYXNzIHdpdGggdGhlIGluZGljYXRlZCBuYW1lLlxuICAgICAqXG4gICAgICogVGhpcyBtZXRob2QgZXhpc3RzIHByaW1hcmlseSB0byBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgYW4gZWxlbWVudCB3YW50cyB0b1xuICAgICAqIHNldCBhIGRlZmF1bHQgcHJvcGVydHkgdmFsdWUgdGhhdCBzaG91bGQgYmUgcmVmbGVjdGVkIGFzIGFzIGNsYXNzLiBBblxuICAgICAqIGltcG9ydGFudCBsaW1pdGF0aW9uIG9mIGN1c3RvbSBlbGVtZW50IGNvbnN0dXJjdG9ycyBpcyB0aGF0IHRoZXkgY2Fubm90XG4gICAgICogc2V0IGF0dHJpYnV0ZXMsIGluY2x1ZGluZyB0aGUgYGNsYXNzYCBhdHRyaWJ1dGUuIEEgY2FsbCB0b1xuICAgICAqIGByZWZsZWN0Q2xhc3NgIGR1cmluZyB0aGUgY29uc3RydWN0b3Igd2lsbCBiZSBkZWZlcnJlZCB1bnRpbCB0aGUgZWxlbWVudFxuICAgICAqIGlzIGNvbm5lY3RlZCB0byB0aGUgZG9jdW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGNsYXNzIHRvIHNldC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmFsdWUgLSBUcnVlIHRvIHNldCB0aGUgY2xhc3MsIGZhbHNlIHRvIHJlbW92ZSBpdC5cbiAgICAgKi9cbiAgICByZWZsZWN0Q2xhc3MoY2xhc3NOYW1lLCB2YWx1ZSkge1xuICAgICAgLy8gRm9yIGRvY3VtZW50YXRpb24gcHVycG9zZXMgb25seVxuICAgIH1cblxuICB9XG4gIFxuICByZXR1cm4gU2ltcGxlVGVtcGxhdGU7XG59OyIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgdHJhbnNwaWxlZCB0byBjcmVhdGUgYW4gRVM1LWNvbXBhdGlibGUgZGlzdHJpYnV0aW9uIG9mIGFsbFxuICogY29tcG9uZW50cyBpbiB0aGUgcHJvamVjdC4gSWYgeW91J3JlIGFscmVhZHkgdXNpbmcgRVM2IHlvdXJzZWxmLCBpZ25vcmUgdGhpc1xuICogZmlsZSwgYW5kIGluc3RlYWQgaW1wb3J0IHRoZSBzb3VyY2UgZmlsZShzKSB5b3Ugd2FudCBmcm9tIHRoZSBzcGVjaWZpY1xuICogcGFja2FnZSB5b3Ugd2FudC5cbiAqL1xuXG4vLyBJbXBvcnQgYWxsIHRoZSBnbG9iYWxzIGZyb20gZWFjaCBwYWNrYWdlLlxuLy8gV2UgdGVsbCBqc2hpbnQgdG8gaWdub3JlIHRoZSBmYWN0IHRoYXQgd2UncmUgbm90IGFjdHVhbGx5IHVzaW5nIHRoZW0gaGVyZS5cbi8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblxuaW1wb3J0ICogYXMgc2ltcGxlRWxlbWVudCBmcm9tICcuLi9lbGl4LXNpbXBsZS1lbGVtZW50L2dsb2JhbHMnO1xuaW1wb3J0ICogYXMgY29tcG9uZW50TWl4aW5zIGZyb20gJy4uL2VsaXgtY29tcG9uZW50LW1peGlucy9nbG9iYWxzJztcbmltcG9ydCAqIGFzIHdlYkNvbXBvbmVudHMgZnJvbSAnLi4vZWxpeC1jb21wb25lbnRzL2dsb2JhbHMnO1xuXG4vKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuIiwiLypcbiAqIFRoaXMgZmlsZSBpcyB0cmFuc3BpbGVkIHRvIGNyZWF0ZSBhbiBFUzUtY29tcGF0aWJsZSBkaXN0cmlidXRpb24gaW4gd2hpY2hcbiAqIHRoZSBwYWNrYWdlJ3MgbWFpbiBmZWF0dXJlKHMpIGFyZSBhdmFpbGFibGUgdmlhIHRoZSB3aW5kb3cuRWxpeCBnbG9iYWwuXG4gKiBJZiB5b3UncmUgYWxyZWFkeSB1c2luZyBFUzYgeW91cnNlbGYsIGlnbm9yZSB0aGlzIGZpbGUsIGFuZCBpbnN0ZWFkIGltcG9ydFxuICogdGhlIHNvdXJjZSBmaWxlKHMpIHlvdSB3YW50IGZyb20gdGhlIHNyYyBmb2xkZXIuXG4gKi9cblxuaW1wb3J0IFNpbXBsZUVsZW1lbnQgZnJvbSAnLi9zcmMvU2ltcGxlRWxlbWVudCc7XG5cbndpbmRvdy5FbGl4ID0gd2luZG93LkVsaXggfHwge307XG53aW5kb3cuRWxpeC5TaW1wbGVFbGVtZW50ID0gU2ltcGxlRWxlbWVudDtcbiIsImltcG9ydCBTaW1wbGVBdHRyaWJ1dGUgZnJvbSAnLi4vLi4vZWxpeC1jb21wb25lbnQtbWl4aW5zL3NyYy9TaW1wbGVBdHRyaWJ1dGUnO1xuaW1wb3J0IFNpbXBsZVRlbXBsYXRlIGZyb20gJy4uLy4uL2VsaXgtY29tcG9uZW50LW1peGlucy9zcmMvU2ltcGxlVGVtcGxhdGUnO1xuXG4vKipcbiAqIEEgc2ltcGxlIGVsZW1lbnRcbiAqXG4gKiBbTGl2ZSBkZW1vXShodHRwOi8vZWxpeC5vcmcvZWxpeC9wYWNrYWdlcy9lbGl4LXNpbXBsZS1lbGVtZW50LylcbiAqXG4gKiBUaGlzIGlzIGEgc2ltcGxlIGVsZW1lbnQuXG4gKlxuICogQG1peGVzIFNpbXBsZUF0dHJpYnV0ZVxuICogQG1peGVzIFNpbXBsZVRlbXBsYXRlXG4gKi9cbmNsYXNzIFNpbXBsZUVsZW1lbnQgZXh0ZW5kcyBTaW1wbGVUZW1wbGF0ZShTaW1wbGVBdHRyaWJ1dGUoSFRNTEVsZW1lbnQpKSB7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIGdyZWV0aW5nLlxuICAgKiBcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgZ3JlZXRpbmdcbiAgICovXG4gIGdldCBncmVldGluZygpIHtcbiAgICByZXR1cm4gdGhpcy5zaGFkb3dSb290LmdldEVsZW1lbnRCeUlkKCdncmVldGluZycpLnRleHRDb250ZW50O1xuICB9XG4gIHNldCBncmVldGluZyh2YWx1ZSkge1xuICAgIHRoaXMuc2hhZG93Um9vdC5nZXRFbGVtZW50QnlJZCgnZ3JlZXRpbmcnKS50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9XG4gIFxuICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcbiAgICByZXR1cm4gWydncmVldGluZyddO1xuICB9XG4gIFxuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIGA8c3BhbiBpZD1cImdyZWV0aW5nXCI+SGVsbG88L3NwYW4+LCA8c2xvdD48L3Nsb3Q+LmA7XG4gIH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdlbGl4LXNpbXBsZS1lbGVtZW50JywgU2ltcGxlRWxlbWVudCk7XG5leHBvcnQgZGVmYXVsdCBTaW1wbGVFbGVtZW50OyJdfQ==
