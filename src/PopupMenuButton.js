import './Menu';
import { merge } from './updates';
import { indexOfItemContainingTarget } from './utilities.js';
import * as symbols from './symbols.js';
import PopupSource from './PopupSource.js';


class PopupMenuButton extends PopupSource {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    // If user hovers mouse over an item, select it.
    this.addEventListener('mousemove', event => {
      const hoverIndex = indexOfItemContainingTarget(this, event.target);
      if (hoverIndex >= 0 && hoverIndex !== this.state.menuSelectedIndex) {
        this[symbols.raiseChangeEvents] = true;
        this.setState({
          menuSelectedIndex: hoverIndex
        });
        this[symbols.raiseChangeEvents] = false;
      }
    });
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

  get sourceSlotContent() {
    // Default "..." icon from Google Material Design icons.
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
    `;
  }

  get updates() {
    return merge(super.updates, {
      attributes: {
        'aria-haspopup': true
      },
      $: {
        menu: {
          style: {
            border: 'none'
          }
        },
        source: {
          style: {
            'align-items': 'center',
            display: 'flex'
          }
        }
      }
    });
  }

}


export default PopupMenuButton;
customElements.define('elix-popup-menu-button', PopupMenuButton);
