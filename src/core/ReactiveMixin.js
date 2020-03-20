import * as internal from "./internal.js";

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
 * @module ReactiveMixin
 * @param {Constructor<CustomElement>} Base
 */
export default function ReactiveMixin(Base) {
  class Reactive extends Base {
    constructor() {
      super();
      this[internal.firstRender] = undefined;
      this[changedSinceLastRenderKey] = {};
      // Set the initial state from the default state defined by the component
      // and its mixins.
      this[internal.setState](this[internal.defaultState]);
    }

    [internal.componentDidMount]() {
      if (super[internal.componentDidMount]) {
        super[internal.componentDidMount]();
      }
      if (
        super[internal.componentDidMount] ||
        this[internal.componentDidMount] !==
          Reactive.prototype[internal.componentDidMount]
      ) {
        /* eslint-disable no-console */
        console.warn(
          "Deprecation warning: componentDidMount is being replaced with the internal.rendered method and the internal.firstRender flag. See https://elix.org/documentation/ReactiveMixin#lifecycle-methods."
        );
      }
    }

    [internal.componentDidUpdate](changed) {
      if (super[internal.componentDidUpdate]) {
        super[internal.componentDidUpdate](changed);
      }
      if (
        super[internal.componentDidUpdate] ||
        this[internal.componentDidUpdate] !==
          Reactive.prototype[internal.componentDidUpdate]
      ) {
        /* eslint-disable no-console */
        console.warn(
          "Deprecation warning: componentDidUpdate is being replaced with the internal.rendered method and the internal.firstRender flag. See https://elix.org/documentation/ReactiveMixin#lifecycle-methods."
        );
      }
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      // Render the component. If the component was forced to render before this
      // point, and the state hasn't changed, this call will be a no-op.
      this[internal.renderChanges]();
    }

    /**
     * The default state for the component. This can be extended by mixins and
     * classes to provide additional default state.
     *
     * @type {PlainObject}
     */
    get [internal.defaultState]() {
      // Defer to base implementation if defined.
      return super[internal.defaultState] || {};
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
    [internal.render](/** @type {ChangedFlags} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
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
    [internal.renderChanges]() {
      // Determine what's changed since the last render.
      const changed = this[changedSinceLastRenderKey];

      if (typeof this[internal.firstRender] === "undefined") {
        // First render.
        this[internal.firstRender] = true;
      }

      // We only render if the component's never been rendered before, or is
      // something's actually changed since the last render. Consecutive
      // synchronous[internal.setState] calls will queue up corresponding async render
      // calls. By the time the first render call actually happens, the complete
      // state is available, and that is what is rendered. When the following
      // render calls happen, they will see that the complete state has already
      // been rendered, and skip doing any work.
      if (this[internal.firstRender] || Object.keys(changed).length > 0) {
        // If at least one of the[internal.setState] calls was made in response to user
        // interaction or some other component-internal event, set the
        // raiseChangeEvents flag so that componentDidMount/componentDidUpdate
        // know whether to raise property change events.
        const saveRaiseChangeEvents = this[internal.raiseChangeEvents];
        this[internal.raiseChangeEvents] = this[
          raiseChangeEventsInNextRenderKey
        ];

        // We set a flag to indicate that rendering is happening. The component
        // may use this to avoid triggering other updates during the render.
        this[internal.rendering] = true;

        // Invoke any internal render implementations.
        this[internal.render](/** @type {ChangedFlags} */ changed);

        this[internal.rendering] = false;

        // Since we've now rendered all changes, clear the change log. If other
        // async render calls are queued up behind this call, they'll see an
        // empty change log, and so skip unnecessary render work.
        this[changedSinceLastRenderKey] = {};

        // Let the component know it was rendered.
        this[internal.rendered](changed);

        // DEPRECATED: First time is consider mounting; subsequent times are updates.
        if (this[internal.firstRender]) {
          if (this[internal.componentDidMount]) {
            this[internal.componentDidMount]();
          }
        } else {
          if (this[internal.componentDidUpdate]) {
            this[internal.componentDidUpdate](changed);
          }
        }

        // We've now rendered for the first time.
        this[internal.firstRender] = false;

        // Restore state of event flags.
        this[internal.raiseChangeEvents] = saveRaiseChangeEvents;
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
    [internal.rendered](/** @type {ChangedFlags} */ changed) {
      if (super[internal.rendered]) {
        super[internal.rendered](changed);
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
    async [internal.setState](changes) {
      // There's no good reason to have a render method update state.
      if (this[internal.rendering]) {
        /* eslint-disable no-console */
        console.warn(
          `${this.constructor.name} called [internal.setState] during rendering, which you should avoid.\nSee https://elix.org/documentation/ReactiveMixin.`
        );
      }

      const firstSetState = this[stateKey] === undefined;

      // Apply the changes to the component's state to produce a new state
      // and a dictionary of flags indicating which fields actually changed.
      const { state, changed } = copyStateWithChanges(this, changes);

      const renderWorthy = firstSetState || Object.keys(changed).length > 0;
      if (!renderWorthy) {
        // No need to update state.
        return;
      }

      // Freeze the new state so it's immutable. This prevents accidental
      // attempts to set state without going through [internal.setState].
      Object.freeze(state);

      // Set this as the component's new state.
      this[stateKey] = state;

      // Add this round of changed fields to the complete set that have
      // changed since the component was last rendered.
      Object.assign(this[changedSinceLastRenderKey], changed);

      if (!this.isConnected) {
        // Not in document, so no need to render.
        return;
      }

      // Remember whether we're supposed to raise property change events.
      if (this[internal.raiseChangeEvents]) {
        this[raiseChangeEventsInNextRenderKey] = true;
      }

      // Yield with promise timing. This lets any *synchronous* setState calls
      // that happen after the current setState call complete first. Their
      // effects on the state will be batched up before the render call below
      // actually happens.
      await Promise.resolve();

      // Render the component.
      this[internal.renderChanges]();
    }

    /**
     * The component's current state.
     *
     * The returned state object is immutable. To update it, invoke
     * `internal.setState`.
     *
     * It's extremely useful to be able to inspect component state while
     * debugging. If you append `?elixdebug=true` to a page's URL, then
     * ReactiveMixin will conditionally expose a public `state` property
     * that returns the component's state. You can then access the state
     * in your browser's debug console.
     *
     * @type {PlainObject}
     */
    get [internal.state]() {
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
     * `internal.setState` will apply the changes to the state, and invoke this
     * `stateEffects` method again to determine whether there are any
     * third-order effects that should be applied. This process repeats until
     * all mixins/classes report that they have no additional changes to make.
     *
     * See an example of how `ReactiveMixin` invokes the `stateEffects` to
     * [ensure state consistency](ReactiveMixin#ensuring-state-consistency).
     *
     * @param {PlainObject} state - a proposal for a new state
     * @param {ChangedFlags} changed - the set of fields changed in this
     * latest proposal for the new state
     * @returns {PlainObject}
     */
    [internal.stateEffects](state, changed) {
      return super[internal.stateEffects]
        ? super[internal.stateEffects](state, changed)
        : {};
    }
  }

  // Expose state when debugging; see note for `[internal.state]` getter.
  const elixdebug = new URLSearchParams(location.search).get("elixdebug");
  if (elixdebug === "true") {
    Object.defineProperty(Reactive.prototype, "state", {
      get() {
        return this[internal.state];
      }
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
    effects = element[internal.stateEffects](state, changedByEffects);
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
 * state are actually changes.
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
