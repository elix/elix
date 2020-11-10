import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  mouseenter,
  mouseleave,
  raiseChangeEvents,
  setState,
} from "./internal.js";

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
      this.addEventListener("mouseenter", async (event) => {
        this[raiseChangeEvents] = true;
        this[mouseenter](event);
        await Promise.resolve();
        this[raiseChangeEvents] = false;
      });
      this.addEventListener("mouseleave", async (event) => {
        this[raiseChangeEvents] = true;
        this[mouseleave](event);
        await Promise.resolve();
        this[raiseChangeEvents] = false;
      });
    }

    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        hover: false,
      });
    }

    /**
     * See [mouseenter](internal#internal.mouseenter).
     */
    [mouseenter](/** @type {MouseEvent} */ event) {
      if (super[mouseenter]) {
        super[mouseenter](event);
      }
      this[setState]({
        hover: true,
      });
    }

    /**
     * See [mouseenter](internal#internal.mouseenter).
     */
    [mouseleave](/** @type {MouseEvent} */ event) {
      if (super[mouseleave]) {
        super[mouseleave](event);
      }
      this[setState]({
        hover: false,
      });
    }
  };
}
