import './Menu';
import { indexOfItemContainingTarget } from './utilities.js';
import { merge } from './updates';
import * as symbols from './symbols.js';
import PopupSource from './PopupSource.js';

const menuTagKey = Symbol('menuTag');


/**
 * @elementtag {Menu} menu
 */
class MenuButton extends PopupSource {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    // If user hovers mouse over an item, select it.
    this.addEventListener('mousemove', event => {
      const hoverIndex = indexOfItemContainingTarget(this, event.target);
      if (hoverIndex !== this.state.menuSelectedIndex) {
        this[symbols.raiseChangeEvents] = true;
        this.setState({
          menuSelectedIndex: hoverIndex
        });
        this[symbols.raiseChangeEvents] = false;
      }
    });
    // this.$.menu.addEventListener('mousemove', event => {
    //   console.log(event);
    // });
    this.$.menu.addEventListener('mouseup', event => {
      // We only want to listen to events coming from the menu. (Without this,
      // clicking popup button opens popup then immediately closes it.)
      // Additionally, we ignore mouseup events on the menu background or
      // child elements like menu separators.
      const target = event.target;
      const menuSelectedIndex = this.state.menuSelectedIndex;
      if (target !== this.$.menu && menuSelectedIndex >= 0) {
        this[symbols.raiseChangeEvents] = true;
        this.close(this.state.menuSelectedIndex);
        this[symbols.raiseChangeEvents] = false;
      }
    });
    this.$.menu.addEventListener('selected-index-changed', event => {
      /** @type {any} */
      const cast = event;
      this.setState({
        menuSelectedIndex: cast.detail.selectedIndex
      });
    });
    this.$.popup[symbols.firstFocusableElement] = this.$.menu;
    // this.$.source.addEventListener('mouseleave', event => {
    //   console.log(event);
    // });
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

  get defaults() {
    const base = super.defaults || {};
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        menu: 'elix-menu'
      })
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      itemRole: 'menuitem',
      menuSelectedIndex: -1,
      role: 'button',
      selectedItem: null
    });
  }

  get items() {
    /** @type {any} */
    const menu = this.$ && this.$.menu;
    return menu ? menu.items : null;
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

  get menuTag() {
    return this[menuTagKey];
  }
  set menuTag(menuTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[menuTagKey] = menuTag;
  }

  get popupTemplate() {
    const base = super.popupTemplate;
    const menuTag = this.menuTag || this.defaults.tags.menu;
    const template = base.replace('<slot></slot>', `
      <${menuTag} id="menu">
        <slot></slot>
      </${menuTag}>
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
      <svg id="ellipsisIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
    `;
  }

  get updates() {
    const base = super.updates;
    return merge(base, {
      attributes: {
        'aria-haspopup': true
      },
      $: {
        menu: {
          style: {
            background: 'window',
            border: 'none',
            padding: '0.5em 0'
          },
          selectedIndex: this.state.menuSelectedIndex
        },
        popup: {
          attributes: {
            tabindex: '-1'
          }
        },
        source: {
          style: {
            'align-items': 'center',
            display: 'flex'
          }
        }
      }
    },
    this.$.ellipsisIcon && {
      $: {
        ellipsisIcon: {
          style: {
            fill: 'currentColor'
          }
        }
      }
    });
  }

}


export default MenuButton;
customElements.define('elix-menu-button', MenuButton);
