import { forwardFocus } from "../core/dom.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import { transmute } from "../core/template.js";
import AriaRoleMixin from "./AriaRoleMixin.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import DelegateInputLabelMixin from "./DelegateInputLabelMixin.js";
import DelegateInputSelectionMixin from "./DelegateInputSelectionMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import Hidden from "./Hidden.js";
import {
  defaultState,
  ids,
  inputDelegate,
  keydown,
  raiseChangeEvents,
  render,
  rendered,
  setState,
  shadowRoot,
  state,
  stateEffects,
  template,
} from "./internal.js";
import KeyboardMixin from "./KeyboardMixin.js";
import PopupSource from "./PopupSource.js";
import UpDownToggle from "./UpDownToggle.js";

const Base = AriaRoleMixin(
  DelegateFocusMixin(
    DelegateInputLabelMixin(
      DelegateInputSelectionMixin(
        FocusVisibleMixin(FormElementMixin(KeyboardMixin(PopupSource)))
      )
    )
  )
);

/**
 * A text input paired with a popup that can be used as an alternative to typing
 *
 * @inherits PopupSource
 * @mixes AriaRoleMixin
 * @mixes DelegateFocusMixin
 * @mixes DelegateInputLabelMixin
 * @mixes DelegateInputSelectionMixin
 * @mixes FocusVisibleMixin
 * @mixes FormElementMixin
 * @mixes KeyboardMixin
 * @part {Hidden} backdrop
 * @part down-icon - the icon shown in the toggle if the popup will open or close in the down direction
 * @part {input} input - the text input element
 * @part {div} source
 * @part {UpDownToggle} popup-toggle - the element that lets the user know they can open the popup
 * @part up-icon - the icon shown in the toggle if the popup will open or close in the up direction
 */
