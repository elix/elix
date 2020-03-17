import { forwardFocus } from "../core/dom.js";
import * as internal from "./internal.js";
import * as template from "../core/template.js";
import AriaRoleMixin from "./AriaRoleMixin.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import Hidden from "./Hidden.js";
import html from "../core/html.js";
import KeyboardMixin from "./KeyboardMixin.js";
import PopupSource from "./PopupSource.js";
import UpDownToggle from "./UpDownToggle.js";

const Base = AriaRoleMixin(
  DelegateFocusMixin(FormElementMixin(KeyboardMixin(PopupSource)))
);

/**
 * A text input paired with a popup that can be used as an alternative to typing
 *
 * @inherits PopupSource
 * @mixes AriaRoleMixin
 * @mixes DelegateFocusMixin
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
  // Forward any ARIA label to the input element.
  get ariaLabel() {
    return this[internal.state].ariaLabel;
  }
  set ariaLabel(ariaLabel) {
    this[internal.setState]({ ariaLabel });
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      ariaLabel: "",
      focused: false,
      inputPartType: "input",
      orientation: "vertical",
      placeholder: "",
      popupTogglePartType: UpDownToggle,
      role: "combobox",
      selectText: false,
      sourcePartType: "div",
      value: ""
    });
  }

  [internal.rendered](/** @type {ChangedFlags} */ changed) {
    super[internal.rendered](changed);
    if (this[internal.state].selectText) {
      // Select the text in the input after giving the inner input a chance to render the value.
      setTimeout(() => {
        // Text selection might have been turned off in the interim;
        // double-check that we still want to select text.
        if (this[internal.state].selectText) {
          /** @type {any} */
          const cast = this[internal.ids].input;
          const value = cast.value;
          if (value > "") {
            cast.selectionStart = 0;
            cast.selectionEnd = cast.value.length;
          }
        }
      });
    }
  }

  [internal.stateEffects](state, changed) {
    const effects = super[internal.stateEffects](state, changed);

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
    return this[internal.shadowRoot] ? this[internal.ids].input : null;
  }

  /**
   * The class or tag used to create the `input` part into which the
   * user can enter text.
   *
   * @type {PartDescriptor}
   * @default 'input'
   */
  get inputPartType() {
    return this[internal.state].inputPartType;
  }
  set inputPartType(inputPartType) {
    this[internal.setState]({ inputPartType });
  }

  [internal.keydown](/** @type {KeyboardEvent} */ event) {
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
          canceled: "Escape"
        });
        handled = true;
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return (
      handled || (super[internal.keydown] && super[internal.keydown](event))
    );
  }

  /**
   * The prompt text shown in the input if it is empty.
   *
   * @type {string}
   */
  get placeholder() {
    return this[internal.state].placeholder;
  }
  set placeholder(placeholder) {
    this[internal.setState]({ placeholder });
  }

  /**
   * The class or tag used to create the `popup-toggle` part – the
   * element that lets the user know they can open the popup.
   *
   * @type {PartDescriptor}
   * @default UpDownToggle
   */
  get popupTogglePartType() {
    return this[internal.state].popupTogglePartType;
  }
  set popupTogglePartType(popupTogglePartType) {
    this[internal.setState]({ popupTogglePartType });
  }

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);

    renderParts(this[internal.shadowRoot], this[internal.state], changed);

    if (changed.inputPartType) {
      this[internal.ids].input.addEventListener("blur", () => {
        this[internal.setState]({
          focused: false
        });
        // If we're open and lose focus, then close.
        if (this.opened) {
          this[internal.raiseChangeEvents] = true;
          this.close();
          this[internal.raiseChangeEvents] = false;
        }
      });

      this[internal.ids].input.addEventListener("focus", () => {
        this[internal.raiseChangeEvents] = true;
        this[internal.setState]({
          focused: true
        });
        this[internal.raiseChangeEvents] = false;
      });

      this[internal.ids].input.addEventListener("input", () => {
        this[internal.raiseChangeEvents] = true;
        /** @type {any} */
        const cast = this[internal.ids].input;
        const value = cast.value;
        /** @type {PlainObject} */ const changes = {
          value,
          selectText: false
        };
        if (this.closed && value > "") {
          // If user types while popup is closed, implicitly open it.
          changes.opened = true;
        }
        this[internal.setState](changes);
        this[internal.raiseChangeEvents] = false;
      });

      this[internal.ids].input.addEventListener("keydown", () => {
        this[internal.raiseChangeEvents] = true;
        this[internal.setState]({
          selectText: false
        });
        this[internal.raiseChangeEvents] = false;
      });

      // If the user clicks on the input and the popup is closed, open it.
      this[internal.ids].input.addEventListener("mousedown", event => {
        // Only process events for the main (usually left) button.
        if (/** @type {MouseEvent} */ (event).button !== 0) {
          return;
        }
        this[internal.raiseChangeEvents] = true;
        this[internal.setState]({
          selectText: false
        });
        if (this.closed && !this.disabled) {
          this.open();
        }
        this[internal.raiseChangeEvents] = false;
      });
    }

    if (changed.popupTogglePartType) {
      const popupToggle = this[internal.ids].popupToggle;
      const input = this[internal.ids].input;
      popupToggle.addEventListener("mousedown", event => {
        // Only process events for the main (usually left) button.
        if (/** @type {MouseEvent} */ (event).button !== 0) {
          return;
        }
        // Ignore mousedown if we're presently disabled.
        if (this[internal.state].disabled) {
          event.preventDefault();
          return;
        }
        this[internal.raiseChangeEvents] = true;
        this.toggle();
        this[internal.raiseChangeEvents] = false;
      });
      if (popupToggle instanceof HTMLElement && input instanceof HTMLElement) {
        // Forward focus for new toggle button.
        forwardFocus(popupToggle, input);
      }
    }

    if (changed.popupPartType) {
      const popup = this[internal.ids].popup;
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
          flexDirection: "column"
        });
      }
      if ("closeOnWindowResize" in popup) {
        cast.closeOnWindowResize = false;
      }
    }

    if (changed.ariaLabel) {
      this[internal.ids].input.setAttribute(
        "aria-label",
        this[internal.state].ariaLabel
      );
    }

    if (changed.disabled) {
      const { disabled } = this[internal.state];
      /** @type {any} */ (this[internal.ids].input).disabled = disabled;
      /** @type {any} */ (this[internal.ids].popupToggle).disabled = disabled;
    }

    if (changed.placeholder) {
      const { placeholder } = this[internal.state];
      /** @type {any} */ (this[internal.ids].input).placeholder = placeholder;
    }

    // Tell the toggle which direction it should point to depending on which
    // direction the popup will open.
    if (changed.popupPosition || changed.popupTogglePartType) {
      const { popupPosition } = this[internal.state];
      const direction = popupPosition === "below" ? "down" : "up";
      /** @type {any} */ const popupToggle = this[internal.ids].popupToggle;
      if ("direction" in popupToggle) {
        popupToggle.direction = direction;
      }
    }

    if (changed.rightToLeft) {
      const { rightToLeft } = this[internal.state];
      // We want to style the inner input if it's been created with
      // WrappedStandardElement, otherwise style the input directly.
      const cast = /** @type {any} */ (this[internal.ids].input);
      const input = "inner" in cast ? cast.inner : cast;
      Object.assign(input.style, {
        paddingBottom: "2px",
        paddingLeft: rightToLeft ? "1.5em" : "2px",
        paddingRight: rightToLeft ? "2px" : "1.5em",
        paddingTop: "2px"
      });
      Object.assign(this[internal.ids].popupToggle.style, {
        left: rightToLeft ? "3px" : "",
        right: rightToLeft ? "" : "3px"
      });
    }

    if (changed.value) {
      const { value } = this[internal.state];
      /** @type {any} */ (this[internal.ids].input).value = value;
    }
  }

  get [internal.template]() {
    const result = super[internal.template];

    // Put an input element and toggle in the source.
    const sourceSlot = result.content.querySelector('slot[name="source"]');
    if (sourceSlot) {
      sourceSlot.replaceWith(html`
        <input id="input" part="input"></input>
        <div id="popupToggle" part="popup-toggle" tabindex="-1"></div>
      `);
    }

    renderParts(result.content, this[internal.state]);

    result.content.append(
      html`
        <style>
          :host {
            outline: none;
          }

          [part~="source"] {
            background-color: inherit;
            position: relative;
          }

          [part~="input"] {
            box-sizing: border-box;
            font: inherit;
            height: 100%;
            width: 100%;
          }

          [part~="popup-toggle"] {
            bottom: 3px;
            position: absolute;
            top: 3px;
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
    return this[internal.state].value;
  }
  set value(value) {
    this[internal.setState]({ value });
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
      template.transmute(input, inputPartType);
    }
  }
  if (!changed || changed.popupTogglePartType) {
    const { popupTogglePartType } = state;
    const popupToggle = root.getElementById("popupToggle");
    if (popupToggle) {
      template.transmute(popupToggle, popupTogglePartType);
    }
  }
}

export default ComboBox;
