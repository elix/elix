import './Menu';
import PopupSource from './PopupSource.js';
import * as symbols from './symbols.js';
import { merge } from './updates';


class PopupMenuButton extends PopupSource {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.popup.addEventListener('focus', event => {
      if (event.relatedTarget === this.$.menu) {
        // User pressed Shift+Tab from menu.
        this.close();
      } else {
        this.$.menu.focus();
      }
    });
  }
  
  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }

    if (this.state.opened !== previousState.opened && this[symbols.raiseChangeEvents] &&
        this.state.selectedItem) {
      this.itemSelected(this.state.selectedItem);
    }
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectedItem: null
    });
  }

  itemSelected(item) {
    /**
     * Raised when the user selects a menu item.
     * 
     * @event PopupMenuButton#menu-item-selected
     */
    const event = new CustomEvent('menu-item-selected', {
      detail: {
        selectedItem: item
      }
    });
    this.dispatchEvent(event);
  }

  get sourceTemplate() {
    const base = super.sourceTemplate;
    return base.replace('<slot name="source"></slot>', `
      <div id="valueContainer">
        <slot name="source"></slot>
      </div>
      <slot name="popupIndicator">
        <svg id="downIcon" xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5">
          <path d="M 0 0 l5 5 5 -5 z"/>
        </svg>
        <svg id="upIcon" xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5">
          <path d="M 0 5 l5 -5 5 5 z"/>
        </svg>
      </slot>
    `);
  }

  get popupTemplate() {
    const base = super.popupTemplate;
    const template = base.replace('<slot></slot>', `
      <elix-menu id="menu">
        <slot></slot>
      </elix-menu>
    `);
    return template;
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    if (state.opened && !this.opened && state.selectedItem) {
      // Clear any previously selected item.
      Object.assign(state, {
        selectedItem: null
      });
      result = false;
    }
    return result;
  }

  get updates() {
    const popupPosition = this.state.popupPosition;
    return merge(super.updates, {
      attributes: {
        'aria-haspopup': true
      },
      $: {
        downIcon: {
          style: {
            display: popupPosition === 'below' ? 'block' : 'none',
            fill: 'currentColor',
            'margin-left': '0.25em',
          }
        },
        source: {
          style: {
            'align-items': 'center',
            display: 'flex'
          }
        },
        upIcon: {
          style: {
            display: popupPosition === 'above' ? 'block' : 'none',
            fill: 'currentColor',
            'margin-left': '0.25em',
          }
        }
      }
    });
  }

}


export default PopupMenuButton;
customElements.define('elix-popup-menu-button', PopupMenuButton);
