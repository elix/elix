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
      if (!this[internal.nativeInternals] && this.attachInternals) {
        this[internal.nativeInternals] = this.attachInternals();
      }
    }

    [internal.componentDidUpdate](changed) {
      if (super[internal.componentDidUpdate]) {
        super[internal.componentDidUpdate](changed);
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

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        selected: false
      });
    }

    [internal.render](/** @type {PlainObject} */ changed) {
      super[internal.render](changed);
      if (changed.selected) {
        // Set both an attribute and an internal state for browsers that support
        // the `:state` selector. When all browsers support :state, we'll want
        // to deprecate use of attributes.
        const { selected } = this[internal.state];
        this.toggleAttribute("selected", selected);
        if (
          this[internal.nativeInternals] &&
          this[internal.nativeInternals].states
        ) {
          this[internal.nativeInternals].states.toggle("selected", selected);
        }
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
