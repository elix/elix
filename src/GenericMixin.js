import ReactiveElement from './ReactiveElement.js';


export default function GenericMixin(/** @type {Constructor<ReactiveElement>} */Base) {

  // The class prototype added by the mixin.
  return class Generic extends Base {

    get defaultState() {
      return Object.assign(super.defaultState, {
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
