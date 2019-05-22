import { forwardFocus } from './utilities.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import AriaRoleMixin from './AriaRoleMixin.js';
import DelegateFocusMixin from './DelegateFocusMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import PopupSource from './PopupSource.js';
import SeamlessButton from './SeamlessButton.js';


const Base =
  AriaRoleMixin(
  DelegateFocusMixin(
  KeyboardMixin(
    PopupSource
  )));


/**
 * A text input paired with a popup that can be used as an alternative to typing
 * 
 * @inherits PopupSource
 * @mixes AriaRoleMixin
 * @mixes DelegateFocusMixin
 * @mixes KeyboardMixin
 * @elementrole {'input'} input
 * @elementrole {'div'} source
 * @elementrole {SeamlessButton} toggleButton
 */
class ComboBox extends Base {
  
  // Forward any ARIA label to the input element.
  get ariaLabel() {
    return this.state.ariaLabel;
  }
  set ariaLabel(ariaLabel) {
    this.setState({ ariaLabel });
  }

  componentDidUpdate(changed) {
    super.componentDidUpdate(changed);
    if (this.state.selectText) {
      // Select the text in the input after giving the inner input a chance to render the value.
      setTimeout(() => {
        // Text selection might have been turned off in the interim;
        // double-check that we still want to select text.
        if (this.state.selectText) {
          /** @type {any} */
          const cast = this.$.input;
          const value = cast.value;
          if (value > '') {
            cast.selectionStart = 0;
            cast.selectionEnd = cast.value.length;
          }
        }
      });
    }
  }

