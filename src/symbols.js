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
 * a property called [symbols.template](#template):
 *
 *     import * as template from 'elix/src/template.js'
 *     import * as symbols from 'elix/src/symbols.js';
 *     import ShadowTemplateMixin from 'elix/src/ShadowTemplateMixin.js';
 * 
 *     class MyElement extends ShadowTemplateMixin(HTMLElement) {
 *       [symbols.template]() {
 *         return template.html`Hello, <em>world</em>.`;
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


/**
 * Symbol for the `canGoLeft` property.
 * 
 * A component can implement this property to indicate that the user is
 * currently able to move to the left.
 * 
 * @var {boolean} canGoLeft
 */
export const canGoLeft = Symbol('canGoLeft');

/**
 * Symbol for the `canGoRight` property.
 * 
 * A component can implement this property to indicate that the user is
 * currently able to move to the right.
 * 
 * @var {boolean} canGoRight
 */
export const canGoRight = Symbol('canGoRight');

/**
 * Symbol for the `click` method.
 *
 * This method is invoked when an element receives an operation that should
 * be interpreted as a click. [ClickSelectionMixin](ClickSelectionMixin)
 * invokes this when the element receives a `mousedown` event, for example.
 *
 * @function click
 */
export const click = Symbol('click');

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
export const contentSlot = Symbol('contentSlot');

/**
 * Symbol for the `defaultFocus` property.
 * 
 * This is used by the [defaultFocus](utilities#defaultFocus) utility to
 * determine the default focus target for an element.
 */
export const defaultFocus = Symbol('defaultFocus');

/**
 * Symbol for the `descriptors` property.
 * 
 * A descriptor is a named role in an element's template that can be filled by
 * an element tag (e.g., "div"), a custom element class constructor (e.g.,
 * [SeamlessButton](SeamlessButton)), or a document fragment.
 * 
 * The `descriptors` property is a dictionary mapping a role name to the
 * corresponding descriptor that should be instantiated to fill that role.
 */
export const descriptors = Symbol('descriptors');

/**
 * Symbol for the `elementsWithTransitions` property.
 * 
 * [TransitionEffectMixin](TransitionEffectMixin) inspects this property
 * to determine which element(s) have CSS
 * transitions applied to them for visual effects.
 * 
 * @returns {Element[]} The elements with CSS transitions
 */
export const elementsWithTransitions = Symbol('elementsWithTransitions');

/**
 * Symbol for the `getItemText` method.
 *
 * This method can be applied to an item to return its text.
 * [KeyboardPrefixSelectionMixin](KeyboardPrefixSelectionMixin) uses this to
 * obtain the text for each item in a list, then matches keypresses again that
 * text.
 * 
 * This method takes a single parameter: the `HTMLElement` of the item from
 * which text should be extracted.
 *
 * @function getItemText
 * @returns {string} the text of the item
 */
export const getItemText = Symbol('getItemText');

/**
 * Symbol for the `goDown` method.
 *
 * This method is invoked when the user wants to go/navigate down.
 *
 * @function goDown
 */
export const goDown = Symbol('goDown');

/**
 * Symbol for the `goEnd` method.
 *
 * This method is invoked when the user wants to go/navigate to the end (e.g.,
 * of a list).
 *
 * @function goEnd
 */
export const goEnd = Symbol('goEnd');

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
export const goLeft = Symbol('goLeft');

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
export const goRight = Symbol('goRight');

/**
 * Symbol for the `goStart` method.
 *
 * This method is invoked when the user wants to go/navigate to the start
 * (e.g., of a list).
 *
 * @function goStart
 */
export const goStart = Symbol('goStart');

/**
 * Symbol for the `goUp` method.
 *
 * This method is invoked when the user wants to go/navigate up.
 *
 * @function goUp
 */
export const goUp = Symbol('goUp');

/**
 * Symbol for the `hasDynamicTemplate` property.
 * 
 * If your component class does not always use the same template, define a
 * static class property getter with this symbol and have it return `true`.
 * This will disable template caching for your component.
 */
export const hasDynamicTemplate = Symbol('hasDynamicTemplate');

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
 * This method takes a `KeyboardEvent` parameter that contains the event being
 * processed.
 *
 * @function keydown
 */
export const keydown = Symbol('keydown');

/**
 * Symbol for the `mouseenter` method.
 * 
 * [HoverMixin](HoverMixin) invokes this method when the user moves the
 * mouse over a component. That mixin provides a base implementation of this
 * method, but you can extend it to do additional work on `mouseenter`.
 * 
 * This method takes a `MouseEvent` parameter that contains the event being
 * processed.
 *
 * @function mouseenter
 */
export const mouseenter = Symbol('mouseenter');

/**
 * Symbol for the `mouseleave` method.
 * 
 * [HoverMixin](HoverMixin) invokes this method when the user moves off a
 * component. That mixin provides a base implementation of this method, but
 * you can extend it to do additional work on `mouseleave`.
 * 
 * This method takes a `MouseEvent` parameter that contains the event being
 * processed.
 *
 * @function mouseleave
 */
export const mouseleave = Symbol('mouseleave');

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
 *         export const event = new CustomEvent('foo-changed');
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
export const raiseChangeEvents = Symbol('raiseChangeEvents');

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
export const render = Symbol('render');

/**
 * Symbol for the `rendering` property.
 * 
 * [ReactiveMixin](ReactiveMixin) sets this property to true during rendering,
 * at other times it will be false.
 * 
 * @var {boolean} rendering
 */
export const rendering = Symbol('rendering');

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
export const rightToLeft = Symbol('rightToLeft');

/**
 * Symbol for the `scrollTarget` property.
 *
 * This property indicates which element in a component's shadow subtree
 * should be scrolled. [SelectionInViewMixin](SelectionInViewMixin) can use
 * this property to determine which element should be scrolled to keep the
 * selected item in view.
 * 
 * @var {Element} scrollTarget
 */
export const scrollTarget = Symbol('scrollTarget');

/**
 * Symbol for the `startEffect` method.
 * 
 * A component using [TransitionEffectMixin](TransitionEffectMixin) can invoke
 * this method to trigger the application of a named, asynchronous CSS
 * transition effect.
 * 
 * This method takes a single `string` parameter giving the name of the effect
 * to start.
 * 
 * @function startEffect
 */
export const startEffect = Symbol('startEffect');

/**
 * Symbol for the `swipeLeft` method.
 * 
 * The swipe mixins [TouchSwipeMixin](TouchSwipeMixin) and
 * [TrackpadSwipeMixin](TrackpadSwipeMixin) invoke this method when the user
 * finishes a gesture to swipe left.
 * 
 * @function swipeLeft
 */
export const swipeLeft = Symbol('swipeLeft');

/**
 * Symbol for the `swipeLeft` method.
 * 
 * The swipe mixins [TouchSwipeMixin](TouchSwipeMixin) and
 * [TrackpadSwipeMixin](TrackpadSwipeMixin) invoke this method when the user
 * finishes a gesture to swipe left.
 * 
 * @function swipeRight
 */
export const swipeRight = Symbol('swipeRight');

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
export const swipeTarget = Symbol('swipeTarget');

/**
 * Symbol for the `template` method.
 *
 * [ShadowTemplateMixin](ShadowTemplateMixin) uses this property to obtain a
 * component's template, which it will clone into a component's shadow root.
 * 
 * @var {HTMLTemplateElement} template
 */
export const template = Symbol('template');
