import { forwardFocus, stateChanged } from './utilities.js';
import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import KeyboardMixin from './KeyboardMixin.js';
import PopupSource from './PopupSource.js';
import SeamlessButton from './SeamlessButton.js';


const previousStateKey = Symbol('previousSelection');


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
          this.close();
          this[symbols.raiseChangeEvents] = false;
        }
      });
  
      this.$.input.addEventListener('input', () => {
        this[symbols.raiseChangeEvents] = true;
        /** @type {any} */
        const cast = this.$.input;
        const value = cast.value;
        const changes = {
          value
        };
        if (this.closed && value > '') {
          // If user types while popup is closed, implicitly open it.
          changes.opened = true
        };
        this.setState(changes);
        this[symbols.raiseChangeEvents] = false;
      })
  
      // If the user clicks on the input and the popup is closed, open it.
      this.$.input.addEventListener('mousedown', () => {
        this[symbols.raiseChangeEvents] = true;
        if (this.closed) {
          this.open();
        }
        this[symbols.raiseChangeEvents] = false;
      });
  
      this[symbols.renderedRoles].inputRole = this.state.inputRole;
    }

    if (this[symbols.renderedRoles].toggleButtonRole !== this.state.toggleButtonRole) {
      if (this.$.toggleButton instanceof HTMLElement) {
        // Stop forwarding focus of current (old) toggle button.
        forwardFocus(this.$.toggleButton, null);
      }
      template.transmute(this.$.toggleButton, this.state.toggleButtonRole);
      if (this.$.toggleButton instanceof HTMLElement &&
          this.$.input instanceof HTMLElement) {
        // Forward focus for new toggle button.
        forwardFocus(this.$.toggleButton, this.$.input);
      }
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
      // Select the text in the input.
      const value = this.value;
      if (value > "") {
        /** @type {any} */
        const cast = this.$.input;
        cast.selectionStart = 0;
        cast.selectionEnd = value.length;
      }
      this.setState({
        selectText: false
      });
    }  
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      ariaLabel: '',
      horizontalAlign: 'stretch',
      inputRole: 'input',
      orientation: 'vertical',
      role: 'combobox',
      selectText: false,
      sourceRole: 'div',
      tabindex: null,
      toggleButtonRole: SeamlessButton,
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

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    state[previousStateKey] = state[previousStateKey] || {
      opened: null
    };
    const changed = stateChanged(state, state[previousStateKey]);
    const closing = changed.opened && !state.opened;
    if (closing && !state.selectText) {
      // Select text on closing.
      state.selectText = true;
      result = false;
    }
    return result;
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
      <button id="toggleButton" focus-on-ancestor="true" tabindex="-1">
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
          width: 100%;
        }

        #toggleButton {
          align-items: center;
          bottom: 3px;
          display: flex;
          padding: 0;
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
                  display: 'flex'
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
