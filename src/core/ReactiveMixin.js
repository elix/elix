import {
  defaultState,
  firstRender,
  raiseChangeEvents,
  render,
  renderChanges,
  rendered,
  rendering,
  setState,
  state,
  stateEffects,
} from "./internal.js";

/** @type {any} */
const stateKey = Symbol("state");
/** @type {any} */
const raiseChangeEventsInNextRenderKey = Symbol(
  "raiseChangeEventsInNextRender"
);
// Tracks total set of changes made to elements since their last render.
/** @type {any} */
const changedSinceLastRenderKey = Symbol("changedSinceLastRender");

/**
 * Manages component state and renders changes in state
 *
 * This is modeled after React/Preact's state management, and is adapted for
 * use with web components. Applying this mixin to a component will give it
 * FRP behavior comparable to React's.
 *
 * This model is very basic. It's key aspects are:
 * * an immutable `state` property updated via `setState` calls.
 * * a `render` method that will be invoked asynchronously when state changes.
 *
 * @module ReactiveMixin
 * @param {Constructor<CustomElement>} Base
 */
export default function ReactiveMixin(Base) {
  class Reactive extends Base {
    constructor() {
      super();

      // Components can inspect `firstRender` during rendering to do special
      // work the first time (like wire up event handlers). Until the first
      // render actually happens, we set that flag to be undefined so we have a
      // way of distinguishing between a component that has never rendered and
      // one that is being rendered for the nth time.
      this[firstRender] = undefined;

      // We want to support the standard HTML pattern of only raising events in
      // response to direct user interactions. For a detailed discussion of this
      // point, see the Gold Standard checklist item for [Propery Change
      // Events](https://github.com/webcomponents/gold-standard/wiki/Property%20Change%20Events).
      //
      // To support this pattern, we define a flag indicating whether change
      // events should be raised. By default, we want the flag to be false. In
      // UI event handlers, a component can temporarily set the flag to true. If
      // a setState call is made while the flag is true, then that fact will be
      // remembered and passed the subsequent render/rendered methods. That will
      // let the methods know whether they should raise property change events.
      this[raiseChangeEvents] = false;

      // Maintain a change log of all fields which have changed since the
      // component was last rendered.
      this[changedSinceLastRenderKey] = null;

      // Set the initial state from the default state defined by the component
      // and its mixins/base classes.
      this[setState](this[defaultState]);
    }

    // When the component is attached to the document (or upgraded), we will
    // generally render the component for the first time. That operation will
    // include rendering of the default state and any state changes that
    // happened between constructor time and this connectedCallback.
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      // Render the component.
      //
      // If the component was forced to render before this point, and the state
      // hasn't changed, this call will be a no-op.
      this[renderChanges]();
    }

    /**
     * The default state for the component. This can be extended by mixins and
     * classes to provide additional default state.
     *
     * @type {PlainObject}
     */
    // @ts-ignore
    get [defaultState]() {
      // Defer to base implementation if defined.
      return super[defaultState] || {};
    }

    /**
     * Render the indicated changes in state to the DOM.
     *
     * The default implementation of this method does nothing. Override this
     * method in your component to update your component's host element and
     * any shadow elements to reflect the component's new state. See the
     * [rendering example](ReactiveMixin#rendering).
     *
     * Be sure to call `super` in your method implementation so that your
     * component's base classes and mixins have a chance to perform their own
     * render work.
     *
     * @param {ChangedFlags} changed - dictionary of flags indicating which state
     * members have changed since the last render
     */
    [render](changed) {
      if (super[render]) {
        super[render](changed);
      }
    }

    /**
     * Render any pending component changes to the DOM.
     *
     * This method does nothing if the state has not changed since the last
     * render call.
     *
     * ReactiveMixin will invoke this method following a `setState` call;
     * you should not need to invoke this method yourself.
     *
     * This method invokes the internal `render` method, then invokes the
     * `rendered` method.
     */
    [renderChanges]() {
      if (this[firstRender] === undefined) {
        // First render.
        this[firstRender] = true;
      }

      // Get the log of which fields have changed since the last render.
      const changed = this[changedSinceLastRenderKey];

      // We only render if this is the first render, or state has changed since
      // the last render.
      if (this[firstRender] || changed) {
        // If at least one of the[setState] calls was made in response
        // to user interaction or some other component-internal event, set the
        // raiseChangeEvents flag so that render/rendered methods know whether
        // to raise property change events. See the comments in the component
        // constructor where we initialize this flag for details.
        const saveRaiseChangeEvents = this[raiseChangeEvents];
        this[raiseChangeEvents] = this[raiseChangeEventsInNextRenderKey];

        // We set a flag to indicate that rendering is happening. The component
        // may use this to avoid triggering other updates during the render.
        this[rendering] = true;

        // Invoke any internal render implementations.
        this[render](changed);

        this[rendering] = false;

        // Since we've now rendered all changes, clear the change log. If other
        // async render calls are queued up behind this call, they'll see an
        // empty change log, and so skip unnecessary render work.
        this[changedSinceLastRenderKey] = null;

        // Let the component know it was rendered.
        this[rendered](changed);

        // We've now rendered for the first time.
        this[firstRender] = false;

        // Restore state of event flags.
        this[raiseChangeEvents] = saveRaiseChangeEvents;
        this[raiseChangeEventsInNextRenderKey] = saveRaiseChangeEvents;
      }
    }

    /**
     * Perform any work that must happen after state changes have been rendered
     * to the DOM.
     *
     * The default implementation of this method does nothing. Override this
     * method in your component to perform work that requires the component to
     * be fully rendered, such as setting focus on a shadow element or
     * inspecting the computed style of an element. If such work should result
     * in a change in component state, you can safely call `setState` during the
     * `rendered` method.
     *
     * Be sure to call `super` in your method implementation so that your
     * component's base classes and mixins have a chance to perform their own
     * post-render work.
     *
     * @param {ChangedFlags} changed
     */
    [rendered](changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }
    }

    /**
     * Update the component's state by merging the specified changes on
     * top of the existing state. If the component is connected to the document,
     * and the new state has changed, this returns a promise to asynchronously
     * render the component. Otherwise, this returns a resolved promise.
     *
     * @param {PlainObject} changes - the changes to apply to the element's state
     * @returns {Promise} - resolves when the new state has been rendered
     */
    async [setState](changes) {
      // There's no good reason to have a render method update state.
      if (this[rendering]) {
        /* eslint-disable no-console */
        console.warn(
          `${this.constructor.name} called [setState] during rendering, which you should avoid.\nSee https://elix.org/documentation/ReactiveMixin.`
        );
      }

      // Apply the changes to a copy of the component's current state to produce
      // a new, updated state and a dictionary of flags indicating which fields
      // actually changed.
      const { state, changed } = copyStateWithChanges(this, changes);

      // We only need to apply the changes to the component state if: a) the
      // current state is undefined (this is the first time setState has been
      // called), or b) the supplied changes parameter actually contains
      // substantive changes.
      if (this[stateKey] && Object.keys(changed).length === 0) {
        // No need to update state.
        return;
      }

      // Freeze the new state so it's immutable. This prevents accidental
      // attempts to set state without going through setState.
      Object.freeze(state);

      // Set this as the component's new state.
      this[stateKey] = state;

      // If setState was called with the raiseChangeEvents flag set, record that
      // fact for use in rendering. See the comments in the component
      // constructor for details.
      if (this[raiseChangeEvents]) {
        this[raiseChangeEventsInNextRenderKey] = true;
      }

      // Look to see whether the component is already set up to render.
      const willRender =
        this[firstRender] === undefined ||
        this[changedSinceLastRenderKey] !== null;

      // Add this round of changed fields to the complete log of fields that
      // have changed since the component was last rendered.
      this[changedSinceLastRenderKey] = Object.assign(
        this[changedSinceLastRenderKey] || {},
        changed
      );

      // We only need to queue a render if we're in the document and a render
      // operation hasn't already been queued for this component. If we're not
      // in the document yet, when the component is eventually added to the
      // document, the connectedCallback will ensure we render at that point.
      const needsRender = this.isConnected && !willRender;
      if (needsRender) {
        // Yield with promise timing. This lets any *synchronous* setState calls
        // that happen after this current setState call complete first. Their
        // effects on the state will be batched up, and accumulate in the change
        // log stored under this[changedSinceLastRenderKey].
        await Promise.resolve();

        // Now that the above promise has resolved, render the component. By the
        // time this line is reached, the complete log of batched changes can be
        // applied in a single render call.
        this[renderChanges]();
      }
    }

    /**
     * The component's current state.
     *
     * The returned state object is immutable. To update it, invoke
     * `internal.setState`.
     *
     * It's extremely useful to be able to inspect component state while
     * debugging. If you append `?elixdebug=true` to a page's URL, then
     * ReactiveMixin will conditionally expose a public `state` property that
     * returns the component's state. You can then access the state in your
     * browser's debug console.
     *
     * @type {PlainObject}
     */
    get [state]() {
      return this[stateKey];
    }

    /**
     * Ask the component whether a state with a set of recently-changed fields
     * implies that additional second-order changes should be applied to that
     * state to make it consistent.
     *
     * This method is invoked during a call to `internal.setState` to give all
     * of a component's mixins and classes a chance to respond to changes in
     * state. If one mixin/class updates state that it controls, another
     * mixin/class may want to respond by updating some other state member that
     * *it* controls.
     *
     * This method should return a dictionary of changes that should be applied
     * to the state. If the dictionary object is not empty, the
     * `internal.setState` method will apply the changes to the state, and
     * invoke this `stateEffects` method again to determine whether there are
     * any third-order effects that should be applied. This process repeats
     * until all mixins/classes report that they have no additional changes to
     * make.
     *
     * See an example of how `ReactiveMixin` invokes the `stateEffects` to
     * [ensure state consistency](ReactiveMixin#ensuring-state-consistency).
     *
     * @param {PlainObject} state - a proposal for a new state
     * @param {ChangedFlags} changed - the set of fields changed in this
     * latest proposal for the new state
     * @returns {PlainObject}
     */
    [stateEffects](state, changed) {
      return super[stateEffects] ? super[stateEffects](state, changed) : {};
    }
  }

  // Expose state when debugging; see note for `[state]` getter.
  const elixdebug = new URLSearchParams(location.search).get("elixdebug");
  if (elixdebug === "true") {
    Object.defineProperty(Reactive.prototype, "state", {
      get() {
        return this[state];
      },
    });
  }

  return Reactive;
}

