import { currentProps, updateProps } from '../mixins/helpers.js';
import Symbol from './Symbol.js';


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
        if (this[originalPropsKey] === undefined) {
          this[originalPropsKey] = currentProps(this);
        }
        const hostProps = this.hostProps(this[originalPropsKey]);
        updateProps(this, hostProps);
      }
      if (this.componentDidUpdate) {
        this.componentDidUpdate();
      }
    }

    setState(state) {
      console.log(state);
      this[stateKey] = Object.assign({}, this[stateKey], state);
      Object.freeze(this[stateKey]);
      if (this.parentNode) {
        Promise.resolve().then(() => {
          if (this[stateKey] !== this[renderedStateKey]) {
            this[renderedStateKey] = this[stateKey];
            console.log(`render`);
            this.render();
          } else {
            console.log(`skipped render!`);
          }
        });
      }
    }

    get state() {
      return this[stateKey];
    }
  }
}
