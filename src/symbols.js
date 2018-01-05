import Symbol from './Symbol.js';


/**
 * A collection of (potentially polyfilled) `Symbol` objects for standard
 * component properties and methods.
 *
 * These `Symbol` objects are used to allow mixins and a component to internally
 * communicate, without exposing these properties and methods in the component's
 * public API.
 *
 * To use these `Symbol` objects in your own component, include this module and
 * then create a property or method whose key is the desired Symbol.
 *
 *     import SingleSelectionMixin from 'elix/mixins/SingleSelectionMixin.js';
 *     import 'symbols' from 'elix/mixins/symbols.js';
 *
 *     class MyElement extends SingleSelectionMixin(HTMLElement) {
 *       [symbols.itemSelected](item, selected) {
 *         // This will be invoked whenever an item is selected/deselected.
 *       }
 *     }
 *
 * To support Internet Explorer 11, which does not have support for the
 * `Symbol` class, you can use the [Symbol](Symbol) helper, or a `Symbol`
 * polyfill of your choice.
 *
 * @module symbols
 */
const symbols = {

  /**
   * Symbol for the 'canGoLeft' property.
   * 
   * A component can implement this property to indicate that the user is
   * currently able to move to the left.
   * 
   * @var {boolean} canGoLeft
   */
  canGoLeft: Symbol('canGoLeft'),

  /**
   * Symbol for the 'canGoRight' property.
   * 
   * A component can implement this property to indicate that the user is
   * currently able to move to the right.
   * 
   * @var {boolean} canGoRight
   */
  canGoRight: Symbol('canGoRight'),

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
  defaults: Symbol('defaults'),

  /**
   * Symbol for the `elementsWithTransitions` property.
   * 
   * A component can implement this method to indicate which element(s) have CSS
   * transitions that will be triggered if the given effect is shown.
   * 
   * @param {string} effect - The effect under consideration
   * @returns {HTMLElement[]} The elements with CSS transitions
   */
  elementsWithTransitions: Symbol('elementsWithTransitions'),

  /**
   * Symbol for the `getItemText` method.
   *
   * This method can be applied to an item to return its text.
   *
   * @function getItemText
   * @param {HTMLElement} item - the item to extract text from
   * @returns {string} the text of the item
   */
  getItemText: Symbol('getText'),

  /**
   * Symbol for the `goDown` method.
   *
   * This method is invoked when the user wants to go/navigate down.
   *
   * @function goDown
   */
  goDown: Symbol('goDown'),

  /**
   * Symbol for the `goEnd` method.
   *
   * This method is invoked when the user wants to go/navigate to the end (e.g.,
   * of a list).
   *
   * @function goEnd
   */
  goEnd: Symbol('goEnd'),

  /**
   * Symbol for the `goLeft` method.
   *
   * This method is invoked when the user wants to go/navigate left.
   *
   * @function goLeft
   */
  goLeft: Symbol('goLeft'),

  /**
   * Symbol for the `goRight` method.
   *
   * This method is invoked when the user wants to go/navigate right.
   *
   * @function goRight
   */
  goRight: Symbol('goRight'),

  /**
   * Symbol for the `goStart` method.
   *
   * This method is invoked when the user wants to go/navigate to the start
   * (e.g., of a list).
   *
   * @function goStart
   */
  goStart: Symbol('goStart'),

  /**
   * Symbol for the `goUp` method.
   *
   * This method is invoked when the user wants to go/navigate up.
   *
   * @function goUp
   */
  goUp: Symbol('goUp'),

  /**
   * Symbol for the `keydown` method.
   *
   * This method is invoked when an element receives a `keydown` event.
   *
   * An implementation of `symbols.keydown` should return `true` if it handled
   * the event, and `false` otherwise. If `true` is returned (the event was
   * handled), `KeyboardMixin` invokes the event's `preventDefault` and
   * `stopPropagation` methods to let the browser know the event was handled.
   * 
   * The convention for handling `symbols.keydown` is that the last mixin
   * applied wins. That is, if an implementation of `symbols.keydown` *did*
   * handle the event, it can return immediately. If it did not, it should
   * invoke `super` to let implementations further up the prototype chain have
   * their chance.
   *
   * @function keydown
   * @param {KeyboardEvent} event - the event being processed
   */
  keydown: Symbol('keydown'),

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
  raiseChangeEvents: Symbol('raiseChangeEvents'),

  // TODO: Document
  render: Symbol('render'),
  
  // TODO: Document
  rendering: Symbol('rendering'),

  /**
   * Symbol for the `scrollTarget` property.
   *
   * This property indicates which element in a component's shadow subtree
   * should be scrolled. [SelectionInViewMixin](SelectionInViewMixin) can use
   * this property to determine which element should be scrolled to keep the
   * selected item in view.
   * 
   * @var {HTMLElement} scrollTarget
   */
  scrollTarget: Symbol('scrollTarget'),

  /**
   * Symbol for the `template` method.
   *
   * This method should return a component's template.
   */
  template: Symbol('template')
};

export default symbols;
