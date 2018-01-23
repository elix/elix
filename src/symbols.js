import Symbol from './Symbol.js';


const canGoLeft = Symbol('canGoLeft');
const canGoRight = Symbol('canGoRight');
const contentSlot = Symbol('contentSlot');
const elementsWithTransitions = Symbol('elementsWithTransitions');
const getItemText = Symbol('getText');
const goDown = Symbol('goDown');
const goEnd = Symbol('goEnd');
const goLeft = Symbol('goLeft');
const goRight = Symbol('goRight');
const goStart = Symbol('goStart');
const goUp = Symbol('goUp');
const keydown = Symbol('keydown');
const mouseenter = Symbol('mouseenter');
const mouseleave = Symbol('mouseleave');
const raiseChangeEvents = Symbol('raiseChangeEvents');
const render = Symbol('render');
const rendering = Symbol('rendering');
const rightToLeft = Symbol('rightToLeft');
const scrollTarget = Symbol('scrollTarget');
const startEffect = Symbol('startEffect');
const swipeLeft = Symbol('swipeLeft');
const swipeRight = Symbol('swipeRight');
const swipeTarget = Symbol('swipeTarget');
const template = Symbol('template');


/**
 * A collection of `Symbol` objects for standard component properties and
 * methods. These let mixins and a component internally communicate without
 * exposing these properties and methods in the component's public API. They
 * also help avoid unintentional name collisions, as a component developer must
 * specifically import the `symbols` module and reference one of its symbols.
 *
 * To use these `Symbol` objects in your own component, include this module and
 * then create a property or method whose key is the desired Symbol. E.g.,
 * [ShadowTemplateMixin](ShadowTemplateMixin) expects a component to define
 * a property called [symbol.template](#template):
 *
 *     import ShadowTemplateMixin from 'elix/src/ShadowTemplateMixin.js';
 *     import 'symbols' from 'elix/src/symbols.js';
 * 
 *     class MyElement extends ShadowTemplateMixin(HTMLElement) {
 *       [symbols.template]() {
 *         return `Hello, <em>world</em>.`;
 *       }
 *     }
 * 
 * The above use of `symbols.template` lets the mixin find the component's
 * template in a way that will not pollute the component's public API or
 * interfere with other component logic. For example, if for some reason the
 * component wants to define a separate property with the plain string name,
 * "template", it can do so without affecting the above property setter.
 * 
 * While this project generally uses `Symbol` objects to hide component
 * internals, Elix does make some exceptions for methods or properties that are
 * very helpful to have handy during debugging. E.g.,
 * [ReactiveMixin](ReactiveMixin) exposes its [setState](ReactiveMixin#setState)
 * method publicly, even though invoking that method from outside a component is
 * generally bad practice. The mixin exposes `setState` because it's very useful
 * to have access to that in a debug console.
 *
 * @module symbols
 */