class ComboBox extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      focused: false,
      inputPartType: "input",
      orientation: "vertical",
      placeholder: "",
      popupTogglePartType: UpDownToggle,
      role: "combobox",
      selectText: false,
      sourcePartType: "div",
      value: "",
    });
  }

  get [inputDelegate]() {
    return this[ids].input;
  }

  [rendered](/** @type {ChangedFlags} */ changed) {
    super[rendered](changed);
    if (this[state].selectText) {
      // Select the text in the input after giving the inner input a chance to render the value.
      setTimeout(() => {
        // Text selection might have been turned off in the interim;
        // double-check that we still want to select text.
        if (this[state].selectText) {
          /** @type {any} */
          const cast = this[ids].input;
          const value = cast.value;
          if (value > "") {
            cast.selectionStart = 0;
            cast.selectionEnd = cast.value.length;
          }
        }
      });
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // Select text on closing.
    // Exception: on mobile devices, leaving the text selected may show
    // selection handles, which may suggest to the user that there's something
    // more they should be doing with the text even though they're done with it.
    // We therefore avoid leaving text selected if an on-screen keyboard is in
    // use. Since we can't actually detect that, we use the absence of a
    // fine-grained pointer (mouse) as a proxy for mobile.
    if (changed.opened && !state.opened) {
      const probablyMobile = matchMedia("(pointer: coarse)").matches;
      const selectText = !probablyMobile;
      Object.assign(effects, { selectText });
    }

    return effects;
  }

  /**
   * The combo box's input element.
   *
   * @type {Element|null}
   */
  get input() {
    return this[shadowRoot] ? this[ids].input : null;
  }

  /**
   * The class or tag used to create the `input` part into which the
   * user can enter text.
   *
   * @type {PartDescriptor}
   * @default 'input'
   */
  get inputPartType() {
    return this[state].inputPartType;
  }
  set inputPartType(inputPartType) {
    this[setState]({ inputPartType });
  }

  [keydown](/** @type {KeyboardEvent} */ event) {
    let handled;

    switch (event.key) {
      // Up/Down arrow keys and Page Up/Page Down open the popup.
      case "ArrowDown":
      case "ArrowUp":
      case "PageDown":
      case "PageUp":
        if (this.closed) {
          this.open();
          handled = true;
        }
        break;

      case "Enter":
        this.toggle();
        handled = true;
        break;

      // Escape closes popup and indicates why.
      case "Escape":
        this.close({
          canceled: "Escape",
        });
        handled = true;
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[keydown] && super[keydown](event));
  }

  /**
   * The prompt text shown in the input if it is empty.
   *
   * @type {string}
   */
  get placeholder() {
    return this[state].placeholder;
  }
  set placeholder(placeholder) {
    this[setState]({ placeholder });
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

    if (changed.inputPartType) {
      this[ids].input.addEventListener("blur", () => {
        this[setState]({
          focused: false,
        });
        // If we're open and lose focus, then close.
        if (this.opened) {
          this[raiseChangeEvents] = true;
          this.close();
          this[raiseChangeEvents] = false;
        }
      });

      this[ids].input.addEventListener("focus", () => {
        this[raiseChangeEvents] = true;
        this[setState]({
          focused: true,
        });
        this[raiseChangeEvents] = false;
      });

      this[ids].input.addEventListener("input", () => {
        this[raiseChangeEvents] = true;
        /** @type {any} */
        const cast = this[ids].input;
        const value = cast.value;
        /** @type {PlainObject} */ const changes = {
          value,
          selectText: false,
        };
        if (this.closed && value > "") {
          // If user types while popup is closed, implicitly open it.
          changes.opened = true;
        }
        this[setState](changes);
        this[raiseChangeEvents] = false;
      });

      this[ids].input.addEventListener("keydown", () => {
        this[raiseChangeEvents] = true;
        this[setState]({
          selectText: false,
        });
        this[raiseChangeEvents] = false;
      });

      // If the user clicks on the input and the popup is closed, open it.
      this[ids].input.addEventListener("mousedown", (event) => {
        // Only process events for the main (usually left) button.
        if (/** @type {MouseEvent} */ (event).button !== 0) {
          return;
        }
        this[raiseChangeEvents] = true;
        this[setState]({
          selectText: false,
        });
        if (this.closed && !this.disabled) {
          this.open();
        }
        this[raiseChangeEvents] = false;
      });
    }

    if (changed.popupTogglePartType) {
      const popupToggle = this[ids].popupToggle;
      const input = this[ids].input;
      popupToggle.addEventListener("mousedown", (event) => {
        // Only process events for the main (usually left) button.
        if (/** @type {MouseEvent} */ (event).button !== 0) {
          return;
        }
        // Ignore mousedown if we're presently disabled.
        if (this[state].disabled) {
          event.preventDefault();
          return;
        }
        this[raiseChangeEvents] = true;
        this.toggle();
        this[raiseChangeEvents] = false;
      });
      if (popupToggle instanceof HTMLElement && input instanceof HTMLElement) {
        // Forward focus for new toggle button.
        forwardFocus(popupToggle, input);
      }
    }

    if (changed.popupPartType) {
      const popup = this[ids].popup;
      /** @type {any} */ const cast = popup;
      popup.removeAttribute("tabindex");
      // Override popup's backdrop to hide it.
      if ("backdropPartType" in popup) {
        cast.backdropPartType = Hidden;
      }
      if ("autoFocus" in popup) {
        cast.autoFocus = false;
      }
      const frame = cast.frame;
      if (frame) {
        Object.assign(frame.style, {
          display: "flex",
          flexDirection: "column",
        });
      }
      if ("closeOnWindowResize" in popup) {
        cast.closeOnWindowResize = false;
      }
    }

    if (changed.disabled) {
      const { disabled } = this[state];
      /** @type {any} */ (this[ids].input).disabled = disabled;
      /** @type {any} */ (this[ids].popupToggle).disabled = disabled;
    }

    if (changed.placeholder) {
      const { placeholder } = this[state];
      /** @type {any} */ (this[ids].input).placeholder = placeholder;
    }

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

    if (changed.value) {
      const { value } = this[state];
      /** @type {any} */ (this[ids].input).value = value;
    }
  }

  get [template]() {
    const result = super[template];

    // Put an input element and toggle in the source.
    const sourceSlot = result.content.querySelector('slot[name="source"]');
    if (sourceSlot) {
      sourceSlot.replaceWith(fragmentFrom.html`
        <input id="input" part="input"></input>
        <div id="popupToggle" part="popup-toggle" tabindex="-1"></div>
      `);
    }

    renderParts(result.content, this[state]);

    result.content.append(
      fragmentFrom.html`
        <style>
          [part~="source"] {
            background-color: inherit;
            display: inline-grid;
            grid-template-columns: 1fr auto;
            position: relative;
          }

          [part~="input"] {
            outline: none;
          }

          [part~="popup"] {
            flex-direction: column;
            max-height: 100vh;
            max-width: 100vh;
          }
        </style>
      `
    );

    return result;
  }

  get value() {
    return this[state].value;
  }
  set value(value) {
    this[setState]({ value });
  }
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
  if (!changed || changed.inputPartType) {
    const { inputPartType } = state;
    const input = root.getElementById("input");
    if (input) {
      transmute(input, inputPartType);
    }
  }
  if (!changed || changed.popupTogglePartType) {
    const { popupTogglePartType } = state;
    const popupToggle = root.getElementById("popupToggle");
    if (popupToggle) {
      transmute(popupToggle, popupTogglePartType);
    }
  }
}

export default ComboBox;
