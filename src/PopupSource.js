import './Popup.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import KeyboardMixin from './KeyboardMixin.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';


const Base =
  KeyboardMixin(
  OpenCloseMixin(
    ReactiveElement
  ));


class PopupSource extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.button.addEventListener('mousedown', event => {
      if (!this.opened) {
        setTimeout(() => {
          this[symbols.raiseChangeEvents] = true;
          this.open()
          this[symbols.raiseChangeEvents] = false;
        });
        event.stopPropagation();
        event.preventDefault();
      }
    });
    this.$.popup.addEventListener('opened-changed', event => {
      /** @type {any} */ 
      const cast = event;
      const opened = cast.detail.opened;
      if (opened !== this.opened) {
        this[symbols.raiseChangeEvents] = true;
        this.opened = opened;
        this[symbols.raiseChangeEvents] = false;
      }
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      horizontalAlign: 'left',
      preferredPosition: 'below'
    });
  }

  // TODO: 'start', 'end'
  get horizontalAlign() {
    return this.state.horizontalAlign;
  }
  set horizontalAlign(horizontalAlign) {
    this.setState({
      horizontalAlign
    });
  }

  [symbols.keydown](event) {
    let handled;
    switch (event.key) {
      // Pressing Enter or Space opens the popup.
      case 'Enter':
      case ' ':
        this.open();
        handled = true;
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
  }

  get preferredPosition() {
    return this.state.preferredPosition;
  }
  set preferredPosition(preferredPosition) {
    this.setState({
      preferredPosition
    });
  }

  // TODO: Tags for popup and source
  get [symbols.template]() {
    return `
      <style>
        :host {
          display: inline-block;
          position: relative;
        }

        #button {
          background-color: transparent;
          border-style: solid;
          display: block;
        }

        #popupContainer {
          height: 0;
          position: absolute;
          width: 100%;
        }

        #popup {
          align-items: initial;
          flex-direction: initial;
          height: initial;
          justify-content: initial;
          left: initial;
          position: absolute;
          top: initial;
          width: initial;
        }
      </style>
      <button id="button" tabindex="-1">
        <slot></slot>
      </button>
      <div id="popupContainer">
        <elix-popup id="popup">
          <slot name="popup"></slot>
        </elix-popup>
      </div>
    `;
  }

  // TODO: Pressed state for button
  get updates() {

    const buttonStyle = {
      'background-color': this.state.opened ? 'highlight' : ''
    };

    const positionBelow = this.state.preferredPosition === 'below';

    const popupContainerStyle = positionBelow ?
      {
        bottom: '',
        position: 'relative',
        top: ''
      } :
      {
        bottom: 0,
        position: 'absolute',
        top: 0
      };
    
    const popupStyle = positionBelow ?
      {
        bottom: ''
      } :
      {
        bottom: 0
      };
    
    const horizontalAlign = this.state.horizontalAlign;
    popupStyle.left = horizontalAlign === 'left' || horizontalAlign === 'stretch' ?
      '0' :
      '';
    popupStyle.right = horizontalAlign === 'right' || horizontalAlign === 'stretch' ?
      '0' :
      '';

    return merge(super.updates, {
      $: {
        button: {
          style: buttonStyle
        },
        popup: {
          opened: this.state.opened,
          style: popupStyle
        },
        popupContainer: {
          style: popupContainerStyle
        }
      }
    });
  }

}


export default PopupSource;
customElements.define('elix-popup-source', PopupSource);
