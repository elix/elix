import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import WrappedStandardElement from './WrappedStandardElement.js';


const Base = WrappedStandardElement.wrap('input');


class Input extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.inner.addEventListener('input', event => {
      this[symbols.raiseChangeEvents] = true;
      /** @type {any} */
      const cast = this.$.inner;
      const value = cast.value;
      this.setState({
        value
      });
      this[symbols.raiseChangeEvents] = false;
    });
  }

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
    const value = this.state.value;
    const changed = value !== previousState.value;
    if (changed && this[symbols.raiseChangeEvents]) {
      const event = new CustomEvent('value-changed', {
        detail: { value }
      });
      this.dispatchEvent(event);
    }
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      value: ''
    });
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
        }
        
        #inner {
          box-sizing: border-box;
          font-family: inherit;
          font-size: inherit;
          font-style: inherit;
          font-weight: inherit;
          height: 100%;
          width: 100%;
        }
      </style>

      <input id="inner">
        <slot></slot>
      </input>
    `;
  }

  get updates() {
    const { value } = this.state;
    return merge(super.updates, {
      $: {
        inner: {
          value
        }
      }
    });
  }

  get value() {
    return this.state.value;
  }
  set value(value) {
    // Only set the value if it's actually different, because we want to avoid
    // trampling on any selection in the input. Chrome's input handles this as
    // we'd like: setting the value will leave the selection unaffected if the
    // value is the same as before. Safari doesn't do what we want: setting the
    // value collapses the selection, even if the value is the same as before.
    // We want to emulate Chrome's behavior.
    if (this.state.value !== value) {
      // @ts-ignore
      this.setState({
        value
      });
    }
  }

}


export default Input;
customElements.define('elix-input', Input);
