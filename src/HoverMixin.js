import * as symbols from './symbols.js';
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
      this.addEventListener('mouseenter', async (event) => {
        this[symbols.raiseChangeEvents] = true;
        this[symbols.mouseenter](event);
        await Promise.resolve();
        this[symbols.raiseChangeEvents] = false;
      });
      this.addEventListener('mouseleave', async (event) => {
        this[symbols.raiseChangeEvents] = true;
        this[symbols.mouseleave](event);
        await Promise.resolve();
        this[symbols.raiseChangeEvents] = false;
      });
    }

    get [symbols.defaultState]() {
      return Object.assign(super[symbols.defaultState], {
        hover: false
      })
    }

    /**
     * See [symbols.mouseenter](symbols#mouseenter).
     */
    [symbols.mouseenter](/** @type {MouseEvent} */ event) {
      if (super[symbols.mouseenter]) { super[symbols.mouseenter](event); }
      this[symbols.setState]({
        hover: true
      });
    }

    /**
     * See [symbols.mouseenter](symbols#mouseenter).
     */
    [symbols.mouseleave](/** @type {MouseEvent} */ event) {
      if (super[symbols.mouseleave]) { super[symbols.mouseleave](event); }
      this[symbols.setState]({
        hover: false
      });
    }

  }
}
