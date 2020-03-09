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
 */

/**
 * Symbol for the `componentDidMount` method.
 *
 * A component using [ReactiveMixin](ReactiveMixin) will have this method
 * invoked the first time the component is rendered in the DOM.
 *
 * This method has been deprecated; use `rendered` instead.
 */
export const componentDidMount = Symbol("componentDidMount");

/**
 * Symbol for the `componentDidUpdate` method.
 *
 * A component using [ReactiveMixin](ReactiveMixin) will have this method
 * invoked a component already in the DOM has finished a subsequent render
 * operation.
 *
 * This method has been deprecated; use `rendered` instead.
 */
export const componentDidUpdate = Symbol("componentDidUpdate");

/**
 * Symbol for the default state for this element.
 */
export const defaultState = Symbol("defaultState");

/**
 * Symbol for the `delegatesFocus` property.
 *
 * [DelegatesFocusMixin](DelegatesFocusMixin) defines this property, returning
 * true to indicate that the focus is being delegated, even in browsers that
 * don't support that natively. Mixins like [KeyboardMixin](KeyboardMixin) use
 * this to accommodate focus delegation.
 */
export const delegatesFocus = Symbol("delegatesFocus");

/**
 * Symbol for the `firstRender` property.
 *
 * [ReactiveMixin](ReactiveMixin) sets the property to `true` during the
 * element's first `render` and `rendered` callback, then `false` in subsequent
 * callbacks.
 *
 * You can inspect this property in your own `rendered` callback handler to do
 * work like wiring up events that should only happen once.
 */
export const firstRender = Symbol("firstRender");

/**
 * Symbol for the `focusTarget` property.
 *
 * [DelegatesFocusMixin](DelegatesFocusMixin) defines this property as either:
 * 1) the element itself, in browsers that support native focus delegation or,
 * 2) the shadow root's first focusable element.
 */
export const focusTarget = Symbol("focusTarget");

/**
 * Symbol for the `hasDynamicTemplate` property.
 *
 * If your component class does not always use the same template, define a
 * static class property getter with this symbol and have it return `true`.
 * This will disable template caching for your component.
 */
export const hasDynamicTemplate = Symbol("hasDynamicTemplate");

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
 */
export const ids = Symbol("ids");

/**
 * Symbol for access to native HTML element internals.
 */
export const nativeInternals = Symbol("nativeInternals");

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
 */
export const raiseChangeEvents = Symbol("raiseChangeEvents");

/**
 * Symbol for the `render` method.
 *
 * [ReactiveMixin](ReactiveMixin) invokes this `internal.render` method to give
 * the component a chance to render recent changes in component state.
 */
export const render = Symbol("render");

/**
 * Symbol for the `renderChanges` method.
 *
 * [ReactiveMixin](ReactiveMixin) invokes this method in response to a
 * `setState` call; you should generally not invoke this method yourself.
 */
export const renderChanges = Symbol("renderChanges");

/**
 * Symbol for the `rendered` method.
 *
 * [ReactiveMixin](ReactiveMixin) will invoke this method after your
 * element has completely finished rendering.
 *
 * If you only want to do work the first time rendering happens (for example, if
 * you want to wire up event handlers), your `internal.rendered` implementation
 * can inspect the `internal.firstRender` flag.
 */
export const rendered = Symbol("rendered");

/**
 * Symbol for the `rendering` property.
 *
 * [ReactiveMixin](ReactiveMixin) sets this property to true during rendering,
 * at other times it will be false.
 */
export const rendering = Symbol("rendering");

/**
 * Symbol for the `setState` method.
 *
 * A component using [ReactiveMixin](ReactiveMixin) can invoke this method to
 * apply changes to the element's current state.
 */
export const setState = Symbol("setState");

/**
 * Symbol for the `shadowRoot` property.
 *
 * This property holds a reference to an element's shadow root, like
 * `this.shadowRoot`. This propery exists because `this.shadowRoot` is not
 * available for components with closed shadow roots.
 * [ShadowTemplateMixin](ShadowTemplateMixin) creates open shadow roots by
 * default, but you can opt into creating closed shadow roots; see
 * [shadowRootMode](internal#internal.shadowRootMode).
 */
export const shadowRoot = Symbol("shadowRoot");

/**
 * Symbol for the `shadowRootMode` property.
 *
 * If true (the default), then [ShadowTemplateMixin](ShadowTemplateMixin) will
 * create an open shadow root when the component is instantiated. Set this to
 * false if you want to programmatically hide component internals in a closed
 * shadow root.
 */
export const shadowRootMode = Symbol("shadowRootMode");

/**
 * Symbol for the element's current state.
 *
 * This is managed by [ReactiveMixin](ReactiveMixin).
 */
export const state = Symbol("state");

/**
 * Symbol for the `stateEffects` method.
 *
 * See [stateEffects](ReactiveMixin#stateEffects).
 */
export const stateEffects = Symbol("stateEffects");

/**
 * Symbol for the `template` method.
 *
 * [ShadowTemplateMixin](ShadowTemplateMixin) uses this property to obtain a
 * component's template, which it will clone into a component's shadow root.
 */
export const template = Symbol("template");
