import { booleanAttributeValue } from "../core/AttributeMarshallingMixin.js";
import { setInternalState } from "../core/dom.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  nativeInternals,
  render,
  rendered,
  setState,
  state,
} from "./internal.js";

/**
 * Tracks whether an item is the current item.
 *
 * @module CurrentMixin
 * @state current
 * @param {Constructor<ReactiveElement>} Base
 */
export default function CurrentMixin(Base) {
  // The class prototype added by the mixin.
  return class Current extends Base {
    constructor() {
      super();
      /** @type {any} */ const cast = this;
      if (!this[nativeInternals] && cast.attachInternals) {
        this[nativeInternals] = cast.attachInternals();
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "current") {
        const value = booleanAttributeValue(name, newValue);
        if (this.current !== value) {
          this.current = value;
        }
      } else {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        current: false,
      });
    }

    [render](/** @type {ChangedFlags} */ changed) {
      super[render](changed);
      if (changed.current) {
        const { current } = this[state];
        setInternalState(this, "current", current);
      }
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      // TODO: How do we know whether to raise this if selection is set by Menu? */
      if (changed.current /* && this[raiseChangeEvents] */) {
        const { current } = this[state];
        const oldEvent = new CustomEvent("current-changed", {
          bubbles: true,
          detail: { current },
        });
        this.dispatchEvent(oldEvent);
        /**
         * Raised when the `current` property changes.
         *
         * @event currentchange
         */
        const event = new CustomEvent("currentchange", {
          bubbles: true,
          detail: { current },
        });
        this.dispatchEvent(event);
      }
    }

    /**
     * True if the element is currently current.
     *
     * @type {boolean}
     * @default false
     */
    get current() {
      return this[state].current;
    }
    set current(current) {
      // Note: AttributeMarshallingMixin will recognize `current` as the name of
      // attribute that should be parsed as a boolean attribute, and so will
      // handling parsing it for us.
      this[setState]({ current });
    }
  };
}
