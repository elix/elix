/**
 * Collection of shared Symbol objects for internal component communication.
 *
 * The shared `Symbol` objects in this module let mixins and a component
 * internally communicate without exposing these internal properties and methods
 * in the component's public API. They also help avoid unintentional name
 * collisions, as a component developer must specifically import the `internal`
 * module and reference one of its symbols.
 *
 * To use these `Symbol` objects in your own component, include this module and
 * then create a property or method whose key is the desired Symbol. E.g.,
 * [ShadowTemplateMixin](ShadowTemplateMixin) expects a component to define
 * a property called [internal.template](#template):
 *
 *     import * as internal from 'elix/src/internal.js';
 *     import * as template from 'elix/src/template.js'
 *     import ShadowTemplateMixin from 'elix/src/ShadowTemplateMixin.js';
 *
 *     class MyElement extends ShadowTemplateMixin(HTMLElement) {
 *       [internal.template]() {
 *         return template.html`Hello, <em>world</em>.`;
 *       }
 *     }
 *
 * The above use of `internal.template` lets the mixin find the component's
 * template in a way that will not pollute the component's public API or
 * interfere with other component logic. For example, if for some reason the
 * component wants to define a separate property with the plain string name,
 * "template", it can do so without affecting the above property setter.
 *
 * @module internal
 */

/**
 * Symbol for the `checkSize` method.
 *
 * If defined, this method will be invoked by [ResizeMixin](ResizeMixin)
 * when an element's size may have changed. The default implementation of
 * this method compares the element's current `clientHeight` and `clientWidth`
 * properties against the last known values of those properties (saved in
 * `state.clienHeight` and `state.clientWidth`).
 *
 * Components should override this method if they contain elements that may need
 * to know about size changes as well. For example, when an [Overlay](Overlay)
 * mixin opens, it invokes this method on any content elements that define it.
 * This gives the contents a chance to resize in response to being displayed.
 */
export const checkSize = Symbol('checkSize');

/**
 * Symbol for the `componentDidMount` method.
 *
 * A component using [ReactiveMixin](ReactiveMixin) will have this method
 * invoked the first time the component is rendered in the DOM.
 *
 * @function componentDidMount
 */
export const componentDidMount = Symbol('componentDidMount');

/**
 * Symbol for the `componentDidUpdate` method.
 *
 * A component using [ReactiveMixin](ReactiveMixin) will have this method
 * invoked a component already in the DOM has finished a subsequent render
 * operation.
 *
 * @function componentDidUpdate
 */
export const componentDidUpdate = Symbol('componentDidUpdate');

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
 * Symbol for the `defaultTabIndex` property.
 *
 * [KeyboardMixin](KeyboardMixin) uses this if it is unable to successfully
 * parse a string tabindex attribute.
 */
export const defaultTabIndex = Symbol('defaultTabIndex');

/**
 * The default state for this element.
 *
 * @var {State}
 */
export const defaultState = Symbol('defaultState');

/**
 * Symbol for the `delegatesFocus` property.
 *
 * [DelegatesFocusMixin](DelegatesFocusMixin) defines this property, returning
 * true to indicate that the focus is being delegated, even in browsers that
 * don't support that natively. Mixins like [KeyboardMixin](KeyboardMixin) use
 * this to accommodate focus delegation.
 */
export const delegatesFocus = Symbol('delegatesFocus');

/**
 * Symbol for the `effectEndTarget` property.
 *
 * [TransitionEffectMixin](TransitionEffectMixin) inspects this property to
 * determine which element's `transitionend` event will signal the end of a
 * transition effect.
 *
 * @returns {Element} The element with a CSS transition that ends the effect
 */
export const effectEndTarget = Symbol('effectEndTarget');

/**
 * Symbol for the `focusTarget` property.
 *
 * [DelegatesFocusMixin](DelegatesFocusMixin) defines this property as either:
 * 1) the element itself, in browsers that support native focus delegation or,
 * 2) the shadow root's first focusable element.
 */
export const focusTarget = Symbol('focusTarget');

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
 * Symbol for the `goNext` method.
 *
 * This method is invoked when the user wants to go/navigate to the next item.
 *
 * @function goNext
 */
export const goNext = Symbol('goNext');

/**
 * Symbol for the `goPrevious` method.
 *
 * This method is invoked when the user wants to go/navigate to the previous item.
 *
 * @function goPrevious
 */
