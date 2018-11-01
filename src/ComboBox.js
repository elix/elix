import './SeamlessButton.js';
import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import KeyboardMixin from './KeyboardMixin.js';
import PopupSource from './PopupSource.js';


const Base =
  KeyboardMixin(
    PopupSource
  );


/**
 * @elementrole {'input'} input
 */
class ComboBox extends Base {

  [symbols.beforeUpdate]() {
    if (super[symbols.beforeUpdate]) { super[symbols.beforeUpdate](); }
    if (this[symbols.renderedRoles].inputRole !== this.state.inputRole) {
      template.transmute(this.$.input, this.state.inputRole);

      this.$.input.addEventListener('blur', () => {
        // If we're open and lose focus, then close.
        if (this.opened) {
          this[symbols.raiseChangeEvents] = true;
          this.close();
          this[symbols.raiseChangeEvents] = false;
        }
      });
  
      this.$.input.addEventListener('input', () => {
        this[symbols.raiseChangeEvents] = true;
        const value = this.$.input.value;
        this.setState({ value });
        this[symbols.raiseChangeEvents] = false;
      })
  
      // If the user clicks on the input and the popup is closed, open it.
      // TODO: Review whether we should keep this.
      this.$.input.addEventListener('mousedown', () => {
        this[symbols.raiseChangeEvents] = true;
        if (this.closed) {
          this.open();
        }
        this[symbols.raiseChangeEvents] = false;
      });
  
      this[symbols.renderedRoles].inputRole = this.state.inputRole;
    }
  }

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }

    this.$.toggleButton.addEventListener('mousedown', event => {
      this[symbols.raiseChangeEvents] = true;
      this.toggle();
      this.$.input.focus();
      // The toggle button may try to grab focus by default; we prevent that to
      // keep the focus on the input, and to avoid having PopupModalityMixin
      // immediately close the popup if the button gets focus.
      event.preventDefault();
      event.stopPropagation();
      this[symbols.raiseChangeEvents] = false;
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      horizontalAlign: 'stretch',
      inputRole: 'input',
      orientation: 'vertical',
      role: 'combobox',
      sourceRole: 'div',
      tabindex: null,
      value: '',
    });
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
    
      // Escape closes popup.
      case 'Enter':
      case 'Escape':
        this.close();
        handled = true;
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
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
      <elix-seamless-button id="toggleButton" tabindex="-1">
        <svg id="downIcon" xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5">
          <path d="M 0 0 l5 5 5 -5 z"/>
        </svg>
        <svg id="upIcon" xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5">
          <path d="M 0 5 l5 -5 5 5 z"/>
        </svg>
      </elix-seamless-button>
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
        }

        #toggleButton {
          align-items: center;
          bottom: 3px;
          display: flex;
          padding: 2px;
          position: absolute;
          right: 3px;
          top: 3px;
          width: 1.5em;
        }

        #toggleButton:hover {
          background: #eee;
        }
      </style>
    `;
    result.content.appendChild(styleTemplate.content);

    return result;
  }

  // TODO: Refactor arrow stuff and share with MenuButton.
  get updates() {
    const base = super.updates;
    const popupPosition = this.state.popupPosition;
    const value = this.value;
    const role = this.state.original && this.state.original.attributes.role ||
      base.attributes && base.attributes.role ||
      this.state.role;
    
    // We want to style the inner input if it's been created with
    // WrappedStandardElement, otherwise style the input directly.
    const hasInnerInput = 'inner' in this.$.input;
    const inputUpdates = {
      style: {
        padding: '2px 1.5em 2px 2px'
      }
    }

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
            value,
            inner: {

            }
          },
          popup: {
            autoFocus: false,
            backdrop: {
              style: {
                // TODO: Would be better if we could set backdropRole to null
                display: 'none'
              }
            },
            frame: {
              style: {
                display: 'flex'
              }
            },
            style: {
              'flex-direction': 'column'
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
