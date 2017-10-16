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
      // if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
      //   window.ShadyCSS.styleElement(this);
      // }
    }

    get defaultState() {
      return super.defaultState || {};
    }

    // TODO: Make render itself synchronous?
    [symbols.render]() {
      return super[symbols.render] ? super[symbols.render]() : Promise.resolve();
    }
    
    render() {
      const base = super.render ? super.render() : Promise.resolve();
      return base.then(() => {
        // Only render if we haven't rendered this state object before.
        if (this[stateKey] !== this[renderedStateKey]) {
          this[renderedStateKey] = this[stateKey];
          // console.log(`render`);
          this[symbols.rendering] = true;
          return this[symbols.render]()
          .then(() => {
            this[symbols.rendering] = false;
            this.componentDidUpdate();
          });
        }
      });
    }

    setAttribute(name, value) {
      if (name === 'style' && !this[symbols.rendering]) {
        // console.log(`${this.localName}: setAttribute style, ${value}`);
        this.style = value;
      } else {
        super.setAttribute(name, value);
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

      // Only render if we're already connected to the document.
      return this[connectedKey] ?
        this.render() :
        Promise.resolve();
    }

    get state() {
      return this[stateKey];
    }

    get style() {
      return super.style;
    }
    set style(style) {
      let value = style;
      if (!this[symbols.rendering]) {
        // console.log(`${this.localName}: style = ${style}`);
        const current = this.style.cssText;
        if (style !== current) {
          const styleProps = parseStyleProps(this.style.cssText);
          const newProps = parseStyleProps(style);
          Object.assign(styleProps, newProps);
          value = props.formatStyleProps(styleProps);
        }
      }
      super.style = value;
    }

    // HACK: Expose a string that can be set on a component to add to its
    // existing styles. If/when lit-html supports setting properties directly,
    // might at least be able to turn this into a styleProps-valued object.
    get styleAdditions() {
      return props.getStyleProps(this);
    }
    set styleAdditions(styleProps) {
      const merged = [this.style.cssText, styleProps].join('; ');
      this.style.cssText = merged;
    }
  }
}


function parseStyleProps(text) {
  const result = {};
  const rules = text.split(';');
  rules.forEach(rule => {
    if (rule.length > 0) {
      const parts = rule.split(':');
      const name = parts[0].trim();
      const value = parts[1].trim();
      result[name] = value;
    }
  });
  return result;
}
