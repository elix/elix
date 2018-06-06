import './Menu.js';
import { indexOfItemContainingTarget } from './utilities.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import PopupSource from './PopupSource.js';

const menuTagKey = Symbol('menuTag');
const documentMouseupListenerKey = Symbol('documentMouseupListener');


/**
 * A button that invokes a menu.
 * 
 * @inherits PopupSource
 * @elementtag {Menu} menu
 */
class MenuButton extends PopupSource {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }

    // If user hovers mouse over an item, select it.
    this.addEventListener('mousemove', event => {
      const target = event.target;
      if (target) {
        /** @type {any} */
        const cast = target;
        const hoverIndex = indexOfItemContainingTarget(this, cast);
        if (hoverIndex !== this.state.menuSelectedIndex) {
          this[symbols.raiseChangeEvents] = true;
          this.setState({
            menuSelectedIndex: hoverIndex
          });
          this[symbols.raiseChangeEvents] = false;
        }
      }
    });

    // If the popup is open and user releases the mouse over the backdrop, close
    // the popup. We need to listen to mouseup on the document, not this
    // element. If the user mouses down on the source, then moves the mouse off
    // the document before releasing the mouse, the element itself won't get the
    // mouseup. The document will, however, so it's a more reliable source of
    // mouse state.
    this[documentMouseupListenerKey] = async (event) => {
      if (this.opened) {
        // If the user mouses up over the menu, the menu mouseup handler will
        // handle that case. So if we get to this point and the popup is still
        // open, the user either released over the popup source or the backdrop.
        // Hit test to see if the event is over the source. If not, they were
        // over the backdrop.
        const x = event.clientX;
        const y = event.clientY;
        // Find all elements under the given point.
        const hitTargets = this.shadowRoot.elementsFromPoint(x, y);
        const overSource = hitTargets.indexOf(this.$.source) >= 0;
        if (!overSource) {
          // Mouse is likely over the backdrop, so close.
          this[symbols.raiseChangeEvents] = true;
          await this.close();
          this[symbols.raiseChangeEvents] = false;
        }
      }
    };
    document.addEventListener('mouseup', this[documentMouseupListenerKey]);

    // Close the popup if menu loses focus.
    this.$.menu.addEventListener('blur', async (event) => {
      if (this.opened) {
        this[symbols.raiseChangeEvents] = true;
        await this.close();
        this[symbols.raiseChangeEvents] = false;
      }
    });

    // mousedown events on the menu will propagate up to the top-level element,
    // which will then steal the focus. We want to keep the focus on the menu,
    // both to permit keyboard use, and to avoid closing the menu on blur (see
    // separate blur handler). To keep the focus on the menu, we prevent the
    // default event behavior.
    this.$.menu.addEventListener('mousedown', event => {
      if (this.opened) {
        event.stopPropagation();
        event.preventDefault();
      }
    });

    this.$.menu.addEventListener('mouseup', async (event) => {
      // We only want to listen to events coming from the menu. (Without this,
      // clicking popup button opens popup then immediately closes it.)
      // Additionally, we ignore mouseup events on the menu background or
      // child elements like menu separators.
      const target = event.target;
      const menuSelectedIndex = this.state.menuSelectedIndex;
      if (target !== this.$.menu) {
        this[symbols.raiseChangeEvents] = true;
        const closeResult = menuSelectedIndex >= 0 ?
          menuSelectedIndex :
          undefined;
        await this.close(closeResult);
        this[symbols.raiseChangeEvents] = false;
      }
    });

    // Track changes in the menu's selection state.
    this.$.menu.addEventListener('selected-index-changed', event => {
      /** @type {any} */
      const cast = event;
      this.setState({
        menuSelectedIndex: cast.detail.selectedIndex
      });
    });

    // When OverlayMixin opens the popup, we want it to focus on the menu.
    this.$.popup[symbols.firstFocusableElement] = this.$.menu;
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

  disconnectedCallback() {
    //@ts-ignore
    if (super.disconnectedCallback) { super.disconnectedCallback(); }
    document.removeEventListener('mouseup', this[documentMouseupListenerKey]);
    this[documentMouseupListenerKey] = null;
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


//
// Return true if the client (x, y) point is:
//
// * over the popup source, or
// * over a selectable menu item.
//
// We use this on mouseup to determine whether the user's released the mouse
// over the source or menu (and therefore wants to select something). If not,
// we conclude they released the mouse over the backdrop or something in the
// menu that can't be selected (like padding or a separator), in which case
// we'll return false. In that case, we'll close the popup.
//
function pointOverMenu(element, x, y) {
  // Find all elements under the given point.
  const hitTargets = element.shadowRoot.elementsFromPoint(x, y);
  if (hitTargets.indexOf(element.$.source) >= 0) {
    // User released over the button or other element that invokes the popup.
    return true;
  }
  if (hitTargets.indexOf(element.$.menu) >= 0 &&
    element.state.menuSelectedIndex >= 0) {
    // The mouse is over the menu, and a menu item is currently selected. Since
    // we track selection on hover, the mouse should be over a selectable menu
    // item.
    return true;
  }
  return false;
}


export default MenuButton;
customElements.define('elix-menu-button', MenuButton);
