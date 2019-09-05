import * as symbols from './symbols.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars


export default function GenericMixin(/** @type {Constructor<ReactiveElement>} */Base) {

  // The class prototype added by the mixin.
  return class Generic extends Base {

    get [symbols.defaultState]() {
      return Object.assign(super[symbols.defaultState], {
        generic: true
      });
    }

    get generic() {
      return this.state.generic;
    }
    set generic(generic) {
      const parsed = String(generic) === 'true';
      this.setState({
        generic: parsed
      });
    }

  };

}
