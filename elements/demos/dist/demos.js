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

	__webpack_require__(1);
	__webpack_require__(20);
	module.exports = __webpack_require__(22);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _AttributeMarshallingMixin = __webpack_require__(2);
	
	var _AttributeMarshallingMixin2 = _interopRequireDefault(_AttributeMarshallingMixin);
	
	var _ClickSelectionMixin = __webpack_require__(5);
	
	var _ClickSelectionMixin2 = _interopRequireDefault(_ClickSelectionMixin);
	
	var _ContentItemsMixin = __webpack_require__(7);
	
	var _ContentItemsMixin2 = _interopRequireDefault(_ContentItemsMixin);
	
	var _DirectionSelectionMixin = __webpack_require__(9);
	
	var _DirectionSelectionMixin2 = _interopRequireDefault(_DirectionSelectionMixin);
	
	var _KeyboardDirectionMixin = __webpack_require__(10);
	
	var _KeyboardDirectionMixin2 = _interopRequireDefault(_KeyboardDirectionMixin);
	
	var _KeyboardMixin = __webpack_require__(11);
	
	var _KeyboardMixin2 = _interopRequireDefault(_KeyboardMixin);
	
	var _KeyboardPagedSelectionMixin = __webpack_require__(12);
	
	var _KeyboardPagedSelectionMixin2 = _interopRequireDefault(_KeyboardPagedSelectionMixin);
	
	var _KeyboardPrefixSelectionMixin = __webpack_require__(14);
	
	var _KeyboardPrefixSelectionMixin2 = _interopRequireDefault(_KeyboardPrefixSelectionMixin);
	
	var _SelectionAriaMixin = __webpack_require__(16);
	
	var _SelectionAriaMixin2 = _interopRequireDefault(_SelectionAriaMixin);
	
	var _SelectionInViewMixin = __webpack_require__(17);
	
	var _SelectionInViewMixin2 = _interopRequireDefault(_SelectionInViewMixin);
	
	var _ShadowTemplateMixin = __webpack_require__(18);
	
	var _ShadowTemplateMixin2 = _interopRequireDefault(_ShadowTemplateMixin);
	
	var _SingleSelectionMixin = __webpack_require__(19);
	
	var _SingleSelectionMixin2 = _interopRequireDefault(_SingleSelectionMixin);
	
	var _symbols = __webpack_require__(6);
	
	var _symbols2 = _interopRequireDefault(_symbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Demo of a list box with hard-coded contents.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * As a list source, this enumerates `navigator.plugins`.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	// We want to apply a number of mixin functions to HTMLElement.
	var mixins = [_AttributeMarshallingMixin2.default, _ClickSelectionMixin2.default, _ContentItemsMixin2.default, _DirectionSelectionMixin2.default, _KeyboardDirectionMixin2.default, _KeyboardMixin2.default, _KeyboardPagedSelectionMixin2.default, _KeyboardPrefixSelectionMixin2.default, _SelectionAriaMixin2.default, _SelectionInViewMixin2.default, _ShadowTemplateMixin2.default, _SingleSelectionMixin2.default];
	
	// The mixins are functions, so an efficient way to apply them all is with
	// reduce. This is just function composition. We end up with a base class we
	// can extend below.
	var base = mixins.reduce(function (cls, mixin) {
	  return mixin(cls);
	}, HTMLElement);
	
	var BrowserPluginList = function (_base) {
	  _inherits(BrowserPluginList, _base);
	
	  function BrowserPluginList() {
	    _classCallCheck(this, BrowserPluginList);
	
	    return _possibleConstructorReturn(this, (BrowserPluginList.__proto__ || Object.getPrototypeOf(BrowserPluginList)).apply(this, arguments));
	  }
	
	  _createClass(BrowserPluginList, [{
	    key: _symbols2.default.itemAdded,
	
	
	    // HACK to work around limitations of pre-v1 ShadyCSS.
	    value: function value(item) {
	      if (_get(BrowserPluginList.prototype.__proto__ || Object.getPrototypeOf(BrowserPluginList.prototype), _symbols2.default.itemAdded, this)) {
	        _get(BrowserPluginList.prototype.__proto__ || Object.getPrototypeOf(BrowserPluginList.prototype), _symbols2.default.itemAdded, this).call(this, item);
	      }
	      item.classList.add('style-scope');
	      item.classList.add('browser-plugin-list');
	    }
	
	    // Map item selection to a `selected` CSS class.
	
	  }, {
	    key: _symbols2.default.itemSelected,
	    value: function value(item, selected) {
	      if (_get(BrowserPluginList.prototype.__proto__ || Object.getPrototypeOf(BrowserPluginList.prototype), _symbols2.default.itemSelected, this)) {
	        _get(BrowserPluginList.prototype.__proto__ || Object.getPrototypeOf(BrowserPluginList.prototype), _symbols2.default.itemSelected, this).call(this, item, selected);
	      }
	      item.classList.toggle('selected', selected);
	    }
	  }, {
	    key: _symbols2.default.shadowCreated,
	    value: function value() {
	      if (_get(BrowserPluginList.prototype.__proto__ || Object.getPrototypeOf(BrowserPluginList.prototype), _symbols2.default.shadowCreated, this)) {
	        _get(BrowserPluginList.prototype.__proto__ || Object.getPrototypeOf(BrowserPluginList.prototype), _symbols2.default.shadowCreated, this).call(this);
	      }
	      var choices = [].concat(_toConsumableArray(navigator.plugins)).map(function (plugin) {
	        return plugin.name;
	      });
	      var sorted = choices.sort();
	      setOptions(this, sorted);
	    }
	
	    // Define a template that will be stamped into the Shadow DOM by the
	    // ShadowTemplateMixin.
	
	  }, {
	    key: _symbols2.default.content,
	    get: function get() {
	      return this.shadowRoot.querySelector('#devicesContainer').children;
	    }
	
	    // We define a collection of default property values which can be set in
	    // the constructor or connectedCallback. Defining the actual default values
	    // in those calls would complicate things if a subclass someday wants to
	    // define its own default value.
	
	  }, {
	    key: _symbols2.default.defaults,
	    get: function get() {
	      var defaults = _get(BrowserPluginList.prototype.__proto__ || Object.getPrototypeOf(BrowserPluginList.prototype), _symbols2.default.defaults, this) || {};
	      // By default, we assume the list presents list items vertically.
	      defaults.orientation = 'vertical';
	      return defaults;
	    }
	  }, {
	    key: _symbols2.default.template,
	    get: function get() {
	      return '\n      <style>\n      :host {\n        border: 1px solid gray;\n        box-sizing: border-box;\n        cursor: default;\n        display: inline-flex;\n        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n      }\n\n      #devicesContainer {\n        flex: 1;\n        -webkit-overflow-scrolling: touch; /* for momentum scrolling */\n        overflow-x: hidden;\n        overflow-y: scroll;\n      }\n\n      #devicesContainer > * {\n        cursor: default;\n        padding: 0.25em;\n        -webkit-user-select: none;\n        -moz-user-select: none;\n        -ms-user-select: none;\n        user-select: none;\n      }\n\n      #devicesContainer > .selected {\n        background: highlight;\n        color: highlighttext;\n      }\n      </style>\n\n      <div id="devicesContainer" role="none"></div>\n    ';
	    }
	  }]);
	
	  return BrowserPluginList;
	}(base);
	
	function setOptions(element, options) {
	  var container = element.shadowRoot.querySelector('#devicesContainer');
	  while (container.children.length > 0) {
	    container.children[0].remove();
	  }
	  var divs = options.map(function (option) {
	    var div = document.createElement('div');
	    div.textContent = option;
	    return div;
	  });
	  divs.forEach(function (option) {
	    return container.appendChild(option);
	  });
	  element[_symbols2.default.contentChanged]();
	}
	
	customElements.define('browser-plugin-list', BrowserPluginList);
	exports.default = BrowserPluginList;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	exports.default = AttributeMarshallingMixin;
	
	var _attributes = __webpack_require__(3);
	
	var attributes = _interopRequireWildcard(_attributes);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// Memoized maps of attribute to property names and vice versa.
	var attributeToPropertyNames = {};
	var propertyNamesToAttributes = {};
	
	/**
	 * Mixin which marshalls attributes to properties and vice versa.
	 *
	 * If your component exposes a setter for a property, it's generally a good
	 * idea to let devs using your component be able to set that property in HTML
	 * via an element attribute. You can code that yourself by writing an
	 * `attributeChangedCallback`, or you can use this mixin to get a degree of
	 * automatic support.
	 *
	 * This mixin implements an `attributeChangedCallback` that will attempt to
	 * convert a change in an element attribute into a call to the corresponding
	 * property setter. Attributes typically follow hyphenated names ("foo-bar"),
	 * whereas properties typically use camelCase names ("fooBar"). This mixin
	 * respects that convention, automatically mapping the hyphenated attribute
	 * name to the corresponding camelCase property name.
	 *
	 * Example: You define a component using this mixin:
	 *
	 *     class MyElement extends AttributeMarshallingMixin(HTMLElement) {
	 *       get fooBar() { return this._fooBar; }
	 *       set fooBar(value) { this._fooBar = value; }
	 *     }
	 *     customElements.define('my-element', MyElement);
	 *
	 * If someone then instantiates your component in HTML:
	 *
	 *     <my-element foo-bar="Hello"></my-element>
	 *
	 * Then, after the element has been upgraded, the `fooBar` setter will
	 * automatically be invoked with the initial value "Hello".
	 *
	 * Attributes can only have string values. If you'd like to convert string
	 * attributes to other types (numbers, booleans), you must implement parsing
	 * yourself.
	 *
	 * This mixin also exposes helpers for reflecting attributes and classes to
	 * the element. These helpers can be invoked during a component's constructor;
	 * any attributes or classes set during the constructor are applied when the
	 * component's `connectedCallback` is invoked.
	 *
	 * @module AttributeMarshallingMixin
	 * @param base {Class} the base class to extend
	 * @returns {Class} the extended class
	 */
	function AttributeMarshallingMixin(base) {
	
	  /**
	   * The class prototype added by the mixin.
	   */
	  var AttributeMarshalling = function (_base) {
	    _inherits(AttributeMarshalling, _base);
	
	    function AttributeMarshalling() {
	      _classCallCheck(this, AttributeMarshalling);
	
	      return _possibleConstructorReturn(this, (AttributeMarshalling.__proto__ || Object.getPrototypeOf(AttributeMarshalling)).apply(this, arguments));
	    }
	
	    _createClass(AttributeMarshalling, [{
	      key: 'attributeChangedCallback',
	
	
	      /*
	       * Handle a change to the attribute with the given name.
	       */
	      value: function attributeChangedCallback(attributeName, oldValue, newValue) {
	        if (_get(AttributeMarshalling.prototype.__proto__ || Object.getPrototypeOf(AttributeMarshalling.prototype), 'attributeChangedCallback', this)) {
	          _get(AttributeMarshalling.prototype.__proto__ || Object.getPrototypeOf(AttributeMarshalling.prototype), 'attributeChangedCallback', this).call(this);
	        }
	        var propertyName = attributeToPropertyName(attributeName);
	        // If the attribute name corresponds to a property name, set the property.
	        if (propertyName in this) {
	          this[propertyName] = newValue;
	        }
	      }
	    }, {
	      key: 'connectedCallback',
	      value: function connectedCallback() {
	        if (_get(AttributeMarshalling.prototype.__proto__ || Object.getPrototypeOf(AttributeMarshalling.prototype), 'connectedCallback', this)) {
	          _get(AttributeMarshalling.prototype.__proto__ || Object.getPrototypeOf(AttributeMarshalling.prototype), 'connectedCallback', this).call(this);
	        }
	        // Reflect any attributes set during constructor.
	        attributes.writePendingAttributes(this);
	      }
	    }, {
	      key: 'reflectAttribute',
	
	
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
	      value: function reflectAttribute(attribute, value) {
	        return attributes.setAttribute(this, attribute, value);
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
	
	    }, {
	      key: 'reflectClass',
	      value: function reflectClass(className, value) {
	        return attributes.toggleClass(this, className, value);
	      }
	    }], [{
	      key: 'observedAttributes',
	      get: function get() {
	        return attributesForClass(this);
	      }
	    }]);
	
	    return AttributeMarshalling;
	  }(base);
	
	  return AttributeMarshalling;
	}
	
	// Return the custom attributes for the given class.
	function attributesForClass(classFn) {
	
	  // We treat the element base classes as if they have no attributes, since we
	  // don't want to receive attributeChangedCallback for them.
	  if (classFn === HTMLElement || classFn === Object) {
	    return [];
	  }
	
	  // Get attributes for parent class.
	  var baseClass = Object.getPrototypeOf(classFn.prototype).constructor;
	  // See if parent class defines observedAttributes manually.
	  var baseAttributes = baseClass.observedAttributes;
	  if (!baseAttributes) {
	    // Calculate parent class attributes ourselves.
	    baseAttributes = attributesForClass(baseClass);
	  }
	
	  // Get attributes for this class.
	  var propertyNames = Object.getOwnPropertyNames(classFn.prototype);
	  var setterNames = propertyNames.filter(function (propertyName) {
	    return typeof Object.getOwnPropertyDescriptor(classFn.prototype, propertyName).set === 'function';
	  });
	  var attributes = setterNames.map(function (setterName) {
	    return propertyNameToAttribute(setterName);
	  });
	
	  // Merge.
	  var diff = attributes.filter(function (attribute) {
	    return baseAttributes.indexOf(attribute) < 0;
	  });
	  return baseAttributes.concat(diff);
	}
	
	// Convert hyphenated foo-bar attribute name to camel case fooBar property name.
	function attributeToPropertyName(attributeName) {
	  var propertyName = attributeToPropertyNames[attributeName];
	  if (!propertyName) {
	    // Convert and memoize.
	    var hyphenRegEx = /-([a-z])/g;
	    propertyName = attributeName.replace(hyphenRegEx, function (match) {
	      return match[1].toUpperCase();
	    });
	    attributeToPropertyNames[attributeName] = propertyName;
	  }
	  return propertyName;
	}
	
	// Convert a camel case fooBar property name to a hyphenated foo-bar attribute.
	function propertyNameToAttribute(propertyName) {
	  var attribute = propertyNamesToAttributes[propertyName];
	  if (!attribute) {
	    // Convert and memoize.
	    var uppercaseRegEx = /([A-Z])/g;
	    attribute = propertyName.replace(uppercaseRegEx, '-$1').toLowerCase();
	  }
	  return attribute;
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setAttribute = setAttribute;
	exports.toggleClass = toggleClass;
	exports.writePendingAttributes = writePendingAttributes;
	
	var _Symbol2 = __webpack_require__(4);
	
	var _Symbol3 = _interopRequireDefault(_Symbol2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Symbols for private data members on an element.
	var safeToSetAttributesSymbol = (0, _Symbol3.default)('safeToSetAttributes'); /**
	                                                                               * Helpers for accessing a component's attributes.
	                                                                               *
	                                                                               * @module attributes
	                                                                               */
	
	var pendingAttributesSymbol = (0, _Symbol3.default)('pendingAttributes');
	var pendingClassesSymbol = (0, _Symbol3.default)('pendingClasses');
	
	/**
	 * Set/unset the attribute with the indicated name.
	 *
	 * This method exists primarily to handle the case where an element wants to
	 * set a default property value that should be reflected as an attribute. An
	 * important limitation of custom element consturctors is that they cannot
	 * set attributes. A call to `setAttribute` during the constructor will
	 * be deferred until the element is connected to the document.
	 *
	 * @param {string} attribute - The name of the *attribute* (not property) to set.
	 * @param {object} value - The value to set. If null, the attribute will be removed.
	 */
	function setAttribute(element, attribute, value) {
	  if (element[safeToSetAttributesSymbol]) {
	    // Safe to set attributes immediately.
	    setAttributeToElement(element, attribute, value);
	  } else {
	    // Defer setting attributes until the first time we're connected.
	    if (!element[pendingAttributesSymbol]) {
	      element[pendingAttributesSymbol] = {};
	    }
	    element[pendingAttributesSymbol][attribute] = value;
	  }
	}
	
	/**
	 * Set/unset the class with the indicated name.
	 *
	 * This method exists primarily to handle the case where an element wants to
	 * set a default property value that should be reflected as as class. An
	 * important limitation of custom element consturctors is that they cannot
	 * set attributes, including the `class` attribute. A call to
	 * `toggleClass` during the constructor will be deferred until the element
	 * is connected to the document.
	 *
	 * @param {string} className - The name of the class to set.
	 * @param {boolean} [value] - True to set the class, false to remove it. If
	 * omitted, the class will be toggled.
	 */
	function toggleClass(element, className, value) {
	  if (element[safeToSetAttributesSymbol]) {
	    // Safe to set class immediately.
	    // Since IE 11's native `toggleClass` implementation is deficient, we
	    // set or unset the class by hand.
	    var classList = element.classList;
	    var addClass = typeof value === 'undefined' ? !classList.contains(className) : value;
	    if (addClass) {
	      classList.add(className);
	    } else {
	      classList.remove(className);
	    }
	    return addClass;
	  } else {
	    // Defer setting class until the first time we're connected.
	    if (!element[pendingClassesSymbol]) {
	      element[pendingClassesSymbol] = {};
	    }
	    element[pendingClassesSymbol][className] = value;
	  }
	}
	
	/**
	 * Perform any pending updates to attributes and classes.
	 *
	 * This writes any `setAttribute` or `toggleClass` values that were performed
	 * before an element was attached to the document for the first time.
	 *
	 * This method should be called by mixins/components in their
	 * `connectedCallback`. If mulitple mixins/components invoke this during the
	 * same `connectedCallback`, only the first call will have any effect. The
	 * subsequent calls will be harmless.
	 *
	 * @param {HTMLElement} element - The element being added to the document.
	 */
	function writePendingAttributes(element) {
	  element[safeToSetAttributesSymbol] = true;
	
	  // Set any pending attributes.
	  if (element[pendingAttributesSymbol]) {
	    for (var attribute in element[pendingAttributesSymbol]) {
	      var value = element[pendingAttributesSymbol][attribute];
	      setAttributeToElement(element, attribute, value);
	    }
	    element[pendingAttributesSymbol] = null;
	  }
	
	  // Set any pending classes.
	  if (element[pendingClassesSymbol]) {
	    for (var className in element[pendingClassesSymbol]) {
	      var _value = element[pendingClassesSymbol][className];
	      toggleClass(element, className, _value);
	    }
	    element[pendingClassesSymbol] = null;
	  }
	}
	
	//
	// Helpers
	//
	
	// Reflect the attribute to the given element.
	// If the value is null, remove the attribute.
	function setAttributeToElement(element, attributeName, value) {
	  if (value === null || typeof value === 'undefined') {
	    element.removeAttribute(attributeName);
	  } else {
	    var text = String(value);
	    // Avoid recursive attributeChangedCallback calls.
	    if (element.getAttribute(attributeName) !== text) {
	      element.setAttribute(attributeName, value);
	    }
	  }
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/* The number of fake symbols we've served up */
	var count = 0;
	
	function uniqueString(description) {
	  return '_' + description + count++;
	}
	
	var symbolFunction = typeof window.Symbol === 'function' ? window.Symbol : uniqueString;
	
	/**
	 * Polyfill for ES6 symbol class.
	 *
	 * Mixins and component classes often want to associate private data with an
	 * element instance, but JavaScript does not have direct support for true
	 * private properties. One approach is to use the
	 * [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
	 * data type to set and retrieve data on an element.
	 *
	 * Unfortunately, the Symbol type is not available in Internet Explorer 11. In
	 * lieu of returning a true Symbol, this polyfill returns a different string
	 * each time it is called.
	 *
	 * Usage:
	 *
	 *     const fooSymbol = Symbol('foo');
	 *
	 *     class MyElement extends HTMLElement {
	 *       get foo() {
	 *         return this[fooSymbol];
	 *       }
	 *       set foo(value) {
	 *         this[fooSymbol] = value;
	 *       }
	 *     }
	 *
	 * In IE 11, this sample will "hide" data behind an instance property that looks
	 * like this._foo0. The underscore is meant to reduce (not eliminate) potential
	 * accidental access, and the unique number at the end is mean to avoid (not
	 * eliminate) naming conflicts.
	 *
	 * @function Symbol
	 * @param {string} description - A string to identify the symbol when debugging
	 * @returns {Symbol|string} — A Symbol (in ES6 browsers) or unique string ID (in
	 * ES5).
	 */
	exports.default = symbolFunction;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = ClickSelectionMixin;
	
	var _symbols = __webpack_require__(6);
	
	var _symbols2 = _interopRequireDefault(_symbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Mixin which maps a click (actually, a mousedown) to a selection.
	 *
	 * This simple mixin is useful in list box-like elements, where a click on a
	 * list item implicitly selects it.
	 *
	 * The standard use for this mixin is in list-like elements. Native list
	 * boxes don't appear to be consistent with regard to whether they select
	 * on mousedown or click/mouseup. This mixin assumes the use of mousedown.
	 * On touch devices, that event appears to trigger when the touch is *released*.
	 *
	 * This mixin only listens to mousedown events for the primary mouse button
	 * (typically the left button). Right-clicks are ignored so that the browser
	 * may display a context menu.
	 *
	 * Much has been written about how to ensure "fast tap" behavior on mobile
	 * devices. This mixin makes a very straightforward use of a standard event, and
	 * this appears to perform well on mobile devices when, e.g., the viewport is
	 * configured with `width=device-width`.
	 *
	 * This mixin expects the component to provide an `items` property. It also
	 * expects the component to define a `selectedItem` property; you can provide
	 * that yourself, or use [SingleSelectionMixin](SingleSelectionMixin.md).
	 *
	 * If the component receives a clicks that doesn't correspond to an item (e.g.,
	 * the user clicks on the element background visible between items), the
	 * selection will be removed. However, if the component defines a
	 * `selectionRequired` and this is true, a background click will *not* remove
	 * the selection.
	 *
	 * @module ClickSelectionMixin
	 * @param base {Class} the base class to extend
	 * @returns {Class} the extended class
	 */
	function ClickSelectionMixin(base) {
	
	  /**
	   * The class prototype added by the mixin.
	   */
	  var ClickSelection = function (_base) {
	    _inherits(ClickSelection, _base);
	
	    function ClickSelection() {
	      _classCallCheck(this, ClickSelection);
	
	      var _this = _possibleConstructorReturn(this, (ClickSelection.__proto__ || Object.getPrototypeOf(ClickSelection)).call(this));
	
	      _this.addEventListener('mousedown', function (event) {
	
	        // Only process events for the main (usually left) button.
	        if (event.button !== 0) {
	          return;
	        }
	
	        _this[_symbols2.default.raiseChangeEvents] = true;
	
	        // If the item clicked on is a button, the event seems to be raised in
	        // phase 2 (AT_TARGET) — but the event target will be the component, not
	        // the item that was clicked on.
	        var target = event.target === _this ? event.composedPath()[0] : // Event target isn't the item, so get it from path.
	        event.target;
	
	        // Find which item was clicked on and, if found, select it. For elements
	        // which don't require a selection, a background click will determine
	        // the item was null, in which we case we'll remove the selection.
	        var item = itemForTarget(_this, target);
	        if (item || !_this.selectionRequired) {
	
	          if (!('selectedItem' in _this)) {
	            console.warn('ClickSelectionMixin expects a component to define a "selectedItem" property.');
	          } else {
	            _this.selectedItem = item;
	          }
	
	          // We don't call preventDefault here. The default behavior for
	          // mousedown includes setting keyboard focus if the element doesn't
	          // already have the focus, and we want to preserve that behavior.
	          event.stopPropagation();
	        }
	
	        _this[_symbols2.default.raiseChangeEvents] = false;
	      });
	      return _this;
	    }
	
	    return ClickSelection;
	  }(base);
	
	  return ClickSelection;
	}
	
	/*
	 * Return the list item that is, or contains, the indicated target element.
	 * Return null if not found.
	 */
	function itemForTarget(listElement, target) {
	  var items = listElement.items;
	  var itemCount = items ? items.length : 0;
	  for (var i = 0; i < itemCount; i++) {
	    var item = items[i];
	    if (item === target || item.contains(target)) {
	      return item;
	    }
	  }
	  return null;
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Symbol2 = __webpack_require__(4);
	
	var _Symbol3 = _interopRequireDefault(_Symbol2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * A collection of (potentially polyfilled) Symbol objects for standard
	 * component properties and methods.
	 *
	 * These Symbol objects are used to allow mixins and a component to internally
	 * communicate, without exposing these properties and methods in the component's
	 * public API.
	 *
	 * To use these Symbol objects in your own component, include this module and
	 * then create a property or method whose key is the desired Symbol.
	 *
	 *     import 'SingleSelectionMixin' from 'elix-mixins/src/SingleSelectionMixin';
	 *     import 'symbols' from 'elix-mixins/src/symbols';
	 *
	 *     class MyElement extends SingleSelectionMixin(HTMLElement) {
	 *       [symbols.itemSelected](item, selected) {
	 *         // This will be invoked whenever an item is selected/deselected.
	 *       }
	 *     }
	 *
	 * @module symbols
	 */
	var symbols = {
	
	  /**
	   * Symbols for the `content` property.
	   *
	   * This property returns the component's content -- however the component
	   * wants to define that. This could, for example, return the component's
	   * distributed children.
	   *
	   * @type {HTMLElement[]}
	   */
	  content: (0, _Symbol3.default)('content'),
	
	  /**
	   * Symbol for the `contentChanged` method.
	   *
	   * For components that define a `content` property, this method should be
	   * invoked when that property changes.
	   *
	   * @function contentChanged
	   */
	  contentChanged: (0, _Symbol3.default)('contentChanged'),
	
	  /**
	   * Symbol for the `defaults` property.
	   *
	   * This property can be used to set or override defaults that will be applied
	   * to a new component instance. When implementing this property, take care to
	   * first acquire any defaults defined by the superclass. The standard idiom is
	   * as follows:
	   *
	   *     get [symbols.defaults]() {
	   *       const defaults = super[symbols.defaults] || {};
	   *       // Set or override default values here
	   *       defaults.customProperty = false;
	   *       return defaults;
	   *     }
	   *
	   * @var {object} defaults
	   */
	  defaults: (0, _Symbol3.default)('defaults'),
	
	  /**
	   * Symbol for the `getItemText` method.
	   *
	   * This method can be applied to an item to return its text.
	   *
	   * @function getText
	   * @param {HTMLElement} item - the item to extract text from
	   * @returns {string} - the text of the item
	   */
	  getItemText: (0, _Symbol3.default)('getText'),
	
	  /**
	   * Symbol for the `goDown` method.
	   *
	   * This method is invoked when the user wants to go/navigate down.
	   *
	   * @function goDown
	   */
	  goDown: (0, _Symbol3.default)('goDown'),
	
	  /**
	   * Symbol for the `goEnd` method.
	   *
	   * This method is invoked when the user wants to go/navigate to the end (e.g.,
	   * of a list).
	   *
	   * @function goEnd
	   */
	  goEnd: (0, _Symbol3.default)('goEnd'),
	
	  /**
	   * Symbol for the `goLeft` method.
	   *
	   * This method is invoked when the user wants to go/navigate left.
	   *
	   * @function goLeft
	   */
	  goLeft: (0, _Symbol3.default)('goLeft'),
	
	  /**
	   * Symbol for the `goRight` method.
	   *
	   * This method is invoked when the user wants to go/navigate right.
	   *
	   * @function goRight
	   */
	  goRight: (0, _Symbol3.default)('goRight'),
	
	  /**
	   * Symbol for the `goStart` method.
	   *
	   * This method is invoked when the user wants to go/navigate to the start
	   * (e.g., of a list).
	   *
	   * @function goStart
	   */
	  goStart: (0, _Symbol3.default)('goStart'),
	
	  /**
	   * Symbol for the `goUp` method.
	   *
	   * This method is invoked when the user wants to go/navigate up.
	   *
	   * @function goUp
	   */
	  goUp: (0, _Symbol3.default)('goUp'),
	
	  /**
	   * Symbol for the `itemAdded` method.
	   *
	   * This method is invoked when a new item is added to a list.
	   *
	   * @function itemAdded
	   * @param {HTMLElement} item - the item being selected/deselected
	   */
	  itemAdded: (0, _Symbol3.default)('itemAdded'),
	
	  /**
	   * Symbol for the `itemsChanged` method.
	   *
	   * This method is invoked when the underlying contents change. It is also
	   * invoked on component initialization – since the items have "changed" from
	   * being nothing.
	   *
	   * @function itemsChanged
	   */
	  itemsChanged: (0, _Symbol3.default)('itemsChanged'),
	
	  /**
	   * Symbol for the `itemSelected` method.
	   *
	   * This method is invoked when an item becomes selected or deselected.
	   *
	   * @function itemSelected
	   * @param {HTMLElement} item - the item being selected/deselected
	   * @param {boolean} selected - true if the item is selected, false if not
	   */
	  itemSelected: (0, _Symbol3.default)('itemSelected'),
	
	  /**
	   * Symbol for the `keydown` method.
	   *
	   * This method is invoked when an element receives a `keydown` event.
	   *
	   * @function keydown
	   * @param {KeyboardEvent} event - the event being processed
	   */
	  keydown: (0, _Symbol3.default)('keydown'),
	
	  /**
	   * Indicates the general horizontal and/or vertical orientation of the
	   * component. This may affect both presentation and behavior (e.g., of
	   * keyboard navigation).
	   *
	   * Accepted values are "horizontal", "vertical", or "both" (the default).
	   *
	   * @type {string}
	   */
	  orientation: (0, _Symbol3.default)('orientation'),
	
	  /**
	   * Symbol for the `raiseChangeEvents` property.
	   *
	   * This property is used by mixins to determine whether they should raise
	   * property change events. The standard HTML pattern is to only raise such
	   * events in response to direct user interactions. For a detailed discussion
	   * of this point, see the Gold Standard checklist item for
	   * [Propery Change Events](https://github.com/webcomponents/gold-standard/wiki/Property%20Change%20Events).
	   *
	   * The above article describes a pattern for using a flag to track whether
	   * work is being performed in response to internal component activity, and
	   * whether the component should therefore raise property change events.
	   * This `raiseChangeEvents` symbol is a shared flag used for that purpose by
	   * all Elix mixins and components. Sharing this flag ensures that internal
	   * activity (e.g., a UI event listener) in one mixin can signal other mixins
	   * handling affected properties to raise change events.
	   *
	   * All UI event listeners (and other forms of internal handlers, such as
	   * timeouts and async network handlers) should set `raiseChangeEvents` to
	   * `true` at the start of the event handler, then `false` at the end:
	   *
	   *     this.addEventListener('click', event => {
	   *       this[symbols.raiseChangeEvents] = true;
	   *       // Do work here, possibly setting properties, like:
	   *       this.foo = 'Hello';
	   *       this[symbols.raiseChangeEvents] = false;
	   *     });
	   *
	   * Elsewhere, property setters that raise change events should only do so it
	   * this property is `true`:
	   *
	   *     set foo(value) {
	   *       // Save foo value here, do any other work.
	   *       if (this[symbols.raiseChangeEvents]) {
	   *         const event = new CustomEvent('foo-changed');
	   *         this.dispatchEvent(event);
	   *       }
	   *     }
	   *
	   * In this way, programmatic attempts to set the `foo` property will not
	   * trigger the `foo-changed` event, but UI interactions that update that
	   * property will cause those events to be raised.
	   *
	   * @var {boolean} raiseChangeEvents
	   */
	  raiseChangeEvents: (0, _Symbol3.default)('raiseChangeEvents'),
	
	  /**
	   * Symbol for the `shadowCreated` method.
	   *
	   * This method is invoked when the component's shadow root has been attached
	   * and populated. Other code can handle this method to perform initialization
	   * that depends upon the existence of a populated shadow subtree.
	   *
	   * @function shadowCreated
	   */
	  shadowCreated: (0, _Symbol3.default)('shadowCreated'),
	
	  /**
	   * Symbol for the `template` property.
	   *
	   * This property returns a component's template.
	   *
	   * @type {string|HTMLTemplateElement}
	   */
	  template: (0, _Symbol3.default)('template')
	};
	
	exports.default = symbols;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	exports.default = ContentItemsMixin;
	
	var _content = __webpack_require__(8);
	
	var content = _interopRequireWildcard(_content);
	
	var _Symbol2 = __webpack_require__(4);
	
	var _Symbol3 = _interopRequireDefault(_Symbol2);
	
	var _symbols = __webpack_require__(6);
	
	var _symbols2 = _interopRequireDefault(_symbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// Symbols for private data members on an element.
	var itemsSymbol = (0, _Symbol3.default)('items');
	var itemInitializedSymbol = (0, _Symbol3.default)('itemInitialized');
	
	/**
	 * Mixin which maps content semantics (elements) to list item semantics.
	 *
	 * Items differ from element contents in several ways:
	 *
	 * * They are often referenced via index.
	 * * They may have a selection state.
	 * * It's common to do work to initialize the appearance or state of a new
	 *   item.
	 * * Auxiliary invisible child elements are filtered out and not counted as
	 *   items. Auxiliary elements include link, script, style, and template
	 *   elements. This filtering ensures that those auxiliary elements can be
	 *   used in markup inside of a list without being treated as list items.
	 *
	 * This mixin expects a component to provide a `content` property returning a
	 * raw set of elements. You can provide that yourself, or use
	 * [ChildrenContentMixin](ChildrenContentMixin.md).
	 *
	 * The most commonly referenced property defined by this mixin is the `items`
	 * property. To avoid having to do work each time that property is requested,
	 * this mixin supports an optimized mode. If you invoke the `contentChanged`
	 * method when the set of items changes, the mixin concludes that you'll take
	 * care of notifying it of future changes, and turns on the optimization. With
	 * that on, the mixin saves a reference to the computed set of items, and will
	 * return that immediately on subsequent calls to the `items` property. If you
	 * use this mixin in conjunction with `ChildrenContentMixin`, the
	 * `contentChanged` method will be invoked for you when the element's children
	 * change, turning on the optimization automatically.
	 *
	 * @module ContentItemsMixin
	 * @param base {Class} the base class to extend
	 * @returns {Class} the extended class
	 */
	function ContentItemsMixin(base) {
	
	  /**
	   * The class prototype added by the mixin.
	   */
	  var ContentItems = function (_base) {
	    _inherits(ContentItems, _base);
	
	    function ContentItems() {
	      _classCallCheck(this, ContentItems);
	
	      return _possibleConstructorReturn(this, (ContentItems.__proto__ || Object.getPrototypeOf(ContentItems)).apply(this, arguments));
	    }
	
	    _createClass(ContentItems, [{
	      key: _symbols2.default.contentChanged,
	      value: function value() {
	        if (_get(ContentItems.prototype.__proto__ || Object.getPrototypeOf(ContentItems.prototype), _symbols2.default.contentChanged, this)) {
	          _get(ContentItems.prototype.__proto__ || Object.getPrototypeOf(ContentItems.prototype), _symbols2.default.contentChanged, this).call(this);
	        }
	
	        // Since we got the contentChanged call, we'll assume we'll be notified if
	        // the set of items changes later. We turn on memoization of the items
	        // property by setting our internal property to null (instead of
	        // undefined).
	        this[itemsSymbol] = null;
	
	        this[_symbols2.default.itemsChanged]();
	      }
	
	      /**
	       * The current set of items in the list. See the top-level documentation for
	       * mixin for a description of how items differ from plain content.
	       *
	       * @type {HTMLElement[]}
	       */
	
	    }, {
	      key: _symbols2.default.itemsChanged,
	
	
	      /**
	       * This method is invoked when the underlying contents change. It is also
	       * invoked on component initialization – since the items have "changed" from
	       * being nothing.
	       */
	      value: function value() {
	        var _this2 = this;
	
	        if (_get(ContentItems.prototype.__proto__ || Object.getPrototypeOf(ContentItems.prototype), _symbols2.default.itemsChanged, this)) {
	          _get(ContentItems.prototype.__proto__ || Object.getPrototypeOf(ContentItems.prototype), _symbols2.default.itemsChanged, this).call(this);
	        }
	
	        // Perform per-item initialization if `itemAdded` is defined.
	        if (this[_symbols2.default.itemAdded]) {
	          Array.prototype.forEach.call(this.items, function (item) {
	            if (!item[itemInitializedSymbol]) {
	              _this2[_symbols2.default.itemAdded](item);
	              item[itemInitializedSymbol] = true;
	            }
	          });
	        }
	
	        if (this[_symbols2.default.raiseChangeEvents]) {
	          this.dispatchEvent(new CustomEvent('items-changed'));
	        }
	      }
	
	      /**
	       * Fires when the items in the list change.
	       *
	       * @memberof ContentItems
	       * @event items-changed
	       */
	
	    }, {
	      key: 'items',
	      get: function get() {
	        var items = void 0;
	        if (this[itemsSymbol] == null) {
	          items = content.filterAuxiliaryElements(this[_symbols2.default.content]);
	          // Note: test for *equality* with null, since we use `undefined` to
	          // indicate that we're not yet caching items.
	          if (this[itemsSymbol] === null) {
	            // Memoize the set of items.
	            this[itemsSymbol] = items;
	          }
	        } else {
	          // Return the memoized items.
	          items = this[itemsSymbol];
	        }
	        return items;
	      }
	    }]);
	
	    return ContentItems;
	  }(base);
	
	  return ContentItems;
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.assignedChildren = assignedChildren;
	exports.assignedChildNodes = assignedChildNodes;
	exports.assignedTextContent = assignedTextContent;
	exports.filterAuxiliaryElements = filterAuxiliaryElements;
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	/**
	 * Helpers for accessing a component's content.
	 *
	 * The standard DOM API provides several ways of accessing child content:
	 * `children`, `childNodes`, and `textContent`. None of these functions are
	 * Shadow DOM aware. This mixin defines variations of those functions that
	 * *are* Shadow DOM aware.
	 *
	 * Example: you create a component `<count-children>` that displays a number
	 * equal to the number of children placed inside that component. If someone
	 * instantiates your component like:
	 *
	 *     <count-children>
	 *       <div></div>
	 *       <div></div>
	 *       <div></div>
	 *     </count-children>
	 *
	 * Then the component should show "3", because there are three children. To
	 * calculate the number of children, the component can just calculate
	 * `this.children.length`. However, suppose someone instantiates your
	 * component inside one of their own components, and puts a `<slot>` element
	 * inside your component:
	 *
	 *     <count-children>
	 *       <slot></slot>
	 *     </count-children>
	 *
	 * If your component only looks at `this.children`, it will always see exactly
	 * one child — the `<slot>` element. But the user looking at the page will
	 * *see* any nodes distributed to that slot. To match what the user sees, your
	 * component should expand any `<slot>` elements it contains.
	 *
	 * That is one problem these helpers solve. For example, the helper
	 * `assignedChildren` will return all children assigned to your component in
	 * the composed tree.
	 *
	 * @module content
	 */
	
	/**
	 * An in-order collection of distributed children, expanding any slot
	 * elements. Like the standard `children` property, this skips text and other
	 * node types which are not Element instances.
	 *
	 * @param {HTMLElement} element - the element to inspect
	 * @returns {Element[]} - the children assigned to the element
	 */
	function assignedChildren(element) {
	  return expandAssignedNodes(element.children, true);
	}
	
	/**
	 * An in-order collection of distributed child nodes, expanding any slot
	 * elements. Like the standard `childNodes` property, this includes text and
	 * other types of nodes.
	 *
	 * @param {HTMLElement} element - the element to inspect
	 * @returns {Node[]} - the nodes assigned to the element
	 */
	function assignedChildNodes(element) {
	  return expandAssignedNodes(element.childNodes, false);
	}
	
	/**
	 * The concatenated `textContent` of all distributed child nodes, expanding
	 * any slot elements.
	 *
	 * @param {HTMLElement} element - the element to inspect
	 * @type {string} - the text content of all nodes assigned to the element
	 */
	function assignedTextContent(element) {
	  var strings = assignedChildNodes(element).map(function (child) {
	    return child.textContent;
	  });
	  return strings.join('');
	}
	
	/**
	 * Return the given elements, filtering out auxiliary elements that aren't
	 * typically visible. Given a `NodeList` or array of objects, it will only
	 * return array members that are instances of `Element` (`HTMLElement` or
	 * `SVGElement`), and not on a blacklist of normally invisible elements
	 * (such as `style` or `script`).
	 *
	 * @param {NodeList|Element[]} elements - the list of elements to filter
	 * @returns {Element[]} - the filtered elements
	 */
	function filterAuxiliaryElements(elements) {
	
	  // These are tags that can appear in the document body, but do not seem to
	  // have any user-visible manifestation.
	  // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element
	  var auxiliaryTags = ['applet', // deprecated
	  'basefont', // deprecated
	  'embed', 'font', // deprecated
	  'frame', // deprecated
	  'frameset', // deprecated
	  'isindex', // deprecated
	  'keygen', // deprecated
	  'link', 'multicol', // deprecated
	  'nextid', // deprecated
	  'noscript', 'object', 'param', 'script', 'style', 'template', 'noembed' // deprecated
	  ];
	
	  return [].filter.call(elements, function (element) {
	    return element instanceof Element && (!element.localName || auxiliaryTags.indexOf(element.localName) < 0);
	  });
	}
	
	//
	// Helpers for the helper functions
	//
	
	/*
	 * Given a array of nodes, return a new array with any `slot` elements expanded
	 * to the nodes assigned to those slots.
	 *
	 * If ElementsOnly is true, only Element instances are returned, as with the
	 * standard `children` property. Otherwise, all nodes are returned, as in the
	 * standard `childNodes` property.
	 */
	function expandAssignedNodes(nodes, ElementsOnly) {
	  var _ref;
	
	  var expanded = Array.prototype.map.call(nodes, function (node) {
	
	    // We want to see if the node is an instanceof HTMLSlotELement, but
	    // that class won't exist if the browser that doesn't support native
	    // Shadow DOM and if the Shadow DOM polyfill hasn't been loaded. Instead,
	    // we do a simplistic check to see if the tag name is "slot".
	    var isSlot = typeof HTMLSlotElement !== 'undefined' ? node instanceof HTMLSlotElement : node.localName === 'slot';
	
	    return isSlot ? node.assignedNodes({ flatten: true }) : [node];
	  });
	  var flattened = (_ref = []).concat.apply(_ref, _toConsumableArray(expanded));
	  var result = ElementsOnly ? flattened.filter(function (node) {
	    return node instanceof Element;
	  }) : flattened;
	  return result;
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	exports.default = DirectionSelectionMixin;
	
	var _symbols = __webpack_require__(6);
	
	var _symbols2 = _interopRequireDefault(_symbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Mixin which maps direction semantics (goLeft, goRight, etc.) to selection
	 * semantics (selectPrevious, selectNext, etc.).
	 *
	 * This mixin can be used in conjunction with
	 * [KeyboardDirectionMixin](KeyboardDirectionMixin.md) (which maps keyboard
	 * events to directions) and a mixin that handles selection like
	 * [SingleSelectionMixin](SingleSelectionMixin.md).
	 *
	 * @module DirectionSelectionMixin
	 * @param base {Class} the base class to extend
	 * @returns {Class} the extended class
	 */
	function DirectionSelectionMixin(base) {
	
	  /**
	   * The class prototype added by the mixin.
	   */
	  var DirectionSelection = function (_base) {
	    _inherits(DirectionSelection, _base);
	
	    function DirectionSelection() {
	      _classCallCheck(this, DirectionSelection);
	
	      return _possibleConstructorReturn(this, (DirectionSelection.__proto__ || Object.getPrototypeOf(DirectionSelection)).apply(this, arguments));
	    }
	
	    _createClass(DirectionSelection, [{
	      key: _symbols2.default.goDown,
	      value: function value() {
	        if (_get(DirectionSelection.prototype.__proto__ || Object.getPrototypeOf(DirectionSelection.prototype), _symbols2.default.goDown, this)) {
	          _get(DirectionSelection.prototype.__proto__ || Object.getPrototypeOf(DirectionSelection.prototype), _symbols2.default.goDown, this).call(this);
	        }
	        if (!this.selectNext) {
	          console.warn('DirectionSelectionMixin expects a component to define a "selectNext" method.');
	        } else {
	          return this.selectNext();
	        }
	      }
	    }, {
	      key: _symbols2.default.goEnd,
	      value: function value() {
	        if (_get(DirectionSelection.prototype.__proto__ || Object.getPrototypeOf(DirectionSelection.prototype), _symbols2.default.goEnd, this)) {
	          _get(DirectionSelection.prototype.__proto__ || Object.getPrototypeOf(DirectionSelection.prototype), _symbols2.default.goEnd, this).call(this);
	        }
	        if (!this.selectLast) {
	          console.warn('DirectionSelectionMixin expects a component to define a "selectLast" method.');
	        } else {
	          return this.selectLast();
	        }
	      }
	    }, {
	      key: _symbols2.default.goLeft,
	      value: function value() {
	        if (_get(DirectionSelection.prototype.__proto__ || Object.getPrototypeOf(DirectionSelection.prototype), _symbols2.default.goLeft, this)) {
	          _get(DirectionSelection.prototype.__proto__ || Object.getPrototypeOf(DirectionSelection.prototype), _symbols2.default.goLeft, this).call(this);
	        }
	        if (!this.selectPrevious) {
	          console.warn('DirectionSelectionMixin expects a component to define a "selectPrevious" method.');
	        } else {
	          return this.selectPrevious();
	        }
	      }
	    }, {
	      key: _symbols2.default.goRight,
	      value: function value() {
	        if (_get(DirectionSelection.prototype.__proto__ || Object.getPrototypeOf(DirectionSelection.prototype), _symbols2.default.goRight, this)) {
	          _get(DirectionSelection.prototype.__proto__ || Object.getPrototypeOf(DirectionSelection.prototype), _symbols2.default.goRight, this).call(this);
	        }
	        if (!this.selectNext) {
	          console.warn('DirectionSelectionMixin expects a component to define a "selectNext" method.');
	        } else {
	          return this.selectNext();
	        }
	      }
	    }, {
	      key: _symbols2.default.goStart,
	      value: function value() {
	        if (_get(DirectionSelection.prototype.__proto__ || Object.getPrototypeOf(DirectionSelection.prototype), _symbols2.default.goStart, this)) {
	          _get(DirectionSelection.prototype.__proto__ || Object.getPrototypeOf(DirectionSelection.prototype), _symbols2.default.goStart, this).call(this);
	        }
	        if (!this.selectFirst) {
	          console.warn('DirectionSelectionMixin expects a component to define a "selectFirst" method.');
	        } else {
	          return this.selectFirst();
	        }
	      }
	    }, {
	      key: _symbols2.default.goUp,
	      value: function value() {
	        if (_get(DirectionSelection.prototype.__proto__ || Object.getPrototypeOf(DirectionSelection.prototype), _symbols2.default.goUp, this)) {
	          _get(DirectionSelection.prototype.__proto__ || Object.getPrototypeOf(DirectionSelection.prototype), _symbols2.default.goUp, this).call(this);
	        }
	        if (!this.selectPrevious) {
	          console.warn('DirectionSelectionMixin expects a component to define a "selectPrevious" method.');
	        } else {
	          return this.selectPrevious();
	        }
	      }
	    }]);
	
	    return DirectionSelection;
	  }(base);
	
	  return DirectionSelection;
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	exports.default = KeyboardDirectionMixin;
	
	var _symbols = __webpack_require__(6);
	
	var _symbols2 = _interopRequireDefault(_symbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Mixin which maps direction keys (Left, Right, etc.) to direction semantics
	 * (go left, go right, etc.).
	 *
	 * This mixin expects the component to invoke a `keydown` method when a key is
	 * pressed. You can use [KeyboardMixin](KeyboardMixin.md) for that
	 * purpose, or wire up your own keyboard handling and call `keydown` yourself.
	 *
	 * This mixin calls methods such as `goLeft` and `goRight`. You can define
	 * what that means by implementing those methods yourself. If you want to use
	 * direction keys to navigate a selection, use this mixin with
	 * [DirectionSelectionMixin](DirectionSelectionMixin.md).
	 *
	 * If the component defines a property called `symbols.orientation`, the value
	 * of that property will constrain navigation to the horizontal or vertical axis.
	 *
	 * @module KeyboardDirectionMixin
	 * @param base {Class} the base class to extend
	 * @returns {Class} the extended class
	 */
	function KeyboardDirectionMixin(base) {
	
	  /**
	   * The class prototype added by the mixin.
	   */
	  var KeyboardDirection = function (_base) {
	    _inherits(KeyboardDirection, _base);
	
	    function KeyboardDirection() {
	      _classCallCheck(this, KeyboardDirection);
	
	      return _possibleConstructorReturn(this, (KeyboardDirection.__proto__ || Object.getPrototypeOf(KeyboardDirection)).apply(this, arguments));
	    }
	
	    _createClass(KeyboardDirection, [{
	      key: _symbols2.default.goDown,
	
	
	      /**
	       * Invoked when the user wants to go/navigate down.
	       * The default implementation of this method does nothing.
	       */
	      value: function value() {
	        if (_get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goDown, this)) {
	          return _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goDown, this).call(this);
	        }
	      }
	
	      /**
	       * Invoked when the user wants to go/navigate to the end (e.g., of a list).
	       * The default implementation of this method does nothing.
	       */
	
	    }, {
	      key: _symbols2.default.goEnd,
	      value: function value() {
	        if (_get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goEnd, this)) {
	          return _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goEnd, this).call(this);
	        }
	      }
	
	      /**
	       * Invoked when the user wants to go/navigate left.
	       * The default implementation of this method does nothing.
	       */
	
	    }, {
	      key: _symbols2.default.goLeft,
	      value: function value() {
	        if (_get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goLeft, this)) {
	          return _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goLeft, this).call(this);
	        }
	      }
	
	      /**
	       * Invoked when the user wants to go/navigate right.
	       * The default implementation of this method does nothing.
	       */
	
	    }, {
	      key: _symbols2.default.goRight,
	      value: function value() {
	        if (_get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goRight, this)) {
	          return _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goRight, this).call(this);
	        }
	      }
	
	      /**
	       * Invoked when the user wants to go/navigate to the start (e.g., of a
	       * list). The default implementation of this method does nothing.
	       */
	
	    }, {
	      key: _symbols2.default.goStart,
	      value: function value() {
	        if (_get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goStart, this)) {
	          return _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goStart, this).call(this);
	        }
	      }
	
	      /**
	       * Invoked when the user wants to go/navigate up.
	       * The default implementation of this method does nothing.
	       */
	
	    }, {
	      key: _symbols2.default.goUp,
	      value: function value() {
	        if (_get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goUp, this)) {
	          return _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.goUp, this).call(this);
	        }
	      }
	    }, {
	      key: _symbols2.default.keydown,
	      value: function value(event) {
	        var handled = false;
	
	        var orientation = this[_symbols2.default.orientation] || 'both';
	        var horizontal = orientation === 'horizontal' || orientation === 'both';
	        var vertical = orientation === 'vertical' || orientation === 'both';
	
	        // Ignore Left/Right keys when metaKey or altKey modifier is also pressed,
	        // as the user may be trying to navigate back or forward in the browser.
	        switch (event.keyCode) {
	          case 35:
	            // End
	            handled = this[_symbols2.default.goEnd]();
	            break;
	          case 36:
	            // Home
	            handled = this[_symbols2.default.goStart]();
	            break;
	          case 37:
	            // Left
	            if (horizontal && !event.metaKey && !event.altKey) {
	              handled = this[_symbols2.default.goLeft]();
	            }
	            break;
	          case 38:
	            // Up
	            if (vertical) {
	              handled = event.altKey ? this[_symbols2.default.goStart]() : this[_symbols2.default.goUp]();
	            }
	            break;
	          case 39:
	            // Right
	            if (horizontal && !event.metaKey && !event.altKey) {
	              handled = this[_symbols2.default.goRight]();
	            }
	            break;
	          case 40:
	            // Down
	            if (vertical) {
	              handled = event.altKey ? this[_symbols2.default.goEnd]() : this[_symbols2.default.goDown]();
	            }
	            break;
	        }
	        // Prefer mixin result if it's defined, otherwise use base result.
	        return handled || _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.keydown, this) && _get(KeyboardDirection.prototype.__proto__ || Object.getPrototypeOf(KeyboardDirection.prototype), _symbols2.default.keydown, this).call(this, event) || false;
	      }
	    }]);
	
	    return KeyboardDirection;
	  }(base);
	
	  return KeyboardDirection;
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	exports.default = KeyboardMixin;
	
	var _symbols = __webpack_require__(6);
	
	var _symbols2 = _interopRequireDefault(_symbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Mixin which manages the keydown handling for a component.
	 *
	 * This mixin handles several keyboard-related features.
	 *
	 * First, it wires up a single keydown event handler that can be shared by
	 * multiple mixins on a component. The event handler will invoke a `keydown`
	 * method with the event object, and any mixin along the prototype chain that
	 * wants to handle that method can do so.
	 *
	 * If a mixin wants to indicate that keyboard event has been handled, and that
	 * other mixins should *not* handle it, the mixin's `keydown` handler should
	 * return a value of true. The convention that seems to work well is that a
	 * mixin should see if it wants to handle the event and, if not, then ask the
	 * superclass to see if it wants to handle the event. This has the effect of
	 * giving the mixin that was applied last the first chance at handling a
	 * keyboard event.
	 *
	 * Example:
	 *
	 *     [symbols.keydown](event) {
	 *       let handled;
	 *       switch (event.keyCode) {
	 *         // Handle the keys you want, setting handled = true if appropriate.
	 *       }
	 *       // Prefer mixin result if it's defined, otherwise use base result.
	 *       return handled || (super[symbols.keydown] && super[symbols.keydown](event));
	 *     }
	 *
	 * Until iOS Safari supports the `KeyboardEvent.key` property
	 * (see http://caniuse.com/#search=keyboardevent.key), mixins should generally
	 * test keys using the legacy `keyCode` property, not `key`.
	 *
	 * A second feature provided by this mixin is that it implicitly makes the
	 * component a tab stop if it isn't already, by setting `tabIndex` to 0. This
	 * has the effect of adding the component to the tab order in document order.
	 *
	 * @module KeyboardMixin
	 * @param base {Class} the base class to extend
	 * @returns {Class} the extended class
	 */
	function KeyboardMixin(base) {
	
	  /**
	   * The class prototype added by the mixin.
	   */
	  var Keyboard = function (_base) {
	    _inherits(Keyboard, _base);
	
	    function Keyboard() {
	      _classCallCheck(this, Keyboard);
	
	      var _this = _possibleConstructorReturn(this, (Keyboard.__proto__ || Object.getPrototypeOf(Keyboard)).call(this));
	
	      _this.addEventListener('keydown', function (event) {
	        _this[_symbols2.default.raiseChangeEvents] = true;
	        var handled = _this[_symbols2.default.keydown](event);
	        if (handled) {
	          event.preventDefault();
	          event.stopPropagation();
	        }
	        _this[_symbols2.default.raiseChangeEvents] = false;
	      });
	      return _this;
	    }
	
	    _createClass(Keyboard, [{
	      key: 'connectedCallback',
	      value: function connectedCallback() {
	        if (_get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), 'connectedCallback', this)) {
	          _get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), 'connectedCallback', this).call(this);
	        }
	        if (this.getAttribute('tabindex') == null && this[_symbols2.default.defaults].tabindex !== null) {
	          this.setAttribute('tabindex', this[_symbols2.default.defaults].tabindex);
	        }
	      }
	    }, {
	      key: _symbols2.default.keydown,
	
	
	      /**
	       * Handle the indicated keyboard event.
	       *
	       * The default implementation of this method does nothing. This will
	       * typically be handled by other mixins.
	       *
	       * @param {KeyboardEvent} event - the keyboard event
	       * @return {boolean} true if the event was handled
	       */
	      value: function value(event) {
	        if (_get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), _symbols2.default.keydown, this)) {
	          return _get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), _symbols2.default.keydown, this).call(this, event);
	        }
	      }
	    }, {
	      key: _symbols2.default.defaults,
	      get: function get() {
	        var defaults = _get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), _symbols2.default.defaults, this) || {};
	        // The default tab index is 0 (document order).
	        defaults.tabindex = 0;
	        return defaults;
	      }
	    }]);
	
	    return Keyboard;
	  }(base);
	
	  return Keyboard;
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	exports.default = KeyboardPagedSelectionMixin;
	
	var _defaultScrollTarget = __webpack_require__(13);
	
	var _defaultScrollTarget2 = _interopRequireDefault(_defaultScrollTarget);
	
	var _symbols = __webpack_require__(6);
	
	var _symbols2 = _interopRequireDefault(_symbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Mixin which maps page keys (Page Up, Page Down) into operations that move
	 * the selection by one page.
	 *
	 * The keyboard interaction model generally follows that of Microsoft Windows'
	 * list boxes instead of those in OS X:
	 *
	 * * The Page Up/Down and Home/End keys actually change the selection, rather
	 *   than just scrolling. The former behavior seems more generally useful for
	 *   keyboard users.
	 *
	 * * Pressing Page Up/Down will change the selection to the topmost/bottommost
	 *   visible item if the selection is not already there. Thereafter, the key
	 *   will move the selection up/down by a page, and (per the above point) make
	 *   the selected item visible.
	 *
	 * To ensure the selected item is in view following use of Page Up/Down, use
	 * the related [SelectionInViewMixin](SelectionInViewMixin.md).
	 *
	 * This mixin expects the component to provide:
	 *
	 * * A `[symbols.keydown]` method invoked when a key is pressed. You can use
	 *   [KeyboardMixin](KeyboardMixin.md) for that purpose, or wire up your own
	 *   keyboard handling and call `[symbols.keydown]` yourself.
	 * * A `selectedIndex` property that indicates the index of the selected item.
	 *
	 * @module KeyboardPagedSelectionMixin
	 * @param base {Class} the base class to extend
	 * @returns {Class} the extended class
	 */
	function KeyboardPagedSelectionMixin(base) {
	
	  /**
	   * The class prototype added by the mixin.
	   */
	  var KeyboardPagedSelection = function (_base) {
	    _inherits(KeyboardPagedSelection, _base);
	
	    function KeyboardPagedSelection() {
	      _classCallCheck(this, KeyboardPagedSelection);
	
	      return _possibleConstructorReturn(this, (KeyboardPagedSelection.__proto__ || Object.getPrototypeOf(KeyboardPagedSelection)).apply(this, arguments));
	    }
	
	    _createClass(KeyboardPagedSelection, [{
	      key: _symbols2.default.keydown,
	      value: function value(event) {
	        var handled = false;
	        var orientation = this[_symbols2.default.orientation];
	        if (orientation !== 'horizontal') {
	          switch (event.keyCode) {
	            case 33:
	              // Page Up
	              handled = this.pageUp();
	              break;
	            case 34:
	              // Page Down
	              handled = this.pageDown();
	              break;
	          }
	        }
	        // Prefer mixin result if it's defined, otherwise use base result.
	        return handled || _get(KeyboardPagedSelection.prototype.__proto__ || Object.getPrototypeOf(KeyboardPagedSelection.prototype), _symbols2.default.keydown, this) && _get(KeyboardPagedSelection.prototype.__proto__ || Object.getPrototypeOf(KeyboardPagedSelection.prototype), _symbols2.default.keydown, this).call(this, event);
	      }
	
	      /**
	       * Scroll down one page.
	       */
	
	    }, {
	      key: 'pageDown',
	      value: function pageDown() {
	        if (_get(KeyboardPagedSelection.prototype.__proto__ || Object.getPrototypeOf(KeyboardPagedSelection.prototype), 'pageDown', this)) {
	          _get(KeyboardPagedSelection.prototype.__proto__ || Object.getPrototypeOf(KeyboardPagedSelection.prototype), 'pageDown', this).call(this);
	        }
	        return scrollOnePage(this, true);
	      }
	
	      /**
	       * Scroll up one page.
	       */
	
	    }, {
	      key: 'pageUp',
	      value: function pageUp() {
	        if (_get(KeyboardPagedSelection.prototype.__proto__ || Object.getPrototypeOf(KeyboardPagedSelection.prototype), 'pageUp', this)) {
	          _get(KeyboardPagedSelection.prototype.__proto__ || Object.getPrototypeOf(KeyboardPagedSelection.prototype), 'pageUp', this).call(this);
	        }
	        return scrollOnePage(this, false);
	      }
	
	      /* Provide a default scrollTarget implementation if none exists. */
	
	    }, {
	      key: _symbols2.default.scrollTarget,
	      get: function get() {
	        return _get(KeyboardPagedSelection.prototype.__proto__ || Object.getPrototypeOf(KeyboardPagedSelection.prototype), _symbols2.default.scrollTarget, this) || (0, _defaultScrollTarget2.default)(this);
	      }
	    }]);
	
	    return KeyboardPagedSelection;
	  }(base);
	
	  return KeyboardPagedSelection;
	}
	
	// Return the item whose content spans the given y position (relative to the
	// top of the list's scrolling client area), or null if not found.
	//
	// If downward is true, move down the list of items to find the first item
	// found at the given y position; if downward is false, move up the list of
	// items to find the last item at that position.
	function getIndexOfItemAtY(element, scrollTarget, y, downward) {
	
	  var items = element.items;
	  var start = downward ? 0 : items.length - 1;
	  var end = downward ? items.length : 0;
	  var step = downward ? 1 : -1;
	
	  var topOfClientArea = scrollTarget.offsetTop + scrollTarget.clientTop;
	
	  // Find the item spanning the indicated y coordinate.
	  var item = void 0;
	  var itemIndex = start;
	  var itemTop = void 0;
	  var found = false;
	  while (itemIndex !== end) {
	    item = items[itemIndex];
	    itemTop = item.offsetTop - topOfClientArea;
	    var itemBottom = itemTop + item.offsetHeight;
	    if (itemTop <= y && itemBottom >= y) {
	      // Item spans the indicated y coordinate.
	      found = true;
	      break;
	    }
	    itemIndex += step;
	  }
	
	  if (!found) {
	    return null;
	  }
	
	  // We may have found an item whose padding spans the given y coordinate,
	  // but whose content is actually above/below that point.
	  // TODO: If the item has a border, then padding should be included in
	  // considering a hit.
	  var itemStyle = getComputedStyle(item);
	  var itemPaddingTop = parseFloat(itemStyle.paddingTop);
	  var itemPaddingBottom = parseFloat(itemStyle.paddingBottom);
	  var contentTop = itemTop + item.clientTop + itemPaddingTop;
	  var contentBottom = contentTop + item.clientHeight - itemPaddingTop - itemPaddingBottom;
	  if (downward && contentTop <= y || !downward && contentBottom >= y) {
	    // The indicated coordinate hits the actual item content.
	    return itemIndex;
	  } else {
	    // The indicated coordinate falls within the item's padding. Back up to
	    // the item below/above the item we found and return that.
	    return itemIndex - step;
	  }
	}
	
	// Move by one page downward (if downward is true), or upward (if false).
	// Return true if we ended up changing the selection, false if not.
	function scrollOnePage(element, downward) {
	
	  // Determine the item visible just at the edge of direction we're heading.
	  // We'll select that item if it's not already selected.
	  var scrollTarget = element[_symbols2.default.scrollTarget];
	  var edge = scrollTarget.scrollTop + (downward ? scrollTarget.clientHeight : 0);
	  var indexOfItemAtEdge = getIndexOfItemAtY(element, scrollTarget, edge, downward);
	
	  var selectedIndex = element.selectedIndex;
	  var newIndex = void 0;
	  if (indexOfItemAtEdge && selectedIndex === indexOfItemAtEdge) {
	    // The item at the edge was already selected, so scroll in the indicated
	    // direction by one page. Leave the new item at that edge selected.
	    var delta = (downward ? 1 : -1) * scrollTarget.clientHeight;
	    newIndex = getIndexOfItemAtY(element, scrollTarget, edge + delta, downward);
	  } else {
	    // The item at the edge wasn't selected yet. Instead of scrolling, we'll
	    // just select that item. That is, the first attempt to page up/down
	    // usually just moves the selection to the edge in that direction.
	    newIndex = indexOfItemAtEdge;
	  }
	
	  if (!newIndex) {
	    // We can't find an item in the direction we want to travel. Select the
	    // last item (if moving downward) or first item (if moving upward).
	    newIndex = downward ? element.items.length - 1 : 0;
	  }
	
	  if (newIndex !== selectedIndex) {
	    element.selectedIndex = newIndex;
	    return true; // We handled the page up/down ourselves.
	  } else {
	    return false; // We didn't do anything.
	  }
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = defaultScrollTarget;
	/**
	 * Return a guess as to what portion of the given element can be scrolled.
	 * This can be used to provide a default implementation of
	 * [symbols.scrollTarget].
	 *
	 * If the element has a shadow root containing a default (unnamed) slot, this
	 * returns the first ancestor of that slot that has either `overflow-x` or
	 * `overflow-y` styled as `auto` or `scroll`. If the element has no default
	 * slot, or no scrolling ancestor is found, the element itself is returned.
	 *
	 * @type {HTMLElement}
	 */
	function defaultScrollTarget(element) {
	  var root = element.shadowRoot;
	  var slot = root && root.querySelector('slot:not([name])');
	  var scrollingParent = slot && getScrollingParent(slot.parentNode);
	  return scrollingParent || element;
	}
	
	// Return the parent of the given element that can be scrolled. If no such
	// element is found, return null.
	function getScrollingParent(element) {
	  // We test against DocumentFragment below instead of ShadowRoot, because the
	  // polyfill doesn't define the latter, and instead uses the former. In native
	  // Shadow DOM, a ShadowRoot is a subclass of DocumentFragment, so the same
	  // test works then too.
	  if (element === null || element instanceof DocumentFragment) {
	    // Didn't find a scrolling parent.
	    return null;
	  }
	  var style = getComputedStyle(element);
	  var overflowX = style.overflowX;
	  var overflowY = style.overflowY;
	  if (overflowX === 'scroll' || overflowX === 'auto' || overflowY === 'scroll' || overflowY === 'auto') {
	    // Found an element we can scroll.
	    return element;
	  }
	  // Keep looking higher in the hierarchy for a scrolling parent.
	  return getScrollingParent(element.parentNode);
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	exports.default = KeyboardPrefixSelectionMixin;
	
	var _constants = __webpack_require__(15);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	var _Symbol2 = __webpack_require__(4);
	
	var _Symbol3 = _interopRequireDefault(_Symbol2);
	
	var _symbols = __webpack_require__(6);
	
	var _symbols2 = _interopRequireDefault(_symbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// Symbols for private data members on an element.
	var itemTextContentsSymbol = (0, _Symbol3.default)('itemTextContents');
	var typedPrefixSymbol = (0, _Symbol3.default)('typedPrefix');
	var prefixTimeoutSymbol = (0, _Symbol3.default)('prefixTimeout');
	var settingSelectionSymbol = (0, _Symbol3.default)('settingSelection');
	
	/**
	 * Mixin that handles list box-style prefix typing, in which the user can type
	 * a string to select the first item that begins with that string.
	 *
	 * Example: suppose a component using this mixin has the following items:
	 *
	 *     <sample-list-component>
	 *       <div>Apple</div>
	 *       <div>Apricot</div>
	 *       <div>Banana</div>
	 *       <div>Blackberry</div>
	 *       <div>Blueberry</div>
	 *       <div>Cantaloupe</div>
	 *       <div>Cherry</div>
	 *       <div>Lemon</div>
	 *       <div>Lime</div>
	 *     </sample-list-component>
	 *
	 * If this component receives the focus, and the user presses the "b" or "B"
	 * key, the "Banana" item will be selected, because it's the first item that
	 * matches the prefix "b". (Matching is case-insensitive.) If the user now
	 * presses the "l" or "L" key quickly, the prefix to match becomes "bl", so
	 * "Blackberry" will be selected.
	 *
	 * The prefix typing feature has a one second timeout — the prefix to match
	 * will be reset after a second has passed since the user last typed a key.
	 * If, in the above example, the user waits a second between typing "b" and
	 * "l", the prefix will become "l", so "Lemon" would be selected.
	 *
	 * This mixin expects the component to invoke a `keydown` method when a key is
	 * pressed. You can use [KeyboardMixin](KeyboardMixin.md) for that
	 * purpose, or wire up your own keyboard handling and call `keydown` yourself.
	 *
	 * This mixin also expects the component to provide an `items` property. The
	 * `textContent` of those items will be used for purposes of prefix matching.
	 *
	 * @module KeyboardPrefixSelectionMixin
	 * @param base {Class} the base class to extend
	 * @returns {Class} the extended class
	 */
	function KeyboardPrefixSelectionMixin(base) {
	
	  /**
	   * The class prototype added by the mixin.
	   */
	  var KeyboardPrefixSelection = function (_base) {
	    _inherits(KeyboardPrefixSelection, _base);
	
	    function KeyboardPrefixSelection() {
	      _classCallCheck(this, KeyboardPrefixSelection);
	
	      return _possibleConstructorReturn(this, (KeyboardPrefixSelection.__proto__ || Object.getPrototypeOf(KeyboardPrefixSelection)).apply(this, arguments));
	    }
	
	    _createClass(KeyboardPrefixSelection, [{
	      key: _symbols2.default.getItemText,
	
	
	      // Default implementation returns an item's `alt` attribute or its
	      // `textContent`, in that order.
	      value: function value(item) {
	        return item.getAttribute('alt') || item.textContent;
	      }
	
	      // If the set of items has changed, reset the prefix. We'll also need to
	      // rebuild our cache of item text the next time we're asked for it.
	
	    }, {
	      key: _symbols2.default.itemsChanged,
	      value: function value() {
	        if (_get(KeyboardPrefixSelection.prototype.__proto__ || Object.getPrototypeOf(KeyboardPrefixSelection.prototype), _symbols2.default.itemsChanged, this)) {
	          _get(KeyboardPrefixSelection.prototype.__proto__ || Object.getPrototypeOf(KeyboardPrefixSelection.prototype), _symbols2.default.itemsChanged, this).call(this);
	        }
	        this[itemTextContentsSymbol] = null;
	        resetTypedPrefix(this);
	      }
	    }, {
	      key: _symbols2.default.keydown,
	      value: function value(event) {
	        var handled = void 0;
	        var resetPrefix = true;
	
	        switch (event.keyCode) {
	          case 8:
	            // Backspace
	            handleBackspace(this);
	            handled = true;
	            resetPrefix = false;
	            break;
	          case 27:
	            // Escape
	            handled = true;
	            break;
	          default:
	            if (!event.ctrlKey && !event.metaKey && !event.altKey && event.which !== 32 /* Space */) {
	                handlePlainCharacter(this, String.fromCharCode(event.keyCode));
	              }
	            resetPrefix = false;
	        }
	
	        if (resetPrefix) {
	          resetTypedPrefix(this);
	        }
	
	        // Prefer mixin result if it's defined, otherwise use base result.
	        return handled || _get(KeyboardPrefixSelection.prototype.__proto__ || Object.getPrototypeOf(KeyboardPrefixSelection.prototype), _symbols2.default.keydown, this) && _get(KeyboardPrefixSelection.prototype.__proto__ || Object.getPrototypeOf(KeyboardPrefixSelection.prototype), _symbols2.default.keydown, this).call(this, event);
	      }
	    }, {
	      key: 'selectItemWithTextPrefix',
	
	
	      /**
	       * Select the first item whose text content begins with the given prefix.
	       *
	       * @param prefix [String] The prefix string to search for
	       */
	      value: function selectItemWithTextPrefix(prefix) {
	        if (_get(KeyboardPrefixSelection.prototype.__proto__ || Object.getPrototypeOf(KeyboardPrefixSelection.prototype), 'selectItemWithTextPrefix', this)) {
	          _get(KeyboardPrefixSelection.prototype.__proto__ || Object.getPrototypeOf(KeyboardPrefixSelection.prototype), 'selectItemWithTextPrefix', this).call(this, prefix);
	        }
	        if (prefix == null || prefix.length === 0) {
	          return;
	        }
	        var index = getIndexOfItemWithTextPrefix(this, prefix);
	        if (index >= 0) {
	          // Update the selection. During that operation, set the flag that lets
	          // us know that we are the cause of the selection change. See note at
	          // this mixin's `selectedIndex` implementation.
	          this[settingSelectionSymbol] = true;
	          this.selectedIndex = index;
	          this[settingSelectionSymbol] = false;
	        }
	      }
	    }, {
	      key: 'selectedIndex',
	      get: function get() {
	        return _get(KeyboardPrefixSelection.prototype.__proto__ || Object.getPrototypeOf(KeyboardPrefixSelection.prototype), 'selectedIndex', this);
	      },
	      set: function set(index) {
	        if ('selectedIndex' in base.prototype) {
	          _set(KeyboardPrefixSelection.prototype.__proto__ || Object.getPrototypeOf(KeyboardPrefixSelection.prototype), 'selectedIndex', index, this);
	        }
	        if (!this[settingSelectionSymbol]) {
	          // Someone else (not this mixin) has changed the selection. In response,
	          // we invalidate the prefix under construction.
	          resetTypedPrefix(this);
	        }
	      }
	    }]);
	
	    return KeyboardPrefixSelection;
	  }(base);
	
	  return KeyboardPrefixSelection;
	}
	
	// Return the index of the first item with the given prefix, else -1.
	function getIndexOfItemWithTextPrefix(element, prefix) {
	  var itemTextContents = getItemTextContents(element);
	  var prefixLength = prefix.length;
	  for (var i = 0; i < itemTextContents.length; i++) {
	    var itemTextContent = itemTextContents[i];
	    if (itemTextContent.substr(0, prefixLength) === prefix) {
	      return i;
	    }
	  }
	  return -1;
	}
	
	// Return an array of the text content (in lowercase) of all items.
	// Cache these results.
	function getItemTextContents(element) {
	  if (!element[itemTextContentsSymbol]) {
	    var items = element.items;
	    element[itemTextContentsSymbol] = Array.prototype.map.call(items, function (item) {
	      var text = element[_symbols2.default.getItemText](item);
	      return text.toLowerCase();
	    });
	  }
	  return element[itemTextContentsSymbol];
	}
	
	// Handle the Backspace key: remove the last character from the prefix.
	function handleBackspace(element) {
	  var length = element[typedPrefixSymbol] ? element[typedPrefixSymbol].length : 0;
	  if (length > 0) {
	    element[typedPrefixSymbol] = element[typedPrefixSymbol].substr(0, length - 1);
	  }
	  element.selectItemWithTextPrefix(element[typedPrefixSymbol]);
	  setPrefixTimeout(element);
	}
	
	// Add a plain character to the prefix.
	function handlePlainCharacter(element, char) {
	  var prefix = element[typedPrefixSymbol] || '';
	  element[typedPrefixSymbol] = prefix + char.toLowerCase();
	  element.selectItemWithTextPrefix(element[typedPrefixSymbol]);
	  setPrefixTimeout(element);
	}
	
	// Stop listening for typing.
	function resetPrefixTimeout(element) {
	  if (element[prefixTimeoutSymbol]) {
	    clearTimeout(element[prefixTimeoutSymbol]);
	    element[prefixTimeoutSymbol] = false;
	  }
	}
	
	// Clear the prefix under construction.
	function resetTypedPrefix(element) {
	  element[typedPrefixSymbol] = '';
	  resetPrefixTimeout(element);
	}
	
	// Wait for the user to stop typing.
	function setPrefixTimeout(element) {
	  resetPrefixTimeout(element);
	  element[prefixTimeoutSymbol] = setTimeout(function () {
	    resetTypedPrefix(element);
	  }, _constants2.default.TYPING_TIMEOUT_DURATION);
	}

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * A collection of constants used by Elix mixins and components for consistency
	 * in things such as user interface timings.
	 *
	 * @module constants
	 */
	var constants = {
	
	  /**
	   * Time in milliseconds after which the user is considered to have stopped
	   * typing.
	   *
	   * @const {number} TYPING_TIMEOUT_DURATION
	   */
	  TYPING_TIMEOUT_DURATION: 1000
	
	};
	
	exports.default = constants;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	exports.default = function (base) {
	
	  /**
	   * The class prototype added by the mixin.
	   */
	  var SelectionAria = function (_base) {
	    _inherits(SelectionAria, _base);
	
	    function SelectionAria() {
	      _classCallCheck(this, SelectionAria);
	
	      return _possibleConstructorReturn(this, (SelectionAria.__proto__ || Object.getPrototypeOf(SelectionAria)).apply(this, arguments));
	    }
	
	    _createClass(SelectionAria, [{
	      key: 'connectedCallback',
	      value: function connectedCallback() {
	        if (_get(SelectionAria.prototype.__proto__ || Object.getPrototypeOf(SelectionAria.prototype), 'connectedCallback', this)) {
	          _get(SelectionAria.prototype.__proto__ || Object.getPrototypeOf(SelectionAria.prototype), 'connectedCallback', this).call(this);
	        }
	
	        // Set default ARIA role for the overall component.
	        if (this.getAttribute('role') == null && this[_symbols2.default.defaults].role) {
	          this.setAttribute('role', this[_symbols2.default.defaults].role);
	        }
	      }
	    }, {
	      key: _symbols2.default.itemAdded,
	      value: function value(item) {
	        if (_get(SelectionAria.prototype.__proto__ || Object.getPrototypeOf(SelectionAria.prototype), _symbols2.default.itemAdded, this)) {
	          _get(SelectionAria.prototype.__proto__ || Object.getPrototypeOf(SelectionAria.prototype), _symbols2.default.itemAdded, this).call(this, item);
	        }
	
	        if (!item.getAttribute('role')) {
	          // Assign a default ARIA role for an individual item.
	          item.setAttribute('role', this[_symbols2.default.defaults].itemRole);
	        }
	
	        // Ensure each item has an ID so we can set aria-activedescendant on the
	        // overall list whenever the selection changes.
	        //
	        // The ID will take the form of a base ID plus a unique integer. The base
	        // ID will be incorporate the component's own ID. E.g., if a component has
	        // ID "foo", then its items will have IDs that look like "_fooOption1". If
	        // the compnent has no ID itself, its items will get IDs that look like
	        // "_option1". Item IDs are prefixed with an underscore to differentiate
	        // them from manually-assigned IDs, and to minimize the potential for ID
	        // conflicts.
	        if (!item.id) {
	          var baseId = this.id ? "_" + this.id + "Option" : "_option";
	          item.id = baseId + idCount++;
	        }
	      }
	    }, {
	      key: _symbols2.default.itemSelected,
	      value: function value(item, selected) {
	        if (_get(SelectionAria.prototype.__proto__ || Object.getPrototypeOf(SelectionAria.prototype), _symbols2.default.itemSelected, this)) {
	          _get(SelectionAria.prototype.__proto__ || Object.getPrototypeOf(SelectionAria.prototype), _symbols2.default.itemSelected, this).call(this, item, selected);
	        }
	        item.setAttribute('aria-selected', selected);
	        var itemId = item.id;
	        if (itemId && selected) {
	          this.setAttribute('aria-activedescendant', itemId);
	        }
	      }
	    }, {
	      key: _symbols2.default.defaults,
	      get: function get() {
	        var defaults = _get(SelectionAria.prototype.__proto__ || Object.getPrototypeOf(SelectionAria.prototype), _symbols2.default.defaults, this) || {};
	        defaults.role = 'listbox';
	        defaults.itemRole = 'option';
	        return defaults;
	      }
	    }, {
	      key: 'selectedItem',
	      get: function get() {
	        return _get(SelectionAria.prototype.__proto__ || Object.getPrototypeOf(SelectionAria.prototype), 'selectedItem', this);
	      },
	      set: function set(item) {
	        if ('selectedItem' in base.prototype) {
	          _set(SelectionAria.prototype.__proto__ || Object.getPrototypeOf(SelectionAria.prototype), 'selectedItem', item, this);
	        }
	        if (item == null) {
	          // Selection was removed.
	          this.removeAttribute('aria-activedescendant');
	        }
	      }
	    }]);
	
	    return SelectionAria;
	  }(base);
	
	  return SelectionAria;
	};
	
	var _symbols = __webpack_require__(6);
	
	var _symbols2 = _interopRequireDefault(_symbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// Used to assign unique IDs to item elements without IDs.
	var idCount = 0;
	
	/**
	 * Mixin which treats the selected item in a list as the active item in ARIA
	 * accessibility terms.
	 *
	 * Handling ARIA selection state properly is actually quite complex:
	 *
	 * * The items in the list need to be indicated as possible items via an ARIA
	 *   `role` attribute value such as "option".
	 * * The selected item need to be marked as selected by setting the item's
	 *   `aria-selected` attribute to true *and* the other items need be marked as
	 *   *not* selected by setting `aria-selected` to false.
	 * * The outermost element with the keyboard focus needs to have attributes
	 *   set on it so that the selection is knowable at the list level via the
	 *   `aria-activedescendant` attribute.
	 * * Use of `aria-activedescendant` in turn requires that all items in the
	 *   list have ID attributes assigned to them.
	 *
	 * This mixin tries to address all of the above requirements. To that end,
	 * this mixin will assign generated IDs to any item that doesn't already have
	 * an ID.
	 *
	 * ARIA relies on elements to provide `role` attributes. This mixin will apply
	 * a default role of "listbox" on the outer list if it doesn't already have an
	 * explicit role. Similarly, this mixin will apply a default role of "option"
	 * to any list item that does not already have a role specified.
	 *
	 * This mixin expects a set of members that manage the state of the selection:
	 * `[symbols.itemSelected]`, `[symbols.itemAdded]`, and `selectedItem`. You can
	 * supply these yourself, or do so via
	 * [SingleSelectionMixin](SingleSelectionMixin.md).
	 *
	 * @module
	 * @param base {Class} the base class to extend
	 * @returns {Class} the extended class
	 */

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _defaultScrollTarget = __webpack_require__(13);
	
	var _defaultScrollTarget2 = _interopRequireDefault(_defaultScrollTarget);
	
	var _symbols = __webpack_require__(6);
	
	var _symbols2 = _interopRequireDefault(_symbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Mixin which scrolls a container horizontally and/or vertically to ensure that
	 * a newly-selected item is visible to the user.
	 *
	 * When the selected item in a list-like component changes, the selected item
	 * should be brought into view so that the user can confirm their selection.
	 *
	 * This mixin expects a `selectedItem` property to be set when the selection
	 * changes. You can supply that yourself, or use
	 * [SingleSelectionMixin](SingleSelectionMixin.md).
	 *
	 * @module SelectinInViewMixin
	 * @param base {Class} the base class to extend
	 * @returns {Class} the extended class
	 */
	exports.default = function (base) {
	
	  /**
	   * The class prototype added by the mixin.
	   */
	  var SelectionInView = function (_base) {
	    _inherits(SelectionInView, _base);
	
	    function SelectionInView() {
	      _classCallCheck(this, SelectionInView);
	
	      return _possibleConstructorReturn(this, (SelectionInView.__proto__ || Object.getPrototypeOf(SelectionInView)).apply(this, arguments));
	    }
	
	    _createClass(SelectionInView, [{
	      key: 'connectedCallback',
	      value: function connectedCallback() {
	        if (_get(SelectionInView.prototype.__proto__ || Object.getPrototypeOf(SelectionInView.prototype), 'connectedCallback', this)) {
	          _get(SelectionInView.prototype.__proto__ || Object.getPrototypeOf(SelectionInView.prototype), 'connectedCallback', this).call(this);
	        }
	        var selectedItem = this.selectedItem;
	        if (selectedItem) {
	          this.scrollItemIntoView(selectedItem);
	        }
	      }
	
	      /**
	       * Scroll the given element completely into view, minimizing the degree of
	       * scrolling performed.
	       *
	       * Blink has a `scrollIntoViewIfNeeded()` function that does something
	       * similar, but unfortunately it's non-standard, and in any event often ends
	       * up scrolling more than is absolutely necessary.
	       *
	       * This scrolls the containing element defined by the `scrollTarget`
	       * property. See that property for a discussion of the default value of
	       * that property.
	       *
	       * @param {HTMLElement} item - the item to scroll into view.
	       */
	
	    }, {
	      key: 'scrollItemIntoView',
	      value: function scrollItemIntoView(item) {
	        if (_get(SelectionInView.prototype.__proto__ || Object.getPrototypeOf(SelectionInView.prototype), 'scrollItemIntoView', this)) {
	          _get(SelectionInView.prototype.__proto__ || Object.getPrototypeOf(SelectionInView.prototype), 'scrollItemIntoView', this).call(this);
	        }
	
	        var scrollTarget = this[_symbols2.default.scrollTarget];
	
	        // Determine the bounds of the scroll target and item. We use
	        // getBoundingClientRect instead of .offsetTop, etc., because the latter
	        // round values, and we want to handle fractional values.
	        var scrollTargetRect = scrollTarget.getBoundingClientRect();
	        var itemRect = item.getBoundingClientRect();
	
	        // Determine how far the item is outside the viewport.
	        var bottomDelta = itemRect.bottom - scrollTargetRect.bottom;
	        var topDelta = itemRect.top - scrollTargetRect.top;
	        var leftDelta = itemRect.left - scrollTargetRect.left;
	        var rightDelta = itemRect.right - scrollTargetRect.right;
	
	        // Scroll the target as necessary to bring the item into view.
	        if (bottomDelta > 0) {
	          scrollTarget.scrollTop += bottomDelta; // Scroll down
	        } else if (topDelta < 0) {
	          scrollTarget.scrollTop += Math.ceil(topDelta); // Scroll up
	        }
	        if (rightDelta > 0) {
	          scrollTarget.scrollLeft += rightDelta; // Scroll right
	        } else if (leftDelta < 0) {
	          scrollTarget.scrollLeft += Math.ceil(leftDelta); // Scroll left
	        }
	      }
	
	      /* Provide a default scrollTarget implementation if none exists. */
	
	    }, {
	      key: _symbols2.default.scrollTarget,
	      get: function get() {
	        return _get(SelectionInView.prototype.__proto__ || Object.getPrototypeOf(SelectionInView.prototype), _symbols2.default.scrollTarget, this) || (0, _defaultScrollTarget2.default)(this);
	      }
	    }, {
	      key: 'selectedItem',
	      get: function get() {
	        return _get(SelectionInView.prototype.__proto__ || Object.getPrototypeOf(SelectionInView.prototype), 'selectedItem', this);
	      },
	      set: function set(item) {
	        if ('selectedItem' in base.prototype) {
	          _set(SelectionInView.prototype.__proto__ || Object.getPrototypeOf(SelectionInView.prototype), 'selectedItem', item, this);
	        }
	        if (item) {
	          // Keep the selected item in view.
	          this.scrollItemIntoView(item);
	        }
	      }
	    }]);
	
	    return SelectionInView;
	  }(base);
	
	  return SelectionInView;
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	exports.default = ShadowTemplateMixin;
	
	var _symbols = __webpack_require__(6);
	
	var _symbols2 = _interopRequireDefault(_symbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// A cache of processed templates.
	//
	// We maintain this as a map keyed by element tag (localName). We could store
	// an element's processed template on its element prototype. One scenario that
	// wouldn't support would be registration of the same constructor under multiple
	// tag names, which was a (perhaps theoretical) use case for Custom Elements.
	//
	var mapTagToTemplate = {};
	
	/**
	 * Mixin which adds stamping a template into a Shadow DOM subtree upon component
	 * instantiation.
	 *
	 * To use this mixin, define a `template` property as a string or HTML
	 * `<template>` element:
	 *
	 *     class MyElement extends ShadowTemplateMixin(HTMLElement) {
	 *       get [symbols.template]() {
	 *         return `Hello, <em>world</em>.`;
	 *       }
	 *     }
	 *
	 * When your component class is instantiated, a shadow root will be created on
	 * the instance, and the contents of the template will be cloned into the
	 * shadow root. If your component does not define a `template` property, this
	 * mixin has no effect.
	 *
	 * For the time being, this extension retains support for Shadow DOM v0. That
	 * will eventually be deprecated as browsers (and the Shadow DOM polyfill)
	 * implement Shadow DOM v1.
	 *
	 * @module ShadowTemplateMixin
	 * @param base {Class} the base class to extend
	 * @returns {Class} the extended class
	 */
	function ShadowTemplateMixin(base) {
	
	  /**
	   * The class prototype added by the mixin.
	   */
	  var ShadowTemplate = function (_base) {
	    _inherits(ShadowTemplate, _base);
	
	    /*
	     * If the component defines a template, a shadow root will be created on the
	     * component instance, and the template stamped into it.
	     */
	    function ShadowTemplate() {
	      _classCallCheck(this, ShadowTemplate);
	
	      var _this = _possibleConstructorReturn(this, (ShadowTemplate.__proto__ || Object.getPrototypeOf(ShadowTemplate)).call(this));
	
	      var tag = _this.localName;
	      var template = mapTagToTemplate[tag];
	
	      // See if we've already processed a template for this tag.
	      if (!template) {
	        // This is the first time we've created an instance of this tag.
	
	        // Get the template and perform initial processing.
	        template = _this[_symbols2.default.template];
	        if (!template) {
	          console.warn('ShadowTemplateMixin expects a component to define a property called [symbols.template].');
	          return _possibleConstructorReturn(_this);
	        }
	
	        if (typeof template === 'string') {
	          // Upgrade plain string to real template.
	          var templateText = template;
	          template = document.createElement('template');
	          template.innerHTML = templateText;
	        }
	
	        if (window.ShadyCSS) {
	          // Let the CSS polyfill do its own initialization.
	          window.ShadyCSS.prepareTemplate(template, tag);
	        }
	
	        // Store this for the next time we create the same type of element.
	        mapTagToTemplate[tag] = template;
	      }
	
	      // Stamp the template into a new shadow root.
	      var root = _this.attachShadow({ mode: 'open' });
	      var clone = document.importNode(template.content, true);
	      root.appendChild(clone);
	
	      /* Let the component know the shadow tree has been populated. */
	      if (_this[_symbols2.default.shadowCreated]) {
	        _this[_symbols2.default.shadowCreated]();
	      }
	      return _this;
	    }
	
	    _createClass(ShadowTemplate, [{
	      key: 'connectedCallback',
	      value: function connectedCallback() {
	        if (_get(ShadowTemplate.prototype.__proto__ || Object.getPrototypeOf(ShadowTemplate.prototype), 'connectedCallback', this)) {
	          _get(ShadowTemplate.prototype.__proto__ || Object.getPrototypeOf(ShadowTemplate.prototype), 'connectedCallback', this).call(this);
	        }
	        if (window.ShadyCSS) {
	          window.ShadyCSS.applyStyle(this);
	        }
	      }
	    }]);
	
	    return ShadowTemplate;
	  }(base);
	
	  return ShadowTemplate;
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };
	
	exports.default = SingleSelectionMixin;
	
	var _Symbol2 = __webpack_require__(4);
	
	var _Symbol3 = _interopRequireDefault(_Symbol2);
	
	var _symbols = __webpack_require__(6);
	
	var _symbols2 = _interopRequireDefault(_symbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// Symbols for private data members on an element.
	var canSelectNextSymbol = (0, _Symbol3.default)('canSelectNext');
	var canSelectPreviousSymbol = (0, _Symbol3.default)('canSelectPrevious');
	var selectionRequiredSymbol = (0, _Symbol3.default)('selectionRequired');
	var selectionWrapsSymbol = (0, _Symbol3.default)('selectionWraps');
	
	// We want to expose both selectedIndex and selectedItem as independent
	// properties but keep them in sync. This allows a component user to reference
	// the selection by whatever means is most natural for their situation.
	//
	// To efficiently keep these properties in sync, we track "external" and
	// "internal" references for each property:
	//
	// The external index or item is the one we report to the outside world when
	// asked for selection.  When handling a change to index or item, we update the
	// external reference as soon as possible, so that if anyone immediately asks
	// for the current selection, they will receive a stable answer.
	//
	// The internal index or item tracks whichever index or item last received the
	// full set of processing. Processing includes raising a change event for the
	// new value. Once we've begun that processing, we store the new value as the
	// internal value to indicate we've handled it.
	//
	var externalSelectedIndexSymbol = (0, _Symbol3.default)('externalSelectedIndex');
	var externalSelectedItemSymbol = (0, _Symbol3.default)('externalSelectedItem');
	var internalSelectedIndexSymbol = (0, _Symbol3.default)('internalSelectedIndex');
	var internalSelectedItemSymbol = (0, _Symbol3.default)('internalSelectedItem');
	
	/**
	 * Mixin which adds single-selection semantics for items in a list.
	 *
	 * This mixin expects a component to provide an `items` Array or NodeList of
	 * all elements in the list.
	 *
	 * This mixin tracks a single selected item in the list, and provides means to
	 * get and set that state by item position (`selectedIndex`) or item identity
	 * (`selectedItem`). The selection can be moved in the list via the methods
	 * `selectFirst`, `selectLast`, `selectNext`, and `selectPrevious`.
	 *
	 * This mixin does not produce any user-visible effects to represent
	 * selection.
	 *
	 * @module SingleSelectionMixin
	 * @param base {Class} the base class to extend
	 * @returns {Class} the extended class
	 */
	function SingleSelectionMixin(base) {
	
	  /**
	   * The class prototype added by the mixin.
	   */
	  var SingleSelection = function (_base) {
	    _inherits(SingleSelection, _base);
	
	    function SingleSelection() {
	      _classCallCheck(this, SingleSelection);
	
	      // Set defaults.
	      var _this = _possibleConstructorReturn(this, (SingleSelection.__proto__ || Object.getPrototypeOf(SingleSelection)).call(this));
	
	      if (typeof _this.selectionRequired === 'undefined') {
	        _this.selectionRequired = _this[_symbols2.default.defaults].selectionRequired;
	      }
	      if (typeof _this.selectionWraps === 'undefined') {
	        _this.selectionWraps = _this[_symbols2.default.defaults].selectionWraps;
	      }
	      return _this;
	    }
	
	    /**
	     * True if the selection can be moved to the next item, false if not (the
	     * selected item is the last item in the list).
	     *
	     * @type {boolean}
	     */
	
	
	    _createClass(SingleSelection, [{
	      key: _symbols2.default.itemAdded,
	
	
	      /**
	       * Handle a new item being added to the list.
	       *
	       * The default implementation of this method simply sets the item's
	       * selection state to false.
	       *
	       * @param {HTMLElement} item - the item being added
	       */
	      value: function value(item) {
	        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.itemAdded, this)) {
	          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.itemAdded, this).call(this, item);
	        }
	        this[_symbols2.default.itemSelected](item, item === this.selectedItem);
	      }
	    }, {
	      key: _symbols2.default.itemsChanged,
	      value: function value() {
	        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.itemsChanged, this)) {
	          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.itemsChanged, this).call(this);
	        }
	
	        // In case selected item changed position or was removed.
	        trackSelectedItem(this);
	
	        // In case the change in items affected which navigations are possible.
	        updatePossibleNavigations(this);
	      }
	
	      /**
	       * Apply the indicate selection state to the item.
	       *
	       * The default implementation of this method does nothing. User-visible
	       * effects will typically be handled by other mixins.
	       *
	       * @param {HTMLElement} item - the item being selected/deselected
	       * @param {boolean} selected - true if the item is selected, false if not
	       */
	
	    }, {
	      key: _symbols2.default.itemSelected,
	      value: function value(item, selected) {
	        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.itemSelected, this)) {
	          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.itemSelected, this).call(this, item, selected);
	        }
	      }
	
	      /**
	       * The index of the item which is currently selected.
	       *
	       * The setter expects an integer or a string representing an integer.
	       *
	       * A `selectedIndex` of -1 indicates there is no selection. Setting this
	       * property to -1 will remove any existing selection.
	       *
	       * @type {number}
	       */
	
	    }, {
	      key: 'selectFirst',
	
	
	      /**
	       * Select the first item in the list.
	       *
	       * @returns {Boolean} True if the selection changed, false if not.
	       */
	      value: function selectFirst() {
	        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectFirst', this)) {
	          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectFirst', this).call(this);
	        }
	        return selectIndex(this, 0);
	      }
	
	      /**
	       * True if the list should always have a selection (if it has items).
	       *
	       * @type {boolean}
	       * @default false
	       */
	
	    }, {
	      key: 'selectLast',
	
	
	      /**
	       * Select the last item in the list.
	       *
	       * @returns {Boolean} True if the selection changed, false if not.
	       */
	      value: function selectLast() {
	        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectLast', this)) {
	          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectLast', this).call(this);
	        }
	        return selectIndex(this, this.items.length - 1);
	      }
	
	      /**
	       * Select the next item in the list.
	       *
	       * If the list has no selection, the first item will be selected.
	       *
	       * @returns {Boolean} True if the selection changed, false if not.
	       */
	
	    }, {
	      key: 'selectNext',
	      value: function selectNext() {
	        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectNext', this)) {
	          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectNext', this).call(this);
	        }
	        return selectIndex(this, this.selectedIndex + 1);
	      }
	
	      /**
	       * Select the previous item in the list.
	       *
	       * If the list has no selection, the last item will be selected.
	       *
	       * @returns {Boolean} True if the selection changed, false if not.
	       */
	
	    }, {
	      key: 'selectPrevious',
	      value: function selectPrevious() {
	        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectPrevious', this)) {
	          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectPrevious', this).call(this);
	        }
	        var newIndex = this.selectedIndex < 0 ? this.items.length - 1 : // No selection yet; select last item.
	        this.selectedIndex - 1;
	        return selectIndex(this, newIndex);
	      }
	
	      /**
	       * Fires when the canSelectNext property changes in response to internal
	       * component activity.
	       *
	       * @memberof SingleSelection
	       * @event can-select-next-changed
	       */
	
	      /**
	       * Fires when the canSelectPrevious property changes in response to internal
	       * component activity.
	       *
	       * @memberof SingleSelection
	       * @event can-select-previous-changed
	       */
	
	      /**
	       * Fires when the selectedIndex property changes in response to internal
	       * component activity.
	       *
	       * @memberof SingleSelection
	       * @event selected-index-changed
	       * @param {number} detail.selectedIndex The new selected index.
	       */
	
	      /**
	       * Fires when the selectedItem property changes in response to internal
	       * component activity.
	       *
	       * @memberof SingleSelection
	       * @event selected-item-changed
	       * @param {HTMLElement} detail.selectedItem The new selected item.
	       */
	
	    }, {
	      key: 'canSelectNext',
	      get: function get() {
	        return this[canSelectNextSymbol];
	      },
	      set: function set(canSelectNext) {
	        var changed = canSelectNext !== this[canSelectNextSymbol];
	        this[canSelectNextSymbol] = canSelectNext;
	        if ('canSelectNext' in base.prototype) {
	          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'canSelectNext', canSelectNext, this);
	        }
	        if (this[_symbols2.default.raiseChangeEvents] && changed) {
	          this.dispatchEvent(new CustomEvent('can-select-next-changed'));
	        }
	      }
	
	      /**
	       * True if the selection can be moved to the previous item, false if not
	       * (the selected item is the first one in the list).
	       *
	       * @type {boolean}
	       */
	
	    }, {
	      key: 'canSelectPrevious',
	      get: function get() {
	        return this[canSelectPreviousSymbol];
	      },
	      set: function set(canSelectPrevious) {
	        var changed = canSelectPrevious !== this[canSelectPreviousSymbol];
	        this[canSelectPreviousSymbol] = canSelectPrevious;
	        if ('canSelectPrevious' in base.prototype) {
	          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'canSelectPrevious', canSelectPrevious, this);
	        }
	        if (this[_symbols2.default.raiseChangeEvents] && changed) {
	          this.dispatchEvent(new CustomEvent('can-select-previous-changed'));
	        }
	      }
	    }, {
	      key: _symbols2.default.defaults,
	      get: function get() {
	        var defaults = _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.defaults, this) || {};
	        defaults.selectionRequired = false;
	        defaults.selectionWraps = false;
	        return defaults;
	      }
	    }, {
	      key: 'selectedIndex',
	      get: function get() {
	        return this[externalSelectedIndexSymbol] != null ? this[externalSelectedIndexSymbol] : -1;
	      },
	      set: function set(index) {
	        // See notes at top about internal vs. external copies of this property.
	        var changed = index !== this[internalSelectedIndexSymbol];
	        var item = void 0;
	        var parsedIndex = parseInt(index);
	        if (parsedIndex !== this[externalSelectedIndexSymbol]) {
	          // Store the new index and the corresponding item.
	          var items = this.items;
	          var hasItems = items && items.length > 0;
	          if (!(hasItems && parsedIndex >= 0 && parsedIndex < items.length)) {
	            parsedIndex = -1; // No item at that index.
	          }
	          this[externalSelectedIndexSymbol] = parsedIndex;
	          item = hasItems && parsedIndex >= 0 ? items[parsedIndex] : null;
	          this[externalSelectedItemSymbol] = item;
	        } else {
	          item = this[externalSelectedItemSymbol];
	        }
	
	        // Now let super do any work.
	        if ('selectedIndex' in base.prototype) {
	          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectedIndex', index, this);
	        }
	
	        if (changed) {
	          // The selected index changed.
	          this[internalSelectedIndexSymbol] = parsedIndex;
	
	          if (this[_symbols2.default.raiseChangeEvents]) {
	            var event = new CustomEvent('selected-index-changed', {
	              detail: {
	                selectedIndex: parsedIndex,
	                value: parsedIndex // for Polymer binding. TODO: Verify still necessary
	              }
	            });
	            this.dispatchEvent(event);
	          }
	        }
	
	        if (this[internalSelectedItemSymbol] !== item) {
	          // Update selectedItem property so it can have its own effects.
	          this.selectedItem = item;
	        }
	      }
	
	      /**
	       * The currently selected item, or null if there is no selection.
	       *
	       * Setting this property to null deselects any currently-selected item.
	       * Setting this property to an object that is not in the list has no effect.
	       *
	       * TODO: Even if selectionRequired, can still explicitly set selectedItem to null.
	       * TODO: If selectionRequired, leave selection alone?
	       *
	       * @type {object}
	       */
	
	    }, {
	      key: 'selectedItem',
	      get: function get() {
	        return this[externalSelectedItemSymbol] || null;
	      },
	      set: function set(item) {
	        // See notes at top about internal vs. external copies of this property.
	        var previousSelectedItem = this[internalSelectedItemSymbol];
	        var changed = item !== previousSelectedItem;
	        var index = void 0;
	        if (item !== this[externalSelectedItemSymbol]) {
	          // Store item and look up corresponding index.
	          var items = this.items;
	          var hasItems = items && items.length > 0;
	          index = hasItems ? Array.prototype.indexOf.call(items, item) : -1;
	          this[externalSelectedIndexSymbol] = index;
	          if (index < 0) {
	            item = null; // The indicated item isn't actually in `items`.
	          }
	          this[externalSelectedItemSymbol] = item;
	        } else {
	          index = this[externalSelectedIndexSymbol];
	        }
	
	        // Now let super do any work.
	        if ('selectedItem' in base.prototype) {
	          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectedItem', item, this);
	        }
	
	        if (changed) {
	          // The selected item changed.
	          this[internalSelectedItemSymbol] = item;
	
	          if (previousSelectedItem) {
	            // Update selection state of old item.
	            this[_symbols2.default.itemSelected](previousSelectedItem, false);
	          }
	          if (item) {
	            // Update selection state to new item.
	            this[_symbols2.default.itemSelected](item, true);
	          }
	
	          updatePossibleNavigations(this);
	
	          if (this[_symbols2.default.raiseChangeEvents]) {
	            var event = new CustomEvent('selected-item-changed', {
	              detail: {
	                selectedItem: item,
	                value: item // for Polymer binding
	              }
	            });
	            this.dispatchEvent(event);
	          }
	        }
	
	        if (this[internalSelectedIndexSymbol] !== index) {
	          // Update selectedIndex property so it can have its own effects.
	          this.selectedIndex = index;
	        }
	      }
	    }, {
	      key: 'selectionRequired',
	      get: function get() {
	        return this[selectionRequiredSymbol];
	      },
	      set: function set(selectionRequired) {
	        var parsed = String(selectionRequired) === 'true';
	        var changed = parsed !== this[selectionRequiredSymbol];
	        this[selectionRequiredSymbol] = parsed;
	        if ('selectionRequired' in base.prototype) {
	          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectionRequired', selectionRequired, this);
	        }
	        if (changed) {
	          if (this[_symbols2.default.raiseChangeEvents]) {
	            var event = new CustomEvent('selection-required-changed');
	            this.dispatchEvent(event);
	          }
	          if (selectionRequired) {
	            trackSelectedItem(this);
	          }
	        }
	      }
	
	      /**
	       * True if selection navigations wrap from last to first, and vice versa.
	       *
	       * @type {boolean}
	       * @default false
	       */
	
	    }, {
	      key: 'selectionWraps',
	      get: function get() {
	        return this[selectionWrapsSymbol];
	      },
	      set: function set(selectionWraps) {
	        var parsed = String(selectionWraps) === 'true';
	        var changed = parsed !== this[selectionWrapsSymbol];
	        this[selectionWrapsSymbol] = parsed;
	        if ('selectionWraps' in base.prototype) {
	          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectionWraps', selectionWraps, this);
	        }
	        if (changed) {
	          if (this[_symbols2.default.raiseChangeEvents]) {
	            var event = new CustomEvent('selection-wraps-changed');
	            this.dispatchEvent(event);
	          }
	          updatePossibleNavigations(this);
	        }
	      }
	    }]);
	
	    return SingleSelection;
	  }(base);
	
	  return SingleSelection;
	}
	
	// Ensure the given index is within bounds, and select it if it's not already
	// selected.
	function selectIndex(element, index) {
	
	  var items = element.items;
	  if (items == null) {
	    // Nothing to select.
	    return false;
	  }
	
	  var count = items.length;
	  var boundedIndex = element.selectionWraps ?
	  // JavaScript mod doesn't handle negative numbers the way we want to wrap.
	  // See http://stackoverflow.com/a/18618250/76472
	  (index % count + count) % count :
	
	  // Keep index within bounds of array.
	  Math.max(Math.min(index, count - 1), 0);
	
	  var previousIndex = element.selectedIndex;
	  if (previousIndex !== boundedIndex) {
	    element.selectedIndex = boundedIndex;
	    return true;
	  } else {
	    return false;
	  }
	}
	
	// Following a change in the set of items, or in the value of the
	// `selectionRequired` property, reacquire the selected item. If it's moved,
	// update `selectedIndex`. If it's been removed, and a selection is required,
	// try to select another item.
	function trackSelectedItem(element) {
	
	  var items = element.items;
	  var itemCount = items ? items.length : 0;
	
	  var previousSelectedItem = element.selectedItem;
	  if (!previousSelectedItem) {
	    // No item was previously selected.
	    if (element.selectionRequired) {
	      // Select the first item by default.
	      element.selectedIndex = 0;
	    }
	  } else if (itemCount === 0) {
	    // We've lost the selection, and there's nothing left to select.
	    element.selectedItem = null;
	  } else {
	    // Try to find the previously-selected item in the current set of items.
	    var indexInCurrentItems = Array.prototype.indexOf.call(items, previousSelectedItem);
	    var previousSelectedIndex = element.selectedIndex;
	    if (indexInCurrentItems < 0) {
	      // Previously-selected item was removed from the items.
	      // Select the item at the same index (if it exists) or as close as possible.
	      var newSelectedIndex = Math.min(previousSelectedIndex, itemCount - 1);
	      // Select by item, since index may be the same, and we want to raise the
	      // selected-item-changed event.
	      element.selectedItem = items[newSelectedIndex];
	    } else if (indexInCurrentItems !== previousSelectedIndex) {
	      // Previously-selected item still there, but changed position.
	      element.selectedIndex = indexInCurrentItems;
	    }
	  }
	}
	
	// Following a change in selection, report whether it's now possible to
	// go next/previous from the given index.
	function updatePossibleNavigations(element) {
	  var canSelectNext = void 0;
	  var canSelectPrevious = void 0;
	  var items = element.items;
	  if (items == null || items.length === 0) {
	    // No items to select.
	    canSelectNext = false;
	    canSelectPrevious = false;
	  } else if (element.selectionWraps) {
	    // Since there are items, can always go next/previous.
	    canSelectNext = true;
	    canSelectPrevious = true;
	  } else {
	    var index = element.selectedIndex;
	    if (index < 0 && items.length > 0) {
	      // Special case. If there are items but no selection, declare that it's
	      // always possible to go next/previous to create a selection.
	      canSelectNext = true;
	      canSelectPrevious = true;
	    } else {
	      // Normal case: we have an index in a list that has items.
	      canSelectPrevious = index > 0;
	      canSelectNext = index < items.length - 1;
	    }
	  }
	  if (element.canSelectNext !== canSelectNext) {
	    element.canSelectNext = canSelectNext;
	  }
	  if (element.canSelectPrevious !== canSelectPrevious) {
	    element.canSelectPrevious = canSelectPrevious;
	  }
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _AttributeMarshallingMixin = __webpack_require__(2);
	
	var _AttributeMarshallingMixin2 = _interopRequireDefault(_AttributeMarshallingMixin);
	
	var _ChildrenContentMixin = __webpack_require__(21);
	
	var _ChildrenContentMixin2 = _interopRequireDefault(_ChildrenContentMixin);
	
	var _ClickSelectionMixin = __webpack_require__(5);
	
	var _ClickSelectionMixin2 = _interopRequireDefault(_ClickSelectionMixin);
	
	var _ContentItemsMixin = __webpack_require__(7);
	
	var _ContentItemsMixin2 = _interopRequireDefault(_ContentItemsMixin);
	
	var _DirectionSelectionMixin = __webpack_require__(9);
	
	var _DirectionSelectionMixin2 = _interopRequireDefault(_DirectionSelectionMixin);
	
	var _KeyboardDirectionMixin = __webpack_require__(10);
	
	var _KeyboardDirectionMixin2 = _interopRequireDefault(_KeyboardDirectionMixin);
	
	var _KeyboardMixin = __webpack_require__(11);
	
	var _KeyboardMixin2 = _interopRequireDefault(_KeyboardMixin);
	
	var _KeyboardPagedSelectionMixin = __webpack_require__(12);
	
	var _KeyboardPagedSelectionMixin2 = _interopRequireDefault(_KeyboardPagedSelectionMixin);
	
	var _KeyboardPrefixSelectionMixin = __webpack_require__(14);
	
	var _KeyboardPrefixSelectionMixin2 = _interopRequireDefault(_KeyboardPrefixSelectionMixin);
	
	var _SelectionAriaMixin = __webpack_require__(16);
	
	var _SelectionAriaMixin2 = _interopRequireDefault(_SelectionAriaMixin);
	
	var _SelectionInViewMixin = __webpack_require__(17);
	
	var _SelectionInViewMixin2 = _interopRequireDefault(_SelectionInViewMixin);
	
	var _ShadowTemplateMixin = __webpack_require__(18);
	
	var _ShadowTemplateMixin2 = _interopRequireDefault(_ShadowTemplateMixin);
	
	var _SingleSelectionMixin = __webpack_require__(19);
	
	var _SingleSelectionMixin2 = _interopRequireDefault(_SingleSelectionMixin);
	
	var _symbols = __webpack_require__(6);
	
	var _symbols2 = _interopRequireDefault(_symbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * This is currently a demo of how multiple mixins cooperate to perform useful
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * functions.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * * The component uses ShadowTemplateMixin to populate its shadow root.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * * A user can click on a child item, and ClickSelectionMixin will set the
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   selected item.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * * The SingleSelectionMixin will track the selected item, and map that to
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   changes in the selection state of the selected/deselected items.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * * The SelectionAriaMixin will reflect an item's selection state using ARIA
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   attributes to support assistive devices like screen readers.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * This demo will eventually evolve into a complete list box component, but
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * at the moment omits many features, including support for Page Up/Page Down
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * keys, keeping the selected item in view, the ability to select an item
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * by typing its initial characters, and support for slot elements as children.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	// We want to apply a number of mixin functions to HTMLElement.
	var mixins = [_AttributeMarshallingMixin2.default, _ChildrenContentMixin2.default, _ClickSelectionMixin2.default, _ContentItemsMixin2.default, _DirectionSelectionMixin2.default, _KeyboardDirectionMixin2.default, _KeyboardMixin2.default, _KeyboardPagedSelectionMixin2.default, _KeyboardPrefixSelectionMixin2.default, _SelectionAriaMixin2.default, _SelectionInViewMixin2.default, _ShadowTemplateMixin2.default, _SingleSelectionMixin2.default];
	
	// The mixins are functions, so an efficient way to apply them all is with
	// reduce. This is just function composition. We end up with a base class we
	// can extend below.
	var base = mixins.reduce(function (cls, mixin) {
	  return mixin(cls);
	}, HTMLElement);
	
	/**
	 * A simple single-selection list box.
	 *
	 * This uses the base class we just created above, and adds in the behavior
	 * unique to this list box element. As it turns out, much of this behavior is
	 * also interesting to other components, and will eventually get factored into
	 * other mixins.
	 *
	 * @extends HTMLElement
	 * @mixes AttributeMarshallingMixin
	 * @mixes ChildrenContentMixin
	 * @mixes ClickSelectionMixin
	 * @mixes ContentItemsMixin
	 * @mixes DirectionSelectionMixin
	 * @mixes KeyboardDirectionMixin
	 * @mixes KeyboardMixin
	 * @mixes KeyboardPagedSelectionMixin
	 * @mixes KeyboardPrefixSelectionMixin
	 * @mixes SelectionAriaMixin
	 * @mixes SelectionInViewMixin
	 * @mixes ShadowTemplateMixin
	 * @mixes SingleSelectionMixin
	 */
	
	var ListBox = function (_base) {
	  _inherits(ListBox, _base);
	
	  function ListBox() {
	    _classCallCheck(this, ListBox);
	
	    return _possibleConstructorReturn(this, (ListBox.__proto__ || Object.getPrototypeOf(ListBox)).apply(this, arguments));
	  }
	
	  _createClass(ListBox, [{
	    key: _symbols2.default.itemSelected,
	
	
	    // Map item selection to a `selected` CSS class.
	    value: function value(item, selected) {
	      if (_get(ListBox.prototype.__proto__ || Object.getPrototypeOf(ListBox.prototype), _symbols2.default.itemSelected, this)) {
	        _get(ListBox.prototype.__proto__ || Object.getPrototypeOf(ListBox.prototype), _symbols2.default.itemSelected, this).call(this, item, selected);
	      }
	      item.classList.toggle('selected', selected);
	    }
	
	    /**
	     * The vertical (default) or horizontal orientation of the list.
	     *
	     * Supported values are "horizontal" or "vertical".
	     *
	     * @type {string}
	     */
	
	  }, {
	    key: _symbols2.default.defaults,
	
	
	    // We define a collection of default property values which can be set in
	    // the constructor or connectedCallback. Defining the actual default values
	    // in those calls would complicate things if a subclass someday wants to
	    // define its own default value.
	    get: function get() {
	      var defaults = _get(ListBox.prototype.__proto__ || Object.getPrototypeOf(ListBox.prototype), _symbols2.default.defaults, this) || {};
	      // By default, we assume the list presents list items vertically.
	      defaults.orientation = 'vertical';
	      return defaults;
	    }
	  }, {
	    key: 'orientation',
	    get: function get() {
	      return this[_symbols2.default.orientation] || this[_symbols2.default.defaults].orientation;
	    },
	    set: function set(value) {
	      var changed = value !== this[_symbols2.default.orientation];
	      this[_symbols2.default.orientation] = value;
	      if ('orientation' in base) {
	        _set(ListBox.prototype.__proto__ || Object.getPrototypeOf(ListBox.prototype), 'orientation', value, this);
	      }
	      // Reflect attribute for styling
	      this.reflectAttribute('orientation', value);
	      if (changed && this[_symbols2.default.raiseChangeEvents]) {
	        var event = new CustomEvent('orientation-changed');
	        this.dispatchEvent(event);
	      }
	    }
	
	    // Define a template that will be stamped into the Shadow DOM by the
	    // ShadowTemplateMixin.
	
	  }, {
	    key: _symbols2.default.template,
	    get: function get() {
	      return '\n      <style>\n      :host {\n        border: 1px solid gray;\n        box-sizing: border-box;\n        cursor: default;\n        display: flex;\n        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n      }\n\n      #itemsContainer {\n        flex: 1;\n        -webkit-overflow-scrolling: touch; /* for momentum scrolling */\n        overflow-x: hidden;\n        overflow-y: scroll;\n      }\n      :host([orientation="horizontal"]) #itemsContainer {\n        display: flex;\n        overflow-x: scroll;\n        overflow-y: hidden;\n      }\n\n      #itemsContainer ::slotted(*) {\n        cursor: default;\n        padding: 0.25em;\n        -webkit-user-select: none;\n        -moz-user-select: none;\n        -ms-user-select: none;\n        user-select: none;\n      }\n\n      #itemsContainer ::slotted(.selected) {\n        background: var(--elix-selected-background, highlight);\n        color: var(--elix-selected-color, highlighttext);\n      }\n      </style>\n\n      <div id="itemsContainer" role="none">\n        <slot></slot>\n      </div>\n    ';
	    }
	
	    /**
	     * Fires when the orientation property changes in response to internal
	     * component activity.
	     *
	     * @memberof ListBox
	     * @event orientation-changed
	     */
	
	  }]);
	
	  return ListBox;
	}(base);
	
	customElements.define('sample-list-box', ListBox);
	exports.default = ListBox;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	exports.default = ChildrenContentMixin;
	
	var _content = __webpack_require__(8);
	
	var _Symbol2 = __webpack_require__(4);
	
	var _Symbol3 = _interopRequireDefault(_Symbol2);
	
	var _symbols = __webpack_require__(6);
	
	var _symbols2 = _interopRequireDefault(_symbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// Symbols for private data members on an element.
	var slotchangeFiredSymbol = (0, _Symbol3.default)('slotchangeFired');
	
	/**
	 * Mixin which defines a component's `symbols.content` property as all
	 * child elements, including elements distributed to the component's slots.
	 *
	 * This also provides notification of changes to a component's content. It
	 * will invoke a `symbols.contentChanged` method when the component is first
	 * instantiated, and whenever its distributed children change. This is intended
	 * to satisfy the Gold Standard checklist item for monitoring
	 * [Content Changes](https://github.com/webcomponents/gold-standard/wiki/Content-Changes).
	 *
	 * Example:
	 *
	 * ```
	 * let base = ChildrenContentMixin(DistributedChildrenMixin(HTMLElement));
	 * class CountingElement extends base {
	 *
	 *   constructor() {
	 *     super();
	 *     let root = this.attachShadow({ mode: 'open' });
	 *     root.innerHTML = `<slot></slot>`;
	 *     this[symbols.shadowCreated]();
	 *   }
	 *
	 *   [symbols.contentChanged]() {
	 *     if (super[symbols.contentChanged]) { super[symbols.contentChanged](); }
	 *     // Count the component's children, both initially and when changed.
	 *     this.count = this.distributedChildren.length;
	 *   }
	 *
	 * }
	 * ```
	 *
	 * Note that content change detection depends upon the element having at least
	 * one `slot` element in its shadow subtree.
	 *
	 * This mixin is intended for use with the
	 * [DistributedChildrenMixin](DistributedChildrenMixin.md). See that mixin for
	 * a discussion of how that works. This ChildrenContentMixin
	 * provides an easy way of defining the "content" of a component as the
	 * component's distributed children. That in turn lets mixins like
	 * [ContentItemsMixin](ContentItemsMixin.md) manipulate the children as list
	 * items.
	 *
	 * To receive `contentChanged` notification, this mixin expects a component to
	 * invoke a method called `symbols.shadowCreated` after the component's shadow
	 * root has been created and populated.
	 *
	 * @module ChildrenContentMixin
	 * @param base {Class} the base class to extend
	 * @returns {Class} the extended class
	 */
	function ChildrenContentMixin(base) {
	
	  /**
	   * The class prototype added by the mixin.
	   */
	  var ChildrenContent = function (_base) {
	    _inherits(ChildrenContent, _base);
	
	    function ChildrenContent() {
	      _classCallCheck(this, ChildrenContent);
	
	      return _possibleConstructorReturn(this, (ChildrenContent.__proto__ || Object.getPrototypeOf(ChildrenContent)).apply(this, arguments));
	    }
	
	    _createClass(ChildrenContent, [{
	      key: 'connectedCallback',
	      value: function connectedCallback() {
	        var _this2 = this;
	
	        if (_get(ChildrenContent.prototype.__proto__ || Object.getPrototypeOf(ChildrenContent.prototype), 'connectedCallback', this)) {
	          _get(ChildrenContent.prototype.__proto__ || Object.getPrototypeOf(ChildrenContent.prototype), 'connectedCallback', this).call(this);
	        }
	        // HACK for Blink, which doesn't correctly fire initial slotchange.
	        // See https://bugs.chromium.org/p/chromium/issues/detail?id=696659
	        setTimeout(function () {
	          // By this point, the slotchange event should have fired.
	          if (!_this2[slotchangeFiredSymbol]) {
	            // slotchange event didn't fire; we're in Blink. Force the invocation
	            // of contentChanged that would have happened on slotchange.
	            if (_this2[_symbols2.default.contentChanged]) {
	              _this2[_symbols2.default.contentChanged]();
	            }
	          }
	        });
	      }
	
	      /**
	       * The content of this component, defined to be the flattened array of
	       * children distributed to the component.
	       *
	       * The default implementation of this property only returns instances of
	       * Element
	       *
	       * @type {HTMLElement[]}
	       */
	
	    }, {
	      key: _symbols2.default.shadowCreated,
	      value: function value() {
	        var _this3 = this;
	
	        if (_get(ChildrenContent.prototype.__proto__ || Object.getPrototypeOf(ChildrenContent.prototype), _symbols2.default.shadowCreated, this)) {
	          _get(ChildrenContent.prototype.__proto__ || Object.getPrototypeOf(ChildrenContent.prototype), _symbols2.default.shadowCreated, this).call(this);
	        }
	        // Listen to changes on all slots.
	        var slots = this.shadowRoot.querySelectorAll('slot');
	        slots.forEach(function (slot) {
	          return slot.addEventListener('slotchange', function (event) {
	            _this3[slotchangeFiredSymbol] = true;
	            if (_this3[_symbols2.default.contentChanged]) {
	              _this3[_symbols2.default.contentChanged]();
	            }
	          });
	        });
	      }
	    }, {
	      key: _symbols2.default.content,
	      get: function get() {
	        return (0, _content.assignedChildren)(this);
	      }
	    }]);
	
	    return ChildrenContent;
	  }(base);
	
	  return ChildrenContent;
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _SingleSelectionMixin2 = __webpack_require__(19);
	
	var _SingleSelectionMixin3 = _interopRequireDefault(_SingleSelectionMixin2);
	
	var _symbols = __webpack_require__(6);
	
	var _symbols2 = _interopRequireDefault(_symbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/*
	 * A very simple component to show the application of SingleSelectionMixin.
	 *
	 * For a more complete demo using SingleSelectionMixin, see the ListBox demo.
	 */
	var SingleSelectionDemo = function (_SingleSelectionMixin) {
	  _inherits(SingleSelectionDemo, _SingleSelectionMixin);
	
	  function SingleSelectionDemo() {
	    _classCallCheck(this, SingleSelectionDemo);
	
	    var _this = _possibleConstructorReturn(this, (SingleSelectionDemo.__proto__ || Object.getPrototypeOf(SingleSelectionDemo)).call(this));
	
	    _this.addEventListener('mousedown', function (event) {
	      _this[_symbols2.default.raiseChangeEvents] = true;
	      _this.selectedItem = event.target;
	      event.stopPropagation();
	      _this[_symbols2.default.raiseChangeEvents] = false;
	    });
	    return _this;
	  }
	
	  _createClass(SingleSelectionDemo, [{
	    key: 'attributeChangedCallback',
	    value: function attributeChangedCallback(attributeName, oldValue, newValue) {
	      if (_get(SingleSelectionDemo.prototype.__proto__ || Object.getPrototypeOf(SingleSelectionDemo.prototype), 'attributeChangedCallback', this)) {
	        _get(SingleSelectionDemo.prototype.__proto__ || Object.getPrototypeOf(SingleSelectionDemo.prototype), 'attributeChangedCallback', this).call(this, attributeName, oldValue, newValue);
	      }
	      if (attributeName === 'selected-index') {
	        this.selectedIndex = newValue;
	      }
	    }
	
	    // Map item selection to a `selected` CSS class.
	
	  }, {
	    key: _symbols2.default.itemSelected,
	    value: function value(item, selected) {
	      if (_get(SingleSelectionDemo.prototype.__proto__ || Object.getPrototypeOf(SingleSelectionDemo.prototype), _symbols2.default.itemSelected, this)) {
	        _get(SingleSelectionDemo.prototype.__proto__ || Object.getPrototypeOf(SingleSelectionDemo.prototype), _symbols2.default.itemSelected, this).call(this, item, selected);
	      }
	      item.classList.toggle('selected', selected);
	    }
	
	    // Simplistic implementation of items property — doesn't handle redistribution.
	
	  }, {
	    key: 'items',
	    get: function get() {
	      return this.children;
	    }
	  }], [{
	    key: 'observedAttributes',
	    get: function get() {
	      return ['selected-index'];
	    }
	  }]);
	
	  return SingleSelectionDemo;
	}((0, _SingleSelectionMixin3.default)(HTMLElement));
	
	exports.default = SingleSelectionDemo;
	
	
	customElements.define('single-selection-demo', SingleSelectionDemo);

/***/ }
/******/ ]);
//# sourceMappingURL=demos.js.map