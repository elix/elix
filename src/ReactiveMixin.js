import * as symbols from './symbols.js';


const renderedStateKey = Symbol('renderedState');
const stateKey = Symbol('state');
const raiseChangeEventsInNextRenderKey = Symbol('raiseChangeEventsInNextRender');


/**
 * Mixin for managing and rendering a component's state in a functional reactive
 * style.
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

    componentDidUpdate(previousState) {
      if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
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
     * @type {object}
     */
    get defaultState() {
      return super.defaultState || {};
    }

    refineState(state) {
      return super.refineState ? super.refineState(state) : true;
    }

    /*
     * Internal render method.
     * 
     * The default implementation does nothing. Augment this in your component
     * (or another mixin) to render the component's state to the DOM.
     */
    [symbols.render]() {
      if (super[symbols.render]) { super[symbols.render](); }
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

      // Only render if we haven't rendered this state object before. This
      // ensures that consecutive calls to setState only cause a single render.
      // Each setState call will update the state, queuing up a promise to
      // render. By the time the first render call actually happens, the
      // complete state is available. That is what is rendered. When the
      // following render calls happen, they will see that the complete state
      // has already been rendered, and skip doing any work.
      const previousState = this[renderedStateKey];
      if (this[stateKey] !== previousState) {

        const firstRender = previousState === undefined;

        // Remember that we've rendered (or about to render) this state.
        this[renderedStateKey] = this[stateKey];

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
        this[symbols.render]();
        this[symbols.rendering] = false;

        // Let the component know it was rendered.
        if (firstRender) {
          this.componentDidMount();
        } else {
          this.componentDidUpdate(previousState);
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

      // Create a new state object that holds the old state, plus the new
      // changes merged on top of it.
      const nextState = Object.assign({}, this[stateKey], changes);

      refineState(this, nextState);

      // Freeze the new state so it's immutable. This prevents accidental
      // attempts to set state without going through setState.
      Object.freeze(nextState);

      // Is this our first setState, or does the component think something's changed?
      const changed = this[stateKey] === undefined || this.shouldComponentUpdate(nextState);
      if (!changed) {
        // No need to render.
        return false;
      }

      // Set the new state.
      this[stateKey] = nextState;

      // We only need to render if we're actually in the document.
      if (this.isConnected) {

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
      }

      return true;
    }

    /**
     * Return true if the component should update.
     * 
     * The default implementation does a shallow check of property values like
     * React's PureComponent. This seems adequate for most web components. You
     * can override this to always return true (like React's base Component
     * class), or to perform more specific, deeper checks for changes in state.
     * 
     * @param {object} nextState - the proposed new state for the element
     * @return {boolean} - true if the component should update (rerender)
     */
    shouldComponentUpdate(nextState) {
      const base = super.shouldComponentUpdate && super.shouldComponentUpdate(nextState);
      if (base) {
        return true; // Trust base result.
      }
      // Do a shallow prop comparison to track whether there were any changes.
      for (const key in nextState) {
        if (nextState[key] !== this.state[key]) {
          return true;
        }
      }
      return false; // No changes.
    }

    /**
     * The component's current state.
     * The returned state object is immutable. To update it, invoke `setState`.
     * 
     * @type {object}
     */
    get state() {
      return this[stateKey];
    }
  }
}


function refineState(element, state) {
  // Repeatedly refine state until the refine operation returns true.
  /* eslint-disable no-empty */
  for (;!element.refineState(state);) {}
}
