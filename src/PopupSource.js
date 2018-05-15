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
      const opened = event.detail.opened;
      if (opened !== this.opened) {
        this[symbols.raiseChangeEvents] = true;
        this.opened = opened;
        this[symbols.raiseChangeEvents] = false;
      }
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

  // TODO: Tags for popup and source
  get [symbols.template]() {
    return `
      <button id="button" tabindex="-1">
        <slot></slot>
      </button>
      <elix-popup id="popup">
        <slot name="popup"></slot>
      </elix-popup>
    `;
  }

  // TODO: Pressed state for button
  get updates() {
    return merge(super.updates, {
      $: {
        popup: {
          opened: this.state.opened
        }
      }
    });
  }

}


export default PopupSource;
customElements.define('elix-popup-source', PopupSource);
