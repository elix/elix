import './Menu';
import { indexOfItemContainingTarget } from './utilities.js';
import { merge } from './updates';
import * as symbols from './symbols.js';
import AriaListMixin from './AriaListMixin.js';
import PopupSource from './PopupSource.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotItemsMixin from './SlotItemsMixin.js';


const Base = 
  AriaListMixin(
  SingleSelectionMixin(
  SlotItemsMixin(
    PopupSource
  )));


class MenuButton extends Base {

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
    this.$.menu.addEventListener('mouseup', event => {
      // We only want to listen to events coming from the menu. (Without this,
      // clicking popup button opens popup then immediately closes it.)
      const target = event.target;
      if (target !== this.$.menu) {
        this[symbols.raiseChangeEvents] = true;
        this.close(this.state.menuSelectedIndex);
        this[symbols.raiseChangeEvents] = false;
      }
    });
    this.$.menu.addEventListener('selected-index-changed', event => {
      this.setState({
        menuSelectedIndex: event.detail.selectedIndex
      });
    });
    this.$.popup.addEventListener('focus', event => {
      const newFocusedElement = event.relatedTarget || document.activeElement;
      if (newFocusedElement === this.$.menu) {
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

  // The index that will be selected by default when the menu opens.
  get defaultMenuSelectedIndex() {
    return -1;
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      itemRole: 'menuitem',
      menuSelectedIndex: -1,
      role: 'button',
      selectedItem: null
    });
  }

  itemSelected(item) {
    /**
     * Raised when the user selects a menu item.
     * 
     * @event MenuButton#menu-item-selected
     */
    const event = new CustomEvent('menu-item-selected', {
      detail: {
        selectedItem: item
      }
    });
    this.dispatchEvent(event);
  }

  [symbols.keydown](event) {
    let handled;
    switch (event.key) {
      // When open, Enter closes popup.
      case 'Enter':
        if (this.opened) {
          this.close(this.state.menuSelectedIndex);
          handled = true;
        }
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
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
    if (state.opened && !this.opened) {
      // Opening
      if (state.selectedItem) {
        // Clear any previously selected item.
        state.selectedItem = null;
        result = false;
      }
      // Select the default item in the menu.
      const defaultMenuSelectedIndex = this.defaultMenuSelectedIndex;
      if (state.menuSelectedIndex !== defaultMenuSelectedIndex) {
        state.menuSelectedIndex = defaultMenuSelectedIndex;
        result = false;
      }
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
    const base = super.updates;
    const outline = base && base.style && base.style.outline;
    return merge(base, {
      attributes: {
        'aria-haspopup': true
      },
      $: {
        menu: {
          style: {
            border: 'none',
            outline
          },
          selectedIndex: this.state.menuSelectedIndex
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


export default MenuButton;
customElements.define('elix-menu-button', MenuButton);