export const goPrevious = Symbol('goPrevious');

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
 * Symbol for the `ids` property.
 *
 * [ShadowTemplateMixin](ShadowTemplateMixin) defines a shorthand function
 * `internal.ids` that can be used to obtain a reference to a shadow element with
 * a given ID.
 *
 * Example: if component's template contains a shadow element
 * `<button id="foo">`, you can use the reference `this[internal.ids].foo` to obtain
 * the corresponding button in the component instance's shadow tree.
 * The `ids` function is simply a shorthand for `getElementById`, so
 * `this[internal.ids].foo` is the same as `this.shadowRoot.getElementById('foo')`.
 *
 * @type {object} - a dictionary mapping shadow element IDs to elements
 */
export const ids = Symbol('ids');

/**
 * Symbol for the `itemMatchesState` method.
 *
 * `ContentItemsMixin` uses this callback to determine whether a content node
 * should be included in the `items` collection in the given state. By default,
 * substantive, visible elements are considered items; other nodes (including
 * text nodes, comment nodes, processing instructions) and invisible elements
 * (including `script` and `style` tags) are not considered to be items.
 *
 * Various mixins and components override this to refine the idea of what
 * counts as an item. E.g., [Menu](Menu) overrides this to exclude disabled
 * menu items, using code similar to this:
 *
 *     // Filter the set of items to ignore disabled items.
 *     [internal.itemMatchesState](item, state) {
 *       const base = super[internal.itemMatchesState] ?
 *         super[internal.itemMatchesState](item, state) :
 *         true;
 *       return base && !item.disabled;
 *     }
 *
 * @function itemMatchesState
 * @param {Node} item - the node that may or may not belong in the given state
 * @param {object} state - the state in question
 * @returns {boolean}
 */
export const itemMatchesState = Symbol('itemMatchesState');

/**
 * Symbol for the `itemsDelegate` property.
 *
 * A component using [DelegateItemsMixin](DelegateItemsMixin) uses this property
 * to indicate which one of its shadow elements is the one whose `items`
 * property will be treated as the component's own `items`.
 *
 * @var {Element} itemsDelegate
 */
export const itemsDelegate = Symbol('itemsDelegate');

/**
 * Symbol for the `keydown` method.
 *
 * This method is invoked when an element receives a `keydown` event.
 *
 * An implementation of `internal.keydown` should return `true` if it handled
 * the event, and `false` otherwise. If `true` is returned (the event was
 * handled), `KeyboardMixin` invokes the event's `preventDefault` and
 * `stopPropagation` methods to let the browser know the event was handled.
 *
 * The convention for handling `internal.keydown` is that the last mixin
 * applied wins. That is, if an implementation of `internal.keydown` *did*
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
 * Symbol for access to native HTML element internals.
 * 
 // @ts-ignore
 * @type {ElementInternals}
 */
export const nativeInternals = Symbol('nativeInternals');

/**
 * Symbol for the `populate` method.
 *
 * [PopulateUpdateMixin](PopulateUpdateMixin) invokes this method as the first
 * of two rendering phases. In this phase, the component can manipulate the
 * Shadow DOM tree to ensure the correct elements are present.
 *
 * @function populate
 */
