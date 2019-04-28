import * as symbols from './symbols.js';
import State from './State.js';


/** @type {any} */
const mountedKey = Symbol('mounted');
/** @type {any} */
const stateKey = Symbol('state');
/** @type {any} */
const raiseChangeEventsInNextRenderKey = Symbol('raiseChangeEventsInNextRender');


/**
 * Manages component state and renders changes in state
 * 
 * This is modeled after React/Preact's state management, and is adapted for
 * use with web components. Applying this mixin to a component will give it
 * FRP behavior comparable to React's.
 * 
 * @module ReactiveMixin
 */
export default function ReactiveMixin(Base) {
  return class Reactive extends Base {

    constructor() {
      // @ts-ignore
      super();
      // Set the initial state from the default state defined by the component
      // and its mixins.
      this.setState(this.defaultState);
    }

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
    }

    componentDidUpdate(changed) {
      if (super.componentDidUpdate) { super.componentDidUpdate(changed); }
    }

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      // Render the component. If the component was forced to render before this
      // point, and the state hasn't changed, this call will be a no-op.
      this.render();
    }

    /**
     * The default state for the component. This can be extended by mixins and
     * classes to provide additional default state.
     * 
     * @type {State}
     */
    get defaultState() {
      return new State();
    }

    /*
     * Internal render method.
     * 
     * The default implementation does nothing. Augment this in your component
     * (or another mixin) to render the component's state to the DOM.
     */
    [symbols.render](changed) {
      if (super[symbols.render]) { super[symbols.render](changed); }
    }

    /**
     * Render the component to the DOM.
     * 
     * This method does nothing if the state has not changed since the last
     * render call.
     * 
     * This method invokes all internal render methods. It then invoked
     * componentDidMount (for first render) or componentDidUpdate (for
     * subsequent renders).
     */
    render() {

      // Determine what's changed since the last render.
      const changed = this[stateKey].changeLog;

      // This
      // ensures that consecutive calls to setState only cause a single render.
      // Each setState call will update the state, queuing up a promise to
      // render. By the time the first render call actually happens, the
      // complete state is available. That is what is rendered. When the
      // following render calls happen, they will see that the complete state
      // has already been rendered, and skip doing any work.

      // TODO: Refactor this check
      if (Object.keys(changed).length > 0) {

        // If at least one of the setState calls was made in response to user
        // interaction or some other component-internal event, set the
        // raiseChangeEvents flag so that componentDidMount/componentDidUpdate
        // know whether to raise property change events.
        const saveRaiseChangeEvents = this[symbols.raiseChangeEvents];
        this[symbols.raiseChangeEvents] = this[raiseChangeEventsInNextRenderKey];

        // We set a flag to indicate that rendering is happening. The component
        // may use this to avoid triggering other updates during the render.
        this[symbols.rendering] = true;

        // Invoke any internal render method implementations.
        this[symbols.render](changed);
        this[symbols.rendering] = false;

        // Since we've now rendered all changes, clear the change log.
        this[stateKey].clearChangeLog();

        // Let the component know it was rendered.
        // First time is consider mounting; subsequent times are updates.
        if (!this[mountedKey]) {
          this.componentDidMount();
          this[mountedKey] = true;
        } else {
          this.componentDidUpdate(changed);
        }

        // Restore state of event flags.
        this[symbols.raiseChangeEvents] = saveRaiseChangeEvents;
        this[raiseChangeEventsInNextRenderKey] = saveRaiseChangeEvents;
      }
    }

    /**
     * Update the component's state by merging the specified changes on
     * top of the existing state. If the component is connected to the document,
     * and the new state has changed, this returns a promise to asynchronously
     * render the component. Otherwise, this returns a resolved promise.
     * 
     * @param {object} changes - the changes to apply to the element's state
     * @returns {Promise} - resolves when the new state has been rendered
     */
    async setState(changes) {
      // There's no good reason to have a render method update state.
      if (this[symbols.rendering]) {
        /* eslint-disable no-console */
        console.warn(`${this.constructor.name} called setState during rendering, which you should avoid.\nSee https://elix.org/documentation/ReactiveMixin.`);
      }

      /** @type {State} */
      let state;
      /** @type {PlainObject} */
      let changed;
      if (this[stateKey] === undefined) {
        state = new State(changes);
        changed = {};
        // By definition, everything's changed.
        for (const field in changes) {
          changed[field] = true;
        }
      } else {
        const copyResult = this[stateKey].copyWithChanges(changes);
        state = copyResult.state;
        changed = copyResult.changed;
      }

      // Freeze the new state so it's immutable. This prevents accidental
      // attempts to set state without going through setState.
      Object.freeze(state);

      // Set the new state.
      this[stateKey] = state;

      if (Object.keys(changed).length === 0 && !this.shouldComponentUpdate(state)) {
        // Nothing's changed -- no need to render.
        return false;
      }

      if (!this.isConnected) {
        // Not in document yet -- no need to render.
        return false;
      }

      // Remember whether we're supposed to raise property change events.
      if (this[symbols.raiseChangeEvents]) {
        this[raiseChangeEventsInNextRenderKey] = true;
      }
      
      // Yield with promise timing. This lets any *synchronous* setState
      // calls that happen after the current setState call complete first.
      // Their effects on the state will be batched up before the render
      // call below actually happens.
      await Promise.resolve();
      
      // Render the component.
      this.render();

      return true;
    }

    /**
     * Return true if the component should update.
     * 
     * By default, `ReactiveMixin` will perform a shallow check of property
     * values like React's PureComponent. This seems adequate for most web
     * components. You can override this to always return true (like React's
     * base Component class), or to perform more specific, deeper checks for
     * changes in state.
     * 
     * @param {State} nextState - the proposed new state for the element
     * @return {boolean} - true if the component should update (rerender)
     */
    shouldComponentUpdate(nextState) {
      return super.shouldComponentUpdate ?
        super.shouldComponentUpdate(nextState) :
        false;
    }

    /**
     * The component's current state.
     * The returned state object is immutable. To update it, invoke `setState`.
     * 
     * @type {State}
     */
    get state() {
      return this[stateKey] || Object.freeze({});
    }
  }
}