  get defaultState() {

    const state = Object.assign(super.defaultState, {
      ariaLabel: '',
      focused: false,
      inputRole: 'input',
      orientation: 'vertical',
      placeholder: '',
      role: 'combobox',
      selectText: false,
      sourceRole: 'div',
      toggleButtonRole: SeamlessButton,
      value: '',
    });

    // Select text on closing.
    // Exception: on mobile devices, leaving the text selected may show
    // selection handles, which may suggest to the user that there's something
    // more they should be doing with the text even though they're done with it.
    // We therefore avoid leaving text selected if an on-screen keyboard is in
    // use. Since we can't actually detect that, we use the absence of a
    // fine-grained pointer (mouse) as a proxy for mobile.
    state.onChange(['opened'], (state) => {
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
    return this.shadowRoot ?
      this.$.input :
      null;
  }

  /**
   * The class, tag, or template used to create the input element.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default 'input'
   */
  get inputRole() {
    return this.state.inputRole;
  }
  set inputRole(inputRole) {
    this.setState({ inputRole });
  }

  [symbols.keydown](event) {
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
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
  }

  /**
   * The prompt text shown in the input if it is empty.
   * 
   * @type {string}
   */
  get placeholder() {
    return this.state.placeholder;
  }
  set placeholder(placeholder) {
    this.setState({
      placeholder
    });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.inputRole) {
      template.transmute(this.$.input, this.state.inputRole);

      this.$.input.addEventListener('blur', () => {
        // If we're open and lose focus, then close.
        if (this.opened) {
          this[symbols.raiseChangeEvents] = true;
          this.setState({
            focused: false
          });
          this.close();
          this[symbols.raiseChangeEvents] = false;
        }
      });
  
      this.$.input.addEventListener('focus', () => {
        this[symbols.raiseChangeEvents] = true;
        this.setState({
          focused: true
        });
        this[symbols.raiseChangeEvents] = false;
      });

      this.$.input.addEventListener('input', () => {
        this[symbols.raiseChangeEvents] = true;
        /** @type {any} */
        const cast = this.$.input;
        const value = cast.value;
        const changes = {
          value,
          selectText: false
        };
        if (this.closed && value > '') {
          // If user types while popup is closed, implicitly open it.
          changes.opened = true
        }
        this.setState(changes);
        this[symbols.raiseChangeEvents] = false;
      })

      this.$.input.addEventListener('keydown', () => {
        this[symbols.raiseChangeEvents] = true;
        this.setState({
          selectText: false
        });
        this[symbols.raiseChangeEvents] = false;
      })
  
      // If the user clicks on the input and the popup is closed, open it.
      this.$.input.addEventListener('mousedown', () => {
        this[symbols.raiseChangeEvents] = true;
        this.setState({
          selectText: false
        });
        if (this.closed && !this.disabled) {
          this.open();
        }
        this[symbols.raiseChangeEvents] = false;
      });
    }
    if (changed.toggleButtonRole) {
      template.transmute(this.$.toggleButton, this.state.toggleButtonRole);
      this.$.toggleButton.addEventListener('mousedown', () => {
        this[symbols.raiseChangeEvents] = true;
        this.toggle();
        this[symbols.raiseChangeEvents] = false;
      });
      if (this.$.toggleButton instanceof HTMLElement &&
          this.$.input instanceof HTMLElement) {
        // Forward focus for new toggle button.
        forwardFocus(this.$.toggleButton, this.$.input);
      }
    }
    if (changed.popupRole) {
      const popup = this.$.popup;
      popup.removeAttribute('tabindex');
      if ('autoFocus' in popup) {
        /** @type {any} */ (popup).autoFocus = false;
      }
      // TODO: Would be better if we could set backdropRole to null
      const backdrop = /** @type {any} */ (popup).backdrop;
      if (backdrop) {
        backdrop.style.display = 'none';
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
      this.$.input.setAttribute('aria-label', this.state.ariaLabel);
    }
    if (changed.disabled) {
      const { disabled } = this.state;
      /** @type {any} */ (this.$.input).disabled = disabled;
      /** @type {any} */ (this.$.toggleButton).disabled = disabled;
    }
    if (changed.placeholder) {
      const { placeholder } = this.state;
      /** @type {any} */ (this.$.input).placeholder = placeholder;
    }
    if (changed.popupPosition) {
      const { popupPosition } = this.state;
      this.$.downIcon.style.display = popupPosition === 'below' ?
        'block' :
        'none';
      this.$.upIcon.style.display = popupPosition === 'above' ?
        'block' :
        'none';
    }
    if (changed.rightToLeft) {
      const { rightToLeft } = this.state;
      // We want to style the inner input if it's been created with
      // WrappedStandardElement, otherwise style the input directly.
      const cast = /** @type {any} */ (this.$.input);
      const input = 'inner' in cast ?
        cast.inner :
        cast;
      Object.assign(input.style, {
        paddingBottom: '2px',
        paddingLeft: rightToLeft ? '1.5em' : '2px',
        paddingRight: rightToLeft ? '2px' : '1.5em',
        paddingTop: '2px'
      });
      Object.assign(this.$.toggleButton.style, {
        left: rightToLeft ? '3px' : '',
        right: rightToLeft ? '' : '3px'
      });
    }
    if (changed.value) {
      const { value } = this.state;
      /** @type {any} */ (this.$.input).value = value;
    }
  }

  get [symbols.template]() {
    const base = super[symbols.template];

    // Use an input element in the source.
    const sourceSlot = base.content.querySelector('slot[name="source"]');
    if (!sourceSlot) {
      throw `Couldn't find slot with name "source".`;
    }
    const sourceTemplate = template.html`
      <input id="input"></input>
      <button id="toggleButton" tabindex="-1">
        <svg id="downIcon" xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5">
          <path d="M 0 0 l5 5 5 -5 z"/>
        </svg>
        <svg id="upIcon" xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5">
          <path d="M 0 5 l5 -5 5 5 z"/>
        </svg>
      </button>
    `;
    template.replace(sourceSlot, sourceTemplate.content);

    return template.concat(base, template.html`
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
          font-family: inherit;
          font-size: inherit;
          font-style: inherit;
          font-weight: inherit;
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
          overflow: hidden;
        }
      </style>
    `);
  }

  /**
   * The class, tag, or template used to create the button that toggles the
   * popup.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default SeamlessButton
   */
  get toggleButtonRole() {
    return this.state.toggleButtonRole;
  }
  set toggleButtonRole(toggleButtonRole) {
    this.setState({ toggleButtonRole });
  }

  get value() {
    return this.state.value;
  }
  set value(value) {
    this.setState({ value });
  }

}


export default ComboBox;
customElements.define('elix-combo-box', ComboBox);
