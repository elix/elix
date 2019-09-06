import * as internal from './internal.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars


export default function GenericMixin(/** @type {Constructor<ReactiveElement>} */Base) {

  // The class prototype added by the mixin.
  return class Generic extends Base {

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        generic: true
      });
    }

    get generic() {
      return this[internal.state].generic;
    }
    set generic(generic) {
      const parsed = String(generic) === 'true';
      this[internal.setState]({
        generic: parsed
      });
    }

  };

}
