import * as props from '../mixins/props.js';
import symbols from './symbols.js';
import Symbol from './Symbol.js';


const connectedKey = Symbol('connected');
const renderedStateKey = Symbol('renderedState');
const stateKey = Symbol('state');


/**
 * Mixin for managing a component's state.
 */
export default function ReactiveMixin(Base) {
  return class Reactive extends Base {

    constructor() {
      super();
      // Set the initial state from the default state defined by the component
      // and its mixins.
      this.setState(this.defaultState);
    }

    componentDidUpdate() {
      if (super.componentDidUpdate) { super.componentDidUpdate(); }
    }

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      this[connectedKey] = true;
      // If we haven't rendered yet, do so now.
      if (!this[renderedStateKey]) {
        this.render();
      }
    }

    get defaultState() {
      return super.defaultState || {};
    }

    // Internal render method is synchronous.
    [symbols.render]() {
      if (super[symbols.render]) { super[symbols.render](); }
    }
    
    // Public render method.
    // Ensures all internal render methods complete before invoking
    // componentDidUpdate.
    render() {
      if (super.render) { super.render(); }
      // Only render if we haven't rendered this state object before.
      if (this[stateKey] !== this[renderedStateKey]) {
        this[renderedStateKey] = this[stateKey];
        this[symbols.rendering] = true;
        this[symbols.render]();
        this[symbols.rendering] = false;
        this.componentDidUpdate();
      }
    }

    setState(state) {
      // Create a new state object that's the old one with the new changes
      // applied on top of it. Track whether there were any changes.
      const newState = Object.assign({}, this[stateKey]);
      let stateChanged = !this[stateKey];
      Object.keys(state).forEach(key => {
        if (newState[key] !== state[key]) {
          newState[key] = state[key];
          stateChanged = true;
        }
      });

      if (!stateChanged) {
        return Promise.resolve();
      }
      
      // Freeze the new state so that it's immutable. This prevents accidental
      // attempts to set state without going through setState.
      Object.freeze(newState);
      this[stateKey] = newState;

      // Render asynchronously.
      return Promise.resolve().then(() => {
        // Only render if we're already connected to the document.
        if (this[connectedKey]) {
          this.render();
        }
      });
    }

    get state() {
      return this[stateKey];
    }
  }
}
