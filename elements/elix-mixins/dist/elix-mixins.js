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
	
	var _microtask = __webpack_require__(2);
	
	var _microtask2 = _interopRequireDefault(_microtask);
	
	var _SelectionAriaMixin = __webpack_require__(3);
	
	var _SelectionAriaMixin2 = _interopRequireDefault(_SelectionAriaMixin);
	
	var _ShadowTemplateMixin = __webpack_require__(6);
	
	var _ShadowTemplateMixin2 = _interopRequireDefault(_ShadowTemplateMixin);
	
	var _SingleSelectionMixin = __webpack_require__(7);
	
	var _SingleSelectionMixin2 = _interopRequireDefault(_SingleSelectionMixin);
	
	var _Symbol2 = __webpack_require__(5);
	
	var _Symbol3 = _interopRequireDefault(_Symbol2);
	
	var _symbols = __webpack_require__(4);
	
	var _symbols2 = _interopRequireDefault(_symbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	 * This file is transpiled to create an ES5-compatible distribution in which
	 * the package's main feature(s) are available via the window.Elix global.
	 * If you're already using ES6 yourself, ignore this file, and instead import
	 * the source file(s) you want from the src folder.
	 */
	
	window.Elix = window.Elix || {};
	
	window.Elix.microtask = _microtask2.default;
	window.Elix.SelectionAriaMixin = _SelectionAriaMixin2.default;
	window.Elix.ShadowTemplateMixin = _ShadowTemplateMixin2.default;
	window.Elix.SingleSelectionMixin = _SingleSelectionMixin2.default;
	window.Elix.Symbol = _Symbol3.default;
	window.Elix.symbols = _symbols2.default;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = microtask;
	/*
	 * Microtask helper for IE 11.
	 *
	 * Executing a function as a microtask is trivial in browsers that support
	 * promises, whose then() clauses use microtask timing. IE 11 doesn't support
	 * promises, but does support MutationObservers, which are also executed as
	 * microtasks. So this helper uses an MutationObserver to achieve microtask
	 * timing.
	 *
	 * See https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
	 *
	 * Inspired by Polymer's async() function.
	 */
	
	// The queue of pending callbacks to be executed as microtasks.
	var callbacks = [];
	
	// Create an element that we will modify to force observable mutations.
	var element = document.createTextNode('');
	
	// A monotonically-increasing value.
	var counter = 0;
	
	/**
	 * Add a callback to the microtask queue.
	 *
	 * This uses a MutationObserver so that it works on IE 11.
	 *
	 * NOTE: IE 11 may actually use timeout timing with MutationObservers. This
	 * needs more investigation.
	 *
	 * @function microtask
	 * @param {function} callback
	 */
	function microtask(callback) {
	  callbacks.push(callback);
	  // Force a mutation.
	  element.textContent = ++counter;
	}
	
	// Execute any pending callbacks.
	function executeCallbacks() {
	  while (callbacks.length > 0) {
	    var callback = callbacks.shift();
	    callback();
	  }
	}
	
	// Create the observer.
	var observer = new MutationObserver(executeCallbacks);
	observer.observe(element, {
	  characterData: true
	});

/***/ },
/* 3 */
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
	
	var _symbols = __webpack_require__(4);
	
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Symbol2 = __webpack_require__(5);
	
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
/* 5 */
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	exports.default = ShadowTemplateMixin;
	
	var _symbols = __webpack_require__(4);
	
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
	          console.warn('ShadowTemplateMixin expects a component to define a template property with [symbols.template].');
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };
	
	exports.default = SingleSelectionMixin;
	
	var _Symbol2 = __webpack_require__(5);
	
	var _Symbol3 = _interopRequireDefault(_Symbol2);
	
	var _symbols = __webpack_require__(4);
	
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

/***/ }
/******/ ]);
//# sourceMappingURL=elix-mixins.js.map