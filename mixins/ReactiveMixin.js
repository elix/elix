import Symbol from './Symbol.js';
import { updateProps } from '../mixins/helpers.js';


const stateKey = Symbol('state');


/**
 * Mixin for managing a component's state.
 */
export default function ReactiveMixin(Base) {
  return class Reactive extends Base {

    constructor() {
      super();
      this[stateKey] = {};
      this.setState(this.defaultState);
    }

    get defaultState() {
      return super.defaultState || {};
    }

    render() {
      if (super.render) { super.render(); }
      // console.log(`ReactiveMixin: render`);
      if (this.hostProps) {
        const hostProps = this.hostProps();
        updateProps(this, hostProps);
      }
      if (this.componentDidUpdate) {
        Promise.resolve().then(() => {
          this.componentDidUpdate();
        });
      }
    }

    setState(state) {
      this[stateKey] = Object.assign({}, this[stateKey], state);
      Object.freeze(this[stateKey]);
      if (this.parentNode) {
        this.render();
      }
    }

    get state() {
      return this[stateKey];
    }
  }
}
