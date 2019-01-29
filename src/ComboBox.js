import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import KeyboardMixin from './KeyboardMixin.js';
import PopupSource from './PopupSource.js';
import SeamlessButton from './SeamlessButton.js';


const Base =
  KeyboardMixin(
    PopupSource
  );


/**
 * A text input paired with a popup that can be used as an alternative to typing
 * 
 * @inherits PopupSource
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

  [symbols.beforeUpdate]() {
    if (super[symbols.beforeUpdate]) { super[symbols.beforeUpdate](); }
    if (this[symbols.renderedRoles].inputRole !== this.state.inputRole) {
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
  
      this[symbols.renderedRoles].inputRole = this.state.inputRole;
    }

    if (this[symbols.renderedRoles].toggleButtonRole !== this.state.toggleButtonRole) {
      template.transmute(this.$.toggleButton, this.state.toggleButtonRole);
      this.$.toggleButton.addEventListener('mousedown', () => {
        this[symbols.raiseChangeEvents] = true;
        this.toggle();
        this[symbols.raiseChangeEvents] = false;
      });
      this[symbols.renderedRoles].toggleButtonRole = this.state.toggleButtonRole;
    }
  }

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
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
      horizontalAlign: 'left',
      inputRole: 'input',
      orientation: 'vertical',
      placeholder: '',
      role: 'combobox',
      selectText: false,
      sourceRole: 'div',
      tabindex: null,
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

  get [symbols.focusTarget]() {
    return this.$.input;
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

      // Up/Down arrow keys open the popup.
      case 'ArrowDown':
      case 'ArrowUp':
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

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, ComboBox, symbols.template);

    // Use an input element in the source.
    const sourceSlot = result.content.querySelector('slot[name="source"]');
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

    const styleTemplate = template.html`
      <style>
        #source {
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
      </style>
    `;
    result.content.appendChild(styleTemplate.content);

    return result;
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

  get updates() {
    const base = super.updates;
    const { disabled, placeholder, popupPosition, value } = this.state;
    const role = this.state.original && this.state.original.attributes.role ||
      base.attributes && base.attributes.role ||
      this.state.role;

    // We want to style the inner input if it's been created with
    // WrappedStandardElement, otherwise style the input directly.
    const hasInnerInput = 'inner' in this.$.input;
    const inputUpdates = {
      style: {
        'padding-bottom': '2px',
        'padding-left': this[symbols.rightToLeft] ? '1.5em' : '2px',
        'padding-right': this[symbols.rightToLeft] ? '2px' : '1.5em',
        'padding-top': '2px'
      }
    };

    return merge(
      base,
      {
        attributes: {
          role
        },
        $: {
          downIcon: {
            style: {
              display: popupPosition === 'below' ? 'block' : 'none',
              fill: 'currentColor',
              margin: '0.25em'
            }
          },
          input: {
            attributes: {
              'aria-label': this.state.ariaLabel
            },
            disabled,
            placeholder,
            value
          },
          popup: Object.assign(
            {
              attributes: {
                tabindex: null
              },
              autoFocus: false,
              backdrop: {
                style: {
                  // TODO: Would be better if we could set backdropRole to null
                  display: 'none'
                }
              },
              frame: {
                style: {
                  display: 'flex',
                  'flex-direction': 'column'
                }
              },
              style: {
                'flex-direction': 'column'
              }
            },
            'closeOnWindowResize' in this.$.popup && {
              closeOnWindowResize: false
            },  
          ),
          source: {
            style: {
              'background-color': null,
              color: null
            }
          },
          toggleButton: {
            disabled,
            style: {
              left: this[symbols.rightToLeft] ? '3px' : '',
              right: this[symbols.rightToLeft] ? '' : '3px',
            }
          },
          upIcon: {
            style: {
              display: popupPosition === 'above' ? 'block' : 'none',
              fill: 'currentColor',
              margin: '0.25em'
            }
          }
        }
      },
      hasInnerInput && {
        $: {
          input: {
            inner: inputUpdates
          }
        }
      },
      !hasInnerInput && {
        $: {
          input: inputUpdates
        }
      }
    );
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