const symbols = {

  /**
   * Symbol for the `canGoLeft` property.
   * 
   * A component can implement this property to indicate that the user is
   * currently able to move to the left.
   * 
   * @var {boolean} canGoLeft
   */
  canGoLeft,

  /**
   * Symbol for the `canGoRight` property.
   * 
   * A component can implement this property to indicate that the user is
   * currently able to move to the right.
   * 
   * @var {boolean} canGoRight
   */
  canGoRight,

  /**
   * Symbol for the `contentSlot` property.
   * 
   * [SlotContentMixin](SlotContentMixin) uses this to identify which slot
   * element in the component's shadow tree that holds the component's content.
   * By default, this is the first slot element with no "name" attribute. You
   * can override this to return a different slot.
   * 
   * @var {HTMLSlotElement} contentSlot
   */
  contentSlot,

  /**
   * Symbol for the `elementsWithTransitions` property.
   * 
   * [TransitionEffectMixin](TransitionEffectMixin) inspects this property
   * to determine which element(s) have CSS
   * transitions applied to them for visual effects.
   * 
   * @param {string} effect - The effect under consideration
   * @returns {HTMLElement[]} The elements with CSS transitions
   */
  elementsWithTransitions,

  /**
   * Symbol for the `getItemText` method.
   *
   * This method can be applied to an item to return its text.
   *
   * @function getItemText
   * @param {HTMLElement} item - the item to extract text from
   * @returns {string} the text of the item
   */
  getItemText,

  /**
   * Symbol for the `goDown` method.
   *
   * This method is invoked when the user wants to go/navigate down.
   *
   * @function goDown
   */
  goDown,

  /**
   * Symbol for the `goEnd` method.
   *
   * This method is invoked when the user wants to go/navigate to the end (e.g.,
   * of a list).
   *
   * @function goEnd
   */
  goEnd,

  /**
   * Symbol for the `goLeft` method.
   *
   * This method is invoked when the user wants to go/navigate left. Mixins that
   * make use of this method include
   * [KeyboardDirectionMixin](KeyboardDirectionMixin) and
   * [SwipeDirectionMixin](SwipeDirectionMixin).
   *
   * @function goLeft
   */
  goLeft,

  /**
   * Symbol for the `goRight` method.
   *
   * This method is invoked when the user wants to go/navigate right. Mixins
   * that make use of this method include
   * [KeyboardDirectionMixin](KeyboardDirectionMixin) and
   * [SwipeDirectionMixin](SwipeDirectionMixin).
   *
   * @function goRight
   */
  goRight,

  /**
   * Symbol for the `goStart` method.
   *
   * This method is invoked when the user wants to go/navigate to the start
   * (e.g., of a list).
   *
   * @function goStart
   */
  goStart,

  /**
   * Symbol for the `goUp` method.
   *
   * This method is invoked when the user wants to go/navigate up.
   *
   * @function goUp
   */
  goUp,

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
  keydown,

  /**
   * Symbol for the `mouseenter` method.
   * 
   * [HoverMixin](HoverMixin) invokes this method when the user moves the
   * mouse over a component. That mixin provides a base implementation of this
   * method, but you can extend it to do additional work on `mouseenter`.
   * 
   * @function mouseenter
   * @param {MouseEvent} event
   */
  mouseenter,

  /**
   * Symbol for the `mouseleave` method.
   * 
   * [HoverMixin](HoverMixin) invokes this method when the user moves off a
   * component. That mixin provides a base implementation of this method, but
   * you can extend it to do additional work on `mouseleave`.
   * 
   * @function mouseleave
   * @param {MouseEvent} event
   */
  mouseleave,

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
  raiseChangeEvents,

  // TODO: Document
  /**
   * Symbol for an internal `render` method.
   * 
   * [ReactiveMixin](ReactiveMixin) has a public [render](ReactiveMixin#render)
   * method that can be invoked to force the component to render. That public
   * method internally invokes an `symbols.render` method, which a component can
   * implement to actually render itself.
   * 
   * You can implement a `symbols.render` method if necessary, but the most
   * common way for Elix components to render themselves is to use
   * [RenderUpdatesMixin](RenderUpdatesMixin),
   * [ShadowTemplateMixin](ShadowTemplateMixin), and/or
   * [ContentItemsMixin](ContentItemsMixin), all of which provide a
   * `symbols.render` method.
   * 
   * @function render
   */
  render,
  
  /**
   * Symbol for the `rendering` property.
   * 
   * [ReactiveMixin](ReactiveMixin) sets this property to true during rendering,
   * at other times it will be false.
   * 
   * @var {boolean} rendering
   */
  rendering,

  /**
   * Symbol for the `rightToLeft` property.
   * 
   * [LanguageDirectionMixin](LanguageDirectionMixin) sets this to true if the
   * if the element is rendered right-to-left (the element has or inherits a
   * `dir` attribute with the value `rtl`).
   * 
   * This property wraps the internal state member `state.languageDirection`,
   * and is true if that member equals the string "rtl".
   * 
   * @var {boolean} rightToLeft
   */
  rightToLeft,

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
  scrollTarget,

  /**
   * Symbol for the `startEffect` method.
   * 
   * A component using [TransitionEffectMixin](TransitionEffectMixin) can invoke
   * this method to trigger the application of a named, asynchronous CSS
   * transition effect.
   * 
   * @function startEffect
   * @param {string} effect - the name of the effect to start
   */
  startEffect,

  /**
   * Symbol for the `swipeLeft` method.
   * 
   * The swipe mixins [TouchSwipeMixin](TouchSwipeMixin) and
   * [TrackpadSwipeMixin](TrackpadSwipeMixin) invoke this method when the user
   * finishes a gesture to swipe left.
   * 
   * @function swipeLeft
   */
  swipeLeft,

  /**
   * Symbol for the `swipeLeft` method.
   * 
   * The swipe mixins [TouchSwipeMixin](TouchSwipeMixin) and
   * [TrackpadSwipeMixin](TrackpadSwipeMixin) invoke this method when the user
   * finishes a gesture to swipe left.
   * 
   * @function swipeRight
   */
  swipeRight,

  /**
   * Symbol for the `swipeTarget` property.
   * 
   * By default, the swipe mixins [TouchSwipeMixin](TouchSwipeMixin) and
   * [TrackpadSwipeMixin](TrackpadSwipeMixin) assume that the element the user
   * is swiping the top-level element. In some cases (e.g., [Drawer](Drawer)),
   * the component wants to let the user swipe a shadow element. In such cases,
   * this property should return the element that should be swiped.
   * 
   * The swipe target's `offsetWidth` is used by the mixin to calculate the
   * `state.swipeFraction` member when the user drags their finger. The
   * `swipeFraction` is the distance the user has dragged in the current drag
   * operation over that `offsetWidth`.
   * 
   * @var {HTMLElement} swipeTarget
   */
  swipeTarget,

  /**
   * Symbol for the `template` method.
   *
   * This method should return a component's template.
   */
  template

};

export default symbols;
