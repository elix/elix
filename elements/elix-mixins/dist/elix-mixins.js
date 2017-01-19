/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _SimpleAttributeMixin = __webpack_require__(2);
	
	var _SimpleAttributeMixin2 = _interopRequireDefault(_SimpleAttributeMixin);
	
	var _SimpleTemplateMixin = __webpack_require__(3);
	
	var _SimpleTemplateMixin2 = _interopRequireDefault(_SimpleTemplateMixin);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	 * This file is transpiled to create an ES5-compatible distribution in which
	 * the package's main feature(s) are available via the window.Basic global.
	 * If you're already using ES6 yourself, ignore this file, and instead import
	 * the source file(s) you want from the src folder.
	 */
	
	window.Elix = window.Elix || {};
	
	window.Elix.SimpleAttributeMixin = _SimpleAttributeMixin2.default;
	window.Elix.SimpleTemplateMixin = _SimpleTemplateMixin2.default;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	exports.default = SimpleAttributeMixin;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Mixin which adds simplistic mapping of attributes to properties.
	 *
	 * @module SimpleAttributeMixin
	 * @param base {Class} the base class to extend
	 * @returns {Class} the extended class
	 */
	function SimpleAttributeMixin(base) {
	
	  /**
	   * The class prototype added by the mixin.
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
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.default = SimpleTemplateMixin;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Mixin which adds a simplistic means of cloning a string template into a new
	 * shadow root.
	 *
	 * @module SimpleTemplateMixin
	 * @param base {Class} the base class to extend
	 * @returns {Class} the extended class
	 */
	function SimpleTemplateMixin(base) {
	
	  /**
	   * The class prototype added by the mixin.
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
	}

/***/ }
/******/ ]);
//# sourceMappingURL=elix-mixins.js.map