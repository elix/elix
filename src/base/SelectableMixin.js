import { setInternalState } from "../core/dom.js";
import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Tracks whether the element is currently selected
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
      if (!this[internal.nativeInternals] && cast.attachInternals) {
        this[internal.nativeInternals] = cast.attachInternals();
      }
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        selected: false
      });
    }

    [internal.render](/** @type {ChangedFlags} */ changed) {
      super[internal.render](changed);
      if (changed.selected) {
        const { selected } = this[internal.state];
        setInternalState(this, "selected", selected);
      }
    }

    [internal.rendered](/** @type {ChangedFlags} */ changed) {
      if (super[internal.rendered]) {
        super[internal.rendered](changed);
      }
      // TODO: How do we know whether to raise this if selection is set by Menu? */
      if (changed.selected /* && this[internal.raiseChangeEvents] */) {
        const { selected } = this[internal.state];
        /**
         * Raised when the `selected` property changes.
         *
         * @event selected-changed
         */
        const event = new CustomEvent("selected-changed", {
          detail: { selected }
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
      return this[internal.state].selected;
    }
    set selected(selected) {
      // Note: AttributeMarshallingMixin will recognize `selected` as the name of
      // attribute that should be parsed as a boolean attribute, and so will
      // handling parsing it for us.
      this[internal.setState]({ selected });
    }
  };
}