export const populate = Symbol('populate');

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
 *       this[internal.raiseChangeEvents] = true;
 *       // Do work here, possibly setting properties, like:
 *       this.foo = 'Hello';
 *       this[internal.raiseChangeEvents] = false;
 *     });
 *
 * Elsewhere, property setters that raise change events should only do so it
 * this property is `true`:
 *
 *     set foo(value) {
 *       // Save foo value here, do any other work.
 *       if (this[internal.raiseChangeEvents]) {
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
 * Symbol for the `render` method.
 *
 * [ReactiveMixin](ReactiveMixin) invokes this `internal.render` method to give
 * the component a chance to render recent changes in component state.
 *
 * @function render
 */
export const render = Symbol('render');

/**
 * Symbol for the `renderChanges` method.
 *
 * [ReactiveMixin](ReactiveMixin) invokes this method in response to a
 * `setState` call; you should generally not invoke this method yourself.
 *
 * @function renderChanges
 */
export const renderChanges = Symbol('renderChanges');

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
 * Symbol for the `setState` method.
 *
 * A component using [ReactiveMixin](ReactiveMixin) can invoke this method to
 * apply changes to the element's current state.
 *
 * @function setState
 */
export const setState = Symbol('setState');

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
 * The element's current state.
 *
 * This is managed by [ReactiveMixin](ReactiveMixin).
 *
 * @var {State}
 */
export const state = Symbol('state');

/**
 * Symbol for the `swipeDown` method.
 *
 * The swipe mixin [TouchSwipeMixin](TouchSwipeMixin) invokes this method when
 * the user finishes a gesture to swipe down.
 *
 * @function swipeDown
 */
export const swipeDown = Symbol('swipeDown');

/**
 * Symbol for the `swipeDownComplete` method.
 *
 * [SwipeCommandsMixin](SwipeCommandsMixin) invokes this method after any
 * animated transition associated with a swipe down has completed.
 *
 * @function swipeDownComplete
 */
export const swipeDownComplete = Symbol('swipeDownComplete');

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
 * Symbol for the `swipeLeftTransitionEnd` method.
 *
 * [SwipeCommandsMixin](SwipeCommandsMixin) invokes this method after any
 * animated transition associated with a swipe left has completed.
 *
 * @function swipeLeftTransitionEnd
 */
export const swipeLeftTransitionEnd = Symbol('swipeLeftTransitionEnd');

/**
 * Symbol for the `swipeRight` method.
 *
 * The swipe mixins [TouchSwipeMixin](TouchSwipeMixin) and
 * [TrackpadSwipeMixin](TrackpadSwipeMixin) invoke this method when the user
 * finishes a gesture to swipe right.
 *
 * @function swipeRight
 */
export const swipeRight = Symbol('swipeRight');

/**
 * Symbol for the `swipeRightTransitionEnd` method.
 *
 * [SwipeCommandsMixin](SwipeCommandsMixin) invokes this method after any
 * animated transition associated with a swipe right has completed.
 *
 * @function swipeRightTransitionEnd
 */
export const swipeRightTransitionEnd = Symbol('swipeRightTransitionEnd');

/**
 * Symbol for the `swipeUp` method.
 *
 * The swipe mixin [TouchSwipeMixin](TouchSwipeMixin) invokes this method when
 * the user finishes a gesture to swipe up.
 *
 * @function swipeUp
 */
export const swipeUp = Symbol('swipeUp');

/**
 * Symbol for the `swipeUpComplete` method.
 *
 * [SwipeCommandsMixin](SwipeCommandsMixin) invokes this method after any
 * animated transition associated with a swipe up has completed.
 *
 * @function swipeUpComplete
 */
export const swipeUpComplete = Symbol('swipeUpComplete');

/**
 * Symbol for the `swipeStart` method.
 *
 * [TouchSwipeMixin](TouchSwipeMixin) and
 * [TrackpadSwipeMixin](TrackpadSwipeMixin) invoke this method when a swipe
 * is starting, passing in the starting (x, y) client coordinate.
 *
 * @function swipeStart
 * @param {number} clientX
 * @param {number} clientY
 */
export const swipeStart = Symbol('swipeStart');

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
 * Symbol for the `tap` method.
 *
 * This method is invoked when an element receives an operation that should
 * be interpreted as a tap. [TapSelectionMixin](TapSelectionMixin)
 * invokes this when the element receives a `mousedown` event, for example.
 *
 * @function tap
 */
export const tap = Symbol('tap');

/**
 * Symbol for the `template` method.
 *
 * [ShadowTemplateMixin](ShadowTemplateMixin) uses this property to obtain a
 * component's template, which it will clone into a component's shadow root.
 *
 * @var {HTMLTemplateElement} template
 */
export const template = Symbol('template');

/**
 * Symbol for the `update` method.
 *
 * [PopulateUpdateMixin](PopulateUpdateMixin) invokes this method as the second
 * of two rendering phases. In this phase, the component can apply updates to
 * the top-level host element or its shadow elements to reflect the component's
 * current state.
 *
 * @function update
 */
export const update = Symbol('update');

// Expose internals as a global when debugging.
const elixdebug = new URLSearchParams(location.search).get('elixdebug');
if (elixdebug === 'true') {
  /** @type {any} */ (window).elix = {
    internal: {
      checkSize,
      componentDidMount,
      componentDidUpdate,
      contentSlot,
      defaultState,
      defaultTabIndex,
      delegatesFocus,
      effectEndTarget,
      event,
      focusTarget,
      getItemText,
      goDown,
      goEnd,
      goLeft,
      goNext,
      goPrevious,
      goRight,
      goStart,
      goUp,
      hasDynamicTemplate,
      ids,
      itemMatchesState,
      itemsDelegate,
      keydown,
      mouseenter,
      mouseleave,
      nativeInternals,
      populate,
      raiseChangeEvents,
      render,
      renderChanges,
      rendering,
      scrollTarget,
      setState,
      startEffect,
      state,
      swipeDown,
      swipeDownComplete,
      swipeLeft,
      swipeLeftTransitionEnd,
      swipeRight,
      swipeRightTransitionEnd,
      swipeStart,
      swipeTarget,
      swipeUp,
      swipeUpComplete,
      tap,
      template,
      update
    }
  };
}
