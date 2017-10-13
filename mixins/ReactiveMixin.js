import * as props from '../mixins/props.js';
import symbols from './symbols.js';
import Symbol from './Symbol.js';


const connectedKey = Symbol('connected');
const originalPropsKey = Symbol('originalProps');
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
      // if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
      //   window.ShadyCSS.styleElement(this);
      // }
    }

    get defaultState() {
      return super.defaultState || {};
    }

    // TODO: Make render itself synchronous?
    [symbols.render]() {
      const base = super[symbols.render] ? super[symbols.render]() : Promise.resolve();
      return base.then(() => {
        // console.log(`ReactiveMixin: render`);

        // If the component or its mixins want to apply properties/attributes to
        // the component host, collect those.
        if (this.hostProps) {
          // First gather the original attributes on the component.
          if (this[originalPropsKey] === undefined) {
            this[originalPropsKey] = props.getProps(this);
          }
          // Collect an updated set of properties/attributes.
          const hostProps = this.hostProps(this[originalPropsKey]);
          // Apply those to the host.
          props.applyProps(this, hostProps);
        }
      });
    }
    
    render() {
      const base = super.render ? super.render() : Promise.resolve();
      return base.then(() => {
        // Only render if we haven't rendered this state object before.
        if (this[stateKey] !== this[renderedStateKey]) {
          this[renderedStateKey] = this[stateKey];
          // console.log(`render`);
          return this[symbols.render]()
          .then(() => {
            this.componentDidUpdate();
          });
        }
      });
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

      // Only render if we're already connected to the document.
      return this[connectedKey] ?
        this.render() :
        Promise.resolve();
    }

    get state() {
      return this[stateKey];
    }
  }
}
