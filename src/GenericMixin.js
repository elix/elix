import * as internal from './internal.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars

export default function GenericMixin(
  /** @type {Constructor<ReactiveElement>} */ Base
) {
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
      // Parse this as a boolean attribute.
      const parsed = typeof generic === 'string' ? true : Boolean(generic);
      this[internal.setState]({
        generic: parsed
      });
    }

    [internal.render](/** @type {PlainObject} */ changed) {
      super[internal.render](changed);
      if (changed.generic) {
        // Reflect generic state to generic attribute.
        const { generic } = this[internal.state];
        this.toggleAttribute('generic', generic);
      }
    }
  };
}
