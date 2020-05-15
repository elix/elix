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
 * Tracks whether the element is currently selected.
 *
 * @module SelectableMixin
 * @state selected
 * @param {Constructor<ReactiveElement>} Base
 */
export default function SelectableMixin(Base) {
  // The class prototype added by the mixin.
  return class Selectable extends Base {
    constructor() {
      super();
      /** @type {any} */ const cast = this;
      if (!this[nativeInternals] && cast.attachInternals) {
        this[nativeInternals] = cast.attachInternals();
      }
    }

    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        selected: false,
      });
    }

    [render](/** @type {ChangedFlags} */ changed) {
      super[render](changed);
      if (changed.selected) {
        const { selected } = this[state];
        setInternalState(this, "selected", selected);
      }
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      // TODO: How do we know whether to raise this if selection is set by Menu? */
      if (changed.selected /* && this[raiseChangeEvents] */) {
        const { selected } = this[state];
        /**
         * Raised when the `selected` property changes.
         *
         * @event selected-changed
         */
        const event = new CustomEvent("selected-changed", {
          bubbles: true,
          detail: { selected },
        });
        this.dispatchEvent(event);
      }
    }

    /**
     * True if the element is currently selected.
     *
     * @type {boolean}
     * @default false
     */
    get selected() {
      return this[state].selected;
    }
    set selected(selected) {
      // Note: AttributeMarshallingMixin will recognize `selected` as the name of
      // attribute that should be parsed as a boolean attribute, and so will
      // handling parsing it for us.
      this[setState]({ selected });
    }
  };
}
