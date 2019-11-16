import { forwardFocus } from './utilities.js';
import * as internal from './internal.js';
import * as template from './template.js';
import AriaRoleMixin from './AriaRoleMixin.js';
import DelegateFocusMixin from './DelegateFocusMixin.js';
import Hidden from './Hidden.js';
import KeyboardMixin from './KeyboardMixin.js';
import PopupSource from './PopupSource.js';
import SeamlessButton from './SeamlessButton.js';
import FormElementMixin from './FormElementMixin.js';

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
 * @part down-icon - the icon shown in the toggle button if the popup will open or close in the down direction
 * @part {input} input - the text input element
 * @part {div} source
 * @part {SeamlessButton} toggle-button - the button that toggles the popup
 * @part up-icon - the icon shown in the toggle button if the popup will open or close in the up direction
 */
class ComboBox extends Base {
  // Forward any ARIA label to the input element.
  get ariaLabel() {
    return this[internal.state].ariaLabel;
  }
  set ariaLabel(ariaLabel) {
    this[internal.setState]({ ariaLabel });
  }

  [internal.componentDidUpdate](/** @type {PlainObject} */ changed) {
    super[internal.componentDidUpdate](changed);
    if (this[internal.state].selectText) {
      // Select the text in the input after giving the inner input a chance to render the value.
      setTimeout(() => {
        // Text selection might have been turned off in the interim;
        // double-check that we still want to select text.
        if (this[internal.state].selectText) {
          /** @type {any} */
          const cast = this[internal.ids].input;
          const value = cast.value;
          if (value > '') {
            cast.selectionStart = 0;
            cast.selectionEnd = cast.value.length;
          }
        }
      });
    }
  }

  get [internal.defaultState]() {
    const state = Object.assign(super[internal.defaultState], {
      ariaLabel: '',
      backdropPartType: Hidden,
      focused: false,
      inputPartType: 'input',
      orientation: 'vertical',
      placeholder: '',
      role: 'combobox',
      selectText: false,
      sourcePartType: 'div',
      toggleButtonPartType: SeamlessButton,
      value: ''
    });

    // Select text on closing.
    // Exception: on mobile devices, leaving the text selected may show
    // selection handles, which may suggest to the user that there's something
    // more they should be doing with the text even though they're done with it.
    // We therefore avoid leaving text selected if an on-screen keyboard is in
    // use. Since we can't actually detect that, we use the absence of a
    // fine-grained pointer (mouse) as a proxy for mobile.
    state.onChange(['opened'], state => {
      if (!state.opened) {
        const probablyMobile = matchMedia('(pointer: coarse)').matches;
        const selectText = !probablyMobile;
        return {
          selectText
        };
      }
      return null;
    });

    return state;
  }

  /**
   * The combo box's input element.
   *
   * @type {Element|null}
   */
  get input() {
    return this.shadowRoot ? this[internal.ids].input : null;
  }

