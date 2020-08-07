import { fragmentFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { transmute } from "../core/template.js";
import {
  defaultState,
  ids,
  render,
  setState,
  shadowRoot,
  state,
  template,
} from "./internal.js";
import UpDownToggle from "./UpDownToggle.js";

/**
 * Adds a `popupToggle` part to a component
 *
 * @module PopupToggleMixin
 * @part {UpDownToggle} popup-toggle - the element that lets the user know they can open the popup
 * @part down-icon - the icon shown in the toggle if the popup will open or close in the down direction
 * @part up-icon - the icon shown in the toggle if the popup will open or close in the up direction
 * @param {Constructor<ReactiveElement>} Base
 */
export default function PopupToggleMixin(Base) {
  // The class prototype added by the mixin.
  class PopupToggle extends Base {
    get [defaultState]() {
      return Object.assign(super[defaultState], {
        popupTogglePartType: UpDownToggle,
      });
    }

    /**
     * The class or tag used to create the `popup-toggle` part – the
     * element that lets the user know they can open the popup.
     *
     * @type {PartDescriptor}
     * @default UpDownToggle
     */
    get popupTogglePartType() {
      return this[state].popupTogglePartType;
    }
    set popupTogglePartType(popupTogglePartType) {
      this[setState]({ popupTogglePartType });
    }

    [render](/** @type {ChangedFlags} */ changed) {
      super[render](changed);

      renderParts(this[shadowRoot], this[state], changed);

      // Tell the toggle which direction it should point to depending on which
      // direction the popup will open.
      if (changed.popupPosition || changed.popupTogglePartType) {
        const { popupPosition } = this[state];
        const direction = popupPosition === "below" ? "down" : "up";
        /** @type {any} */ const popupToggle = this[ids].popupToggle;
        if ("direction" in popupToggle) {
          popupToggle.direction = direction;
        }
      }

      if (changed.disabled) {
        const { disabled } = this[state];
        /** @type {any} */ (this[ids].popupToggle).disabled = disabled;
      }
    }

    get [template]() {
      const result = super[template];

      // Inject a toggle button into the source slot.
      const sourceSlot = result.content.querySelector('slot[name="source"]');
      if (sourceSlot) {
        sourceSlot.append(fragmentFrom.html`
        <div
          id="popupToggle"
          part="popup-toggle"
          exportparts="down-icon up-icon"
          tabindex="-1"
        >
          <slot name="toggle-icon"></slot>
        </div>
      `);
      }

      renderParts(result.content, this[state]);

      result.content.append(fragmentFrom.html`
      <style>
        [part~="popup-toggle"] {
          outline: none;
        }

        [part~="source"] {
          align-items: center;
          display: flex;
        }
      </style>
    `);

      return result;
    }
  }

  return PopupToggle;
}

/**
 * Render parts for the template or an instance.
 *
 * @private
 * @param {DocumentFragment} root
 * @param {PlainObject} state
 * @param {ChangedFlags} [changed]
 */
function renderParts(root, state, changed) {
  if (!changed || changed.popupTogglePartType) {
    const { popupTogglePartType } = state;
    const popupToggle = root.getElementById("popupToggle");
    if (popupToggle) {
      transmute(popupToggle, popupTogglePartType);
    }
  }
}
