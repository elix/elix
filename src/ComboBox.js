import './SeamlessButton.js';
import { merge } from './updates.js';
import { getSuperProperty } from './workarounds.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import PopupSource from './PopupSource.js';


class ComboBox extends PopupSource {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.toggleButton.addEventListener('click', () => {
      this[symbols.raiseChangeEvents] = true;
      this.toggle();
      this[symbols.raiseChangeEvents] = false;
    });
    this.$.input.addEventListener('keydown', event => {
      this[symbols.raiseChangeEvents] = true;
      const handled = handleInputKeydown(this, event);
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
      this[symbols.raiseChangeEvents] = false;
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      horizontalAlign: 'stretch',
      sourceRole: 'div',
      tabindex: null
    });
  }

  get [symbols.defaultFocus]() {
    return this.$.input;
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
          padding: 2px 1.5em 2px 2px;
        }

        #toggleButton {
          align-items: center;
          bottom: 1px;
          display: flex;
          padding: 2px;
          position: absolute;
          right: 1px;
          top: 1px;
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
    const popupPosition = this.state.popupPosition;
    // const itemRole = 'itemRole' in this.$.menu ? this.state.itemRole : null;
    // const clone = this.selectedItem ?
    //   this.selectedItem.cloneNode(true) :
    //   null;
    // const childNodes = clone ? clone.childNodes : [];
    return merge(super.updates, {
      $: {
        downIcon: {
          style: {
            display: popupPosition === 'below' ? 'block' : 'none',
            fill: 'currentColor',
            margin: '0.25em'
          }
        },
        // menu: Object.assign(
        //   {
        //     style: {
        //       padding: 0
        //     },
        //   },
        //   itemRole ? { itemRole } : null
        // ),
        popup: {
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
        },
        // value: {
        //   childNodes
        // }
      }
    });
  }

}


function handleInputKeydown(element, event) {
  let handled;
  switch (event.key) {

    // Up/Down arrow keys open the popup.
    case 'ArrowDown':
    case 'ArrowUp':
      if (element.closed) {
        element.open();
        handled = true;
      }
      break;
  }

  return handled;
}


export default ComboBox;
customElements.define('elix-combo-box', ComboBox);