  /**
   * The class, tag, or template used to create the `input` part into which the
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
      case 'ArrowDown':
      case 'ArrowUp':
      case 'PageDown':
      case 'PageUp':
        if (this.closed) {
          this.open();
          handled = true;
        }
        break;

      case 'Enter':
        this.close();
        handled = true;
        break;

      // Escape closes popup and indicates why.
      case 'Escape':
        this.close({
          canceled: 'Escape'
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

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.inputPartType) {
      template.transmute(
        this[internal.ids].input,
        this[internal.state].inputPartType
      );

      this[internal.ids].input.addEventListener('blur', () => {
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

      this[internal.ids].input.addEventListener('focus', () => {
        this[internal.raiseChangeEvents] = true;
        this[internal.setState]({
          focused: true
        });
        this[internal.raiseChangeEvents] = false;
      });

      this[internal.ids].input.addEventListener('input', () => {
        this[internal.raiseChangeEvents] = true;
        /** @type {any} */
        const cast = this[internal.ids].input;
        const value = cast.value;
        /** @type {PlainObject} */ const changes = {
          value,
          selectText: false
        };
        if (this.closed && value > '') {
          // If user types while popup is closed, implicitly open it.
          changes.opened = true;
        }
        this[internal.setState](changes);
        this[internal.raiseChangeEvents] = false;
      });

      this[internal.ids].input.addEventListener('keydown', () => {
        this[internal.raiseChangeEvents] = true;
        this[internal.setState]({
          selectText: false
        });
        this[internal.raiseChangeEvents] = false;
      });

      // If the user clicks on the input and the popup is closed, open it.
      this[internal.ids].input.addEventListener('mousedown', () => {
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
    if (changed.toggleButtonPartType) {
      template.transmute(
        this[internal.ids].toggleButton,
        this[internal.state].toggleButtonPartType
      );
      this[internal.ids].toggleButton.addEventListener('mousedown', () => {
        this[internal.raiseChangeEvents] = true;
        this.toggle();
        this[internal.raiseChangeEvents] = false;
      });
      if (
        this[internal.ids].toggleButton instanceof HTMLElement &&
        this[internal.ids].input instanceof HTMLElement
      ) {
        // Forward focus for new toggle button.
        forwardFocus(this[internal.ids].toggleButton, this[internal.ids].input);
      }
    }
    if (changed.popupPartType) {
      const popup = this[internal.ids].popup;
      popup.removeAttribute('tabindex');
      if ('autoFocus' in popup) {
        /** @type {any} */ (popup).autoFocus = false;
      }
      const frame = /** @type {any} */ (popup).frame;
      if (frame) {
        Object.assign(frame.style, {
          display: 'flex',
          flexDirection: 'column'
        });
      }
      if ('closeOnWindowResize' in popup) {
        /** @type {any} */ (popup).closeOnWindowResize = false;
      }
    }
    if (changed.ariaLabel) {
      this[internal.ids].input.setAttribute(
        'aria-label',
        this[internal.state].ariaLabel
      );
    }
    if (changed.disabled) {
      const { disabled } = this[internal.state];
      /** @type {any} */ (this[internal.ids].input).disabled = disabled;
      /** @type {any} */ (this[internal.ids].toggleButton).disabled = disabled;
    }
    if (changed.placeholder) {
      const { placeholder } = this[internal.state];
      /** @type {any} */ (this[internal.ids].input).placeholder = placeholder;
    }
    if (changed.popupPosition) {
      const { popupPosition } = this[internal.state];
      const showDown = popupPosition === 'below';
      this[internal.ids].downIcon.style.display = showDown ? 'block' : 'none';
      this[internal.ids].upIcon.style.display = showDown ? 'none' : 'block';
    }
    if (changed.rightToLeft) {
      const { rightToLeft } = this[internal.state];
      // We want to style the inner input if it's been created with
      // WrappedStandardElement, otherwise style the input directly.
      const cast = /** @type {any} */ (this[internal.ids].input);
      const input = 'inner' in cast ? cast.inner : cast;
      Object.assign(input.style, {
        paddingBottom: '2px',
        paddingLeft: rightToLeft ? '1.5em' : '2px',
        paddingRight: rightToLeft ? '2px' : '1.5em',
        paddingTop: '2px'
      });
      Object.assign(this[internal.ids].toggleButton.style, {
        left: rightToLeft ? '3px' : '',
        right: rightToLeft ? '' : '3px'
      });
    }
    if (changed.value) {
      const { value } = this[internal.state];
      /** @type {any} */ (this[internal.ids].input).value = value;
    }
  }

  get [internal.template]() {
    const base = super[internal.template];

    // Use an input element in the source.
    const sourceSlot = base.content.querySelector('slot[name="source"]');
    if (!sourceSlot) {
      throw `Couldn't find slot with name "source".`;
    }
    const sourceTemplate = template.html`
      <input id="input" part="input"></input>
      <button id="toggleButton" part="toggle-button" tabindex="-1">
        <svg id="downIcon" part="down-icon" xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5">
          <path d="M 0 0 l5 5 5 -5 z"/>
        </svg>
        <svg id="upIcon" part="up-icon" xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5">
          <path d="M 0 5 l5 -5 5 5 z"/>
        </svg>
      </button>
    `;
    template.replace(sourceSlot, sourceTemplate.content);

    return template.concat(
      base,
      template.html`
      <style>
        :host {
          outline: none;
        }

        #source {
          background-color: inherit;
          position: relative;
        }

        #input {
          box-sizing: border-box;
          font: inherit;
          height: 100%;
          width: 100%;
        }

        #toggleButton {
          align-items: center;
          bottom: 3px;
          display: flex;
          padding: 0;
          position: absolute;
          top: 3px;
          width: 1.5em;
        }

        #toggleButton[disabled] {
          opacity: 0.5;
        }

        #toggleButton:not([disabled]):hover {
          background: #eee;
        }

        #downIcon,
        #upIcon {
          fill: currentColor;
          margin: 0.25em;
        }

        #popup {
          flex-direction: column;
          max-height: 100vh;
          max-width: 100vh;
        }
      </style>
    `
    );
  }

  /**
   * The class, tag, or template used to create the `toggle-button` part – the
   * button that toggles the popup.
   *
   * @type {PartDescriptor}
   * @default SeamlessButton
   */
  get toggleButtonPartType() {
    return this[internal.state].toggleButtonPartType;
  }
  set toggleButtonPartType(toggleButtonPartType) {
    this[internal.setState]({ toggleButtonPartType });
  }

  get value() {
    return this[internal.state].value;
  }
  set value(value) {
    this[internal.setState]({ value });
  }
}

export default ComboBox;
