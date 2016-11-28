(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"./src/SimpleElement":4}],4:[function(require,module,exports){
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

},{"../../elix-component-mixins/src/SimpleAttribute":1,"../../elix-component-mixins/src/SimpleTemplate":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwYWNrYWdlcy9lbGl4LWNvbXBvbmVudC1taXhpbnMvc3JjL1NpbXBsZUF0dHJpYnV0ZS5qcyIsInBhY2thZ2VzL2VsaXgtY29tcG9uZW50LW1peGlucy9zcmMvU2ltcGxlVGVtcGxhdGUuanMiLCJwYWNrYWdlcy9lbGl4LXNpbXBsZS1lbGVtZW50L2dsb2JhbHMuanMiLCJwYWNrYWdlcy9lbGl4LXNpbXBsZS1lbGVtZW50L3NyYy9TaW1wbGVFbGVtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0NBO2tCQUNlLFVBQUMsSUFBRCxFQUFVOztBQUV2Qjs7O0FBRnVCLE1BS2pCLGVBTGlCO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBTXJCOzs7QUFOcUIsK0NBU0ksYUFUSixFQVNtQixRQVRuQixFQVM2QixRQVQ3QixFQVN1QztBQUM3RCw2SUFBb0M7QUFBRTtBQUFtQztBQUN6RTtBQUNBO0FBQ0EsWUFBSSxpQkFBaUIsSUFBakIsSUFBeUIsRUFBRSxpQkFBaUIsWUFBWSxTQUEvQixDQUE3QixFQUF3RTtBQUNuRSxlQUFLLGFBQUwsSUFBc0IsUUFBdEI7QUFDSjtBQUNDOztBQUVEOzs7Ozs7Ozs7Ozs7O0FBbEJxQjtBQUFBO0FBQUEsdUNBOEJKLFNBOUJJLEVBOEJPLEtBOUJQLEVBOEJjO0FBQ2pDO0FBQ0Q7QUFoQ29COztBQUFBO0FBQUEsSUFLTyxJQUxQOztBQW9DdkIsU0FBTyxlQUFQO0FBQ0QsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Q0Q7a0JBQ2UsVUFBQyxJQUFELEVBQVU7O0FBRXZCOzs7QUFGdUIsTUFLakIsY0FMaUI7QUFBQTs7QUFNckIsOEJBQWM7QUFBQTs7QUFBQTs7QUFFYixVQUFNLFdBQVcsTUFBSyxRQUF0QjtBQUNBLFVBQUksUUFBSixFQUFjO0FBQ1gsWUFBTSxPQUFPLE1BQUssWUFBTCxDQUFrQixFQUFFLE1BQU0sTUFBUixFQUFsQixDQUFiO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLFFBQWpCO0FBQ0Y7QUFOWTtBQU9iOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7QUFmcUI7QUFBQTtBQUFBLG1DQTRCUixTQTVCUSxFQTRCRyxLQTVCSCxFQTRCVTtBQUM3QjtBQUNEO0FBOUJvQjs7QUFBQTtBQUFBLElBS00sSUFMTjs7QUFrQ3ZCLFNBQU8sY0FBUDtBQUNELEM7Ozs7O0FDOUJEOzs7Ozs7QUFFQSxPQUFPLElBQVAsR0FBYyxPQUFPLElBQVAsSUFBZSxFQUE3QixDLENBVEE7Ozs7Ozs7QUFVQSxPQUFPLElBQVAsQ0FBWSxhQUFaOzs7Ozs7Ozs7OztBQ1ZBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBOzs7Ozs7Ozs7O0lBVU0sYTs7Ozs7Ozs7Ozs7O0FBQ0o7Ozs7Ozt3QkFNZTtBQUNiLGFBQU8sS0FBSyxVQUFMLENBQWdCLGNBQWhCLENBQStCLFVBQS9CLEVBQTJDLFdBQWxEO0FBQ0QsSztzQkFDWSxLLEVBQU87QUFDbEIsV0FBSyxVQUFMLENBQWdCLGNBQWhCLENBQStCLFVBQS9CLEVBQTJDLFdBQTNDLEdBQXlELEtBQXpEO0FBQ0Q7Ozt3QkFNYztBQUNiO0FBQ0Q7Ozt3QkFOK0I7QUFDOUIsYUFBTyxDQUFDLFVBQUQsQ0FBUDtBQUNEOzs7O0VBaEJ5Qiw4QkFBZSwrQkFBZ0IsV0FBaEIsQ0FBZixDOztBQXVCNUIsZUFBZSxNQUFmLENBQXNCLHFCQUF0QixFQUE2QyxhQUE3QztrQkFDZSxhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLyogRXhwb3J0ZWQgZnVuY3Rpb24gZXh0ZW5kcyBhIGJhc2UgY2xhc3Mgd2l0aCBTaW1wbGVBdHRyaWJ1dGUuICovXG5leHBvcnQgZGVmYXVsdCAoYmFzZSkgPT4ge1xuXG4gIC8qKlxuICAgKiBTaW1wbGUgbWl4aW4gZm9yIGhhdmluZyBhdHRyaWJ1dGUgY2hhbmdlcyB1cGRhdGUgcHJvcGVydGllcy5cbiAgICovXG4gIGNsYXNzIFNpbXBsZUF0dHJpYnV0ZSBleHRlbmRzIGJhc2Uge1xuICAgIC8qXG4gICAgICogSGFuZGxlIGEgY2hhbmdlIHRvIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgICAgKi9cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0cmlidXRlTmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG5cdCAgaWYgKHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaykgeyBzdXBlci5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soKTsgfVxuXHQgIC8vIElmIHRoZSBhdHRyaWJ1dGUgbmFtZSBjb3JyZXNwb25kcyB0byBhIHByb3BlcnR5IG5hbWUsIHNldCB0aGUgcHJvcGVydHkuXG5cdCAgLy8gSWdub3JlIHN0YW5kYXJkIEhUTUxFbGVtZW50IHByb3BlcnRpZXMgaGFuZGxlZCBieSB0aGUgRE9NLlxuXHQgIGlmIChhdHRyaWJ1dGVOYW1lIGluIHRoaXMgJiYgIShhdHRyaWJ1dGVOYW1lIGluIEhUTUxFbGVtZW50LnByb3RvdHlwZSkpIHtcbiAgICAgICAgdGhpc1thdHRyaWJ1dGVOYW1lXSA9IG5ld1ZhbHVlO1xuXHQgIH1cbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogU2V0L3Vuc2V0IHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgaW5kaWNhdGVkIG5hbWUuXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBleGlzdHMgcHJpbWFyaWx5IHRvIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSBhbiBlbGVtZW50IHdhbnRzIHRvXG4gICAgICogc2V0IGEgZGVmYXVsdCBwcm9wZXJ0eSB2YWx1ZSB0aGF0IHNob3VsZCBiZSByZWZsZWN0ZWQgYXMgYW4gYXR0cmlidXRlLiBBblxuICAgICAqIGltcG9ydGFudCBsaW1pdGF0aW9uIG9mIGN1c3RvbSBlbGVtZW50IGNvbnN0dXJjdG9ycyBpcyB0aGF0IHRoZXkgY2Fubm90XG4gICAgICogc2V0IGF0dHJpYnV0ZXMuIEEgY2FsbCB0byBgcmVmbGVjdEF0dHJpYnV0ZWAgZHVyaW5nIHRoZSBjb25zdHJ1Y3RvciB3aWxsXG4gICAgICogYmUgZGVmZXJyZWQgdW50aWwgdGhlIGVsZW1lbnQgaXMgY29ubmVjdGVkIHRvIHRoZSBkb2N1bWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGUgLSBUaGUgbmFtZSBvZiB0aGUgKmF0dHJpYnV0ZSogKG5vdCBwcm9wZXJ0eSkgdG8gc2V0LlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBzZXQuIElmIG51bGwsIHRoZSBhdHRyaWJ1dGUgd2lsbCBiZSByZW1vdmVkLlxuICAgICAqL1xuICAgIHJlZmxlY3RBdHRyaWJ1dGUoYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgICAgLy8gRm9yIGRvY3VtZW50YXRpb24gcHVycG9zZXMgb25seSAgXG4gICAgfVxuICAgIFxuICB9XG4gIFxuICByZXR1cm4gU2ltcGxlQXR0cmlidXRlO1xufTsiLCJcbi8qIEV4cG9ydGVkIGZ1bmN0aW9uIGV4dGVuZHMgYSBiYXNlIGNsYXNzIHdpdGggU2ltcGxlVGVtcGxhdGUuICovXG5leHBvcnQgZGVmYXVsdCAoYmFzZSkgPT4ge1xuXG4gIC8qKlxuICAgKiBTaW1wbGUgbWl4aW4gZm9yIGNsb25pbmcgYSBzdHJpbmcgdGVtcGxhdGUgaW50byBhIG5ldyBzaGFkb3cgcm9vdC5cbiAgICovXG4gIGNsYXNzIFNpbXBsZVRlbXBsYXRlIGV4dGVuZHMgYmFzZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cdCAgICBzdXBlcigpO1xuXHQgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuXHQgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgIGNvbnN0IHJvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTtcbiAgICAgICAgcm9vdC5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcblx0ICAgIH1cbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogU2V0L3Vuc2V0IHRoZSBjbGFzcyB3aXRoIHRoZSBpbmRpY2F0ZWQgbmFtZS5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIGV4aXN0cyBwcmltYXJpbHkgdG8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIGFuIGVsZW1lbnQgd2FudHMgdG9cbiAgICAgKiBzZXQgYSBkZWZhdWx0IHByb3BlcnR5IHZhbHVlIHRoYXQgc2hvdWxkIGJlIHJlZmxlY3RlZCBhcyBhcyBjbGFzcy4gQW5cbiAgICAgKiBpbXBvcnRhbnQgbGltaXRhdGlvbiBvZiBjdXN0b20gZWxlbWVudCBjb25zdHVyY3RvcnMgaXMgdGhhdCB0aGV5IGNhbm5vdFxuICAgICAqIHNldCBhdHRyaWJ1dGVzLCBpbmNsdWRpbmcgdGhlIGBjbGFzc2AgYXR0cmlidXRlLiBBIGNhbGwgdG9cbiAgICAgKiBgcmVmbGVjdENsYXNzYCBkdXJpbmcgdGhlIGNvbnN0cnVjdG9yIHdpbGwgYmUgZGVmZXJyZWQgdW50aWwgdGhlIGVsZW1lbnRcbiAgICAgKiBpcyBjb25uZWN0ZWQgdG8gdGhlIGRvY3VtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0byBzZXQuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHZhbHVlIC0gVHJ1ZSB0byBzZXQgdGhlIGNsYXNzLCBmYWxzZSB0byByZW1vdmUgaXQuXG4gICAgICovXG4gICAgcmVmbGVjdENsYXNzKGNsYXNzTmFtZSwgdmFsdWUpIHtcbiAgICAgIC8vIEZvciBkb2N1bWVudGF0aW9uIHB1cnBvc2VzIG9ubHlcbiAgICB9XG5cbiAgfVxuICBcbiAgcmV0dXJuIFNpbXBsZVRlbXBsYXRlO1xufTsiLCIvKlxuICogVGhpcyBmaWxlIGlzIHRyYW5zcGlsZWQgdG8gY3JlYXRlIGFuIEVTNS1jb21wYXRpYmxlIGRpc3RyaWJ1dGlvbiBpbiB3aGljaFxuICogdGhlIHBhY2thZ2UncyBtYWluIGZlYXR1cmUocykgYXJlIGF2YWlsYWJsZSB2aWEgdGhlIHdpbmRvdy5FbGl4IGdsb2JhbC5cbiAqIElmIHlvdSdyZSBhbHJlYWR5IHVzaW5nIEVTNiB5b3Vyc2VsZiwgaWdub3JlIHRoaXMgZmlsZSwgYW5kIGluc3RlYWQgaW1wb3J0XG4gKiB0aGUgc291cmNlIGZpbGUocykgeW91IHdhbnQgZnJvbSB0aGUgc3JjIGZvbGRlci5cbiAqL1xuXG5pbXBvcnQgU2ltcGxlRWxlbWVudCBmcm9tICcuL3NyYy9TaW1wbGVFbGVtZW50Jztcblxud2luZG93LkVsaXggPSB3aW5kb3cuRWxpeCB8fCB7fTtcbndpbmRvdy5FbGl4LlNpbXBsZUVsZW1lbnQgPSBTaW1wbGVFbGVtZW50O1xuIiwiaW1wb3J0IFNpbXBsZUF0dHJpYnV0ZSBmcm9tICcuLi8uLi9lbGl4LWNvbXBvbmVudC1taXhpbnMvc3JjL1NpbXBsZUF0dHJpYnV0ZSc7XG5pbXBvcnQgU2ltcGxlVGVtcGxhdGUgZnJvbSAnLi4vLi4vZWxpeC1jb21wb25lbnQtbWl4aW5zL3NyYy9TaW1wbGVUZW1wbGF0ZSc7XG5cbi8qKlxuICogQSBzaW1wbGUgZWxlbWVudFxuICpcbiAqIFtMaXZlIGRlbW9dKGh0dHA6Ly9lbGl4Lm9yZy9lbGl4L3BhY2thZ2VzL2VsaXgtc2ltcGxlLWVsZW1lbnQvKVxuICpcbiAqIFRoaXMgaXMgYSBzaW1wbGUgZWxlbWVudC5cbiAqXG4gKiBAbWl4ZXMgU2ltcGxlQXR0cmlidXRlXG4gKiBAbWl4ZXMgU2ltcGxlVGVtcGxhdGVcbiAqL1xuY2xhc3MgU2ltcGxlRWxlbWVudCBleHRlbmRzIFNpbXBsZVRlbXBsYXRlKFNpbXBsZUF0dHJpYnV0ZShIVE1MRWxlbWVudCkpIHtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgZ3JlZXRpbmcuXG4gICAqIFxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCBncmVldGluZ1xuICAgKi9cbiAgZ2V0IGdyZWV0aW5nKCkge1xuICAgIHJldHVybiB0aGlzLnNoYWRvd1Jvb3QuZ2V0RWxlbWVudEJ5SWQoJ2dyZWV0aW5nJykudGV4dENvbnRlbnQ7XG4gIH1cbiAgc2V0IGdyZWV0aW5nKHZhbHVlKSB7XG4gICAgdGhpcy5zaGFkb3dSb290LmdldEVsZW1lbnRCeUlkKCdncmVldGluZycpLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH1cbiAgXG4gIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuICAgIHJldHVybiBbJ2dyZWV0aW5nJ107XG4gIH1cbiAgXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gYDxzcGFuIGlkPVwiZ3JlZXRpbmdcIj5IZWxsbzwvc3Bhbj4sIDxzbG90Pjwvc2xvdD4uYDtcbiAgfVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2VsaXgtc2ltcGxlLWVsZW1lbnQnLCBTaW1wbGVFbGVtZW50KTtcbmV4cG9ydCBkZWZhdWx0IFNpbXBsZUVsZW1lbnQ7Il19
