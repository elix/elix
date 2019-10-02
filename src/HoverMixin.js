import * as internal from './internal.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars

/**
 * Tracks whether the mouse is over the component as component state.
 *
 * By tracking the hover condition as component state, the component can perform
 * arbitrary operations when the mouse enters or leaves the component. This goes
 * beyond what's possible with the CSS `:hover` pseudo-class.
 *
 * @module HoverMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function HoverMixin(Base) {
  // The class prototype added by the mixin.
  return class Hover extends Base {
    constructor() {
      // @ts-ignore
      super();
      this.addEventListener('mouseenter', async event => {
        this[internal.raiseChangeEvents] = true;
        this[internal.mouseenter](event);
        await Promise.resolve();
        this[internal.raiseChangeEvents] = false;
      });
      this.addEventListener('mouseleave', async event => {
        this[internal.raiseChangeEvents] = true;
        this[internal.mouseleave](event);
        await Promise.resolve();
        this[internal.raiseChangeEvents] = false;
      });
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        hover: false
      });
    }

    /**
     * See [internal.mouseenter](symbols#mouseenter).
     */
    [internal.mouseenter](/** @type {MouseEvent} */ event) {
      if (super[internal.mouseenter]) {
        super[internal.mouseenter](event);
      }
      this[internal.setState]({
        hover: true
      });
    }

    /**
     * See [internal.mouseenter](symbols#mouseenter).
     */
    [internal.mouseleave](/** @type {MouseEvent} */ event) {
      if (super[internal.mouseleave]) {
        super[internal.mouseleave](event);
      }
      this[internal.setState]({
        hover: false
      });
    }
  };
}