/**
 * Create a copy of the component's state with the indicated changes applied.
 * Ask the component whether the new state implies any second-order effects. If
 * so, apply those and loop again until the state has stabilized. Return the new
 * state and a dictionary of flags indicating which fields were actually
 * changed.
 *
 * @private
 * @param {Element} element
 * @param {PlainObject} changes
 */
export function copyStateWithChanges(element, changes) {
  // Start with a copy of the current state.
  /** @type {PlainObject} */
  const state = Object.assign({}, element[stateKey]);
  /** @type {ChangedFlags} */
  const changed = {};
  // Take the supplied changes as the first round of effects.
  let effects = changes;
  // Loop until there are no effects to apply.
  /* eslint-disable no-constant-condition */
  while (true) {
    // See whether the effects actually changed anything in state.
    const changedByEffects = fieldsChanged(state, effects);
    if (Object.keys(changedByEffects).length === 0) {
      // No more effects to apply; we're done.
      break;
    }
    // Apply the effects.
    Object.assign(state, effects);
    Object.assign(changed, changedByEffects);
    // Ask the component if there are any second- (or third-, etc.) order
    // effects that should be applied.
    effects = element[stateEffects](state, changedByEffects);
  }
  return { state, changed };
}

/**
 * Return true if the two values are equal.
 *
 * @private
 * @param {any} value1
 * @param {any} value2
 * @returns {boolean}
 */
function equal(value1, value2) {
  if (value1 instanceof Date && value2 instanceof Date) {
    return value1.getTime() === value2.getTime();
  }
  return value1 === value2;
}

/**
 * Return a dictionary of flags indicating which of the indicated changes to the
 * state are actually substantive changes.
 *
 * @private
 * @param {PlainObject} state
 * @param {PlainObject} changes
 */
function fieldsChanged(state, changes) {
  /** @type {ChangedFlags} */
  const changed = {};
  for (const field in changes) {
    if (!equal(changes[field], state[field])) {
      changed[field] = true;
    }
  }
  return changed;
}
