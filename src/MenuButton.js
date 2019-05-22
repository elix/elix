import { deepContains, indexOfItemContainingTarget } from './utilities.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import Menu from './Menu.js';
import PopupButton from './PopupButton.js';


const documentMouseupListenerKey = Symbol('documentMouseupListener');


/**
 * A button that invokes a menu.
 * 
 * @inherits PopupButton
 * @elementrole {Menu} menu
 */
class MenuButton extends PopupButton {

  componentDidMount() {
    super.componentDidMount();

    // If the user hovers over an item, select it.
    this.addEventListener('mousemove', event => {
      const target = event.target;
      if (target && target instanceof Node) {
        const hoverIndex = indexOfItemContainingTarget(this.items, target);
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
    //
    // Coincidentally, we *also* need to listen to mouseup on the document to
    // tell whether the user released the mouse over the source button. When the
    // user mouses down, the backdrop will appear and cover the source, so from
    // that point on the source won't receive a mouseup event. Again, we can
    // listen to mouseup on the document and do our own hit-testing to see if
    // the user released the mouse over the source.
    this[documentMouseupListenerKey] = async (event) => {
      const hitTargets = this.shadowRoot.elementsFromPoint(event.clientX, event.clientY);
      const overSource = hitTargets.indexOf(this.$.source) >= 0;
      if (this.opened) {
        if (overSource) {
          // User released the mouse over the source button (behind the
          // backdrop), so we're no longer doing a drag-select.
          if (this.state.dragSelect) {
            this[symbols.raiseChangeEvents] = true;
            this.setState({
              dragSelect: false
            });
            this[symbols.raiseChangeEvents] = false;
          }
        } else {
          // If we get to this point, the user released over the backdrop with
          // the popup open, so close.
          this[symbols.raiseChangeEvents] = true;
          await this.close();
          this[symbols.raiseChangeEvents] = false;
        }
      }
    };

    if (this.state.opened) {
      addDocumentListeners(this);
    }
  }

  componentDidUpdate(changed) {
    super.componentDidUpdate(changed);
    if (changed.opened) {
      if (this.state.opened) {
        addDocumentListeners(this);
      } else {
        removeDocumentListeners(this);
      }
      // REVIEW: Shouldn't this only happen when the menu closes?
      if (this[symbols.raiseChangeEvents] && this.state.selectedItem) {
        this.itemSelected(this.state.selectedItem);
      }
    }
  }

  // The index that will be selected by default when the menu opens.
  get defaultMenuSelectedIndex() {
    return -1;
  }

  get defaultState() {
    const state = Object.assign(super.defaultState, {
      dragSelect: true,
      menuRole: Menu,
      menuSelectedIndex: -1,
      selectedItem: null,
      touchstartX: null,
      touchstartY: null
    });

    // Set things when opening, or reset things when closing.
    state.onChange('opened', state => {
      if (state.opened) {
        // Opening
        return {
          // Until we get a mouseup, we're doing a drag-select.
          dragSelect: true,

          // Select the default item in the menu.
          menuSelectedIndex: this.defaultMenuSelectedIndex,

          // Clear any previously selected item.
          selectedItem: null,

          // Clear previous touchstart point.
          touchStartX: null,
          touchStartY: null
        };
      } else {
        // Closing
        return {
          // Clear menu selection.
          menuSelectedIndex: -1
        };
      }
    });

    return state;
  }

  disconnectedCallback() {
    //@ts-ignore
    if (super.disconnectedCallback) { super.disconnectedCallback(); }
    document.removeEventListener('mouseup', this[documentMouseupListenerKey]);
    this[documentMouseupListenerKey] = null;
  }

  /**
   * Highlight the selected item (if one exists), then close the menu.
   */
  async highlightSelectedItemAndClose() {
    const raiseChangeEvents = this[symbols.raiseChangeEvents];
    const selectionDefined = this.state.menuSelectedIndex >= 0;
    const closeResult = selectionDefined ?
      this.state.menuSelectedIndex :
      undefined;
    /** @type {any} */ const menu = this.$.menu;
    if (selectionDefined && 'highlightSelectedItem' in menu) {
      await menu.highlightSelectedItem();
    }
    const saveRaiseChangeEvents = this[symbols.raiseChangeEvents];
    this[symbols.raiseChangeEvents] = raiseChangeEvents;
    await this.close(closeResult);
    this[symbols.raiseChangeEvents] = saveRaiseChangeEvents;
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
     * @event menu-item-selected
     */
    const event = new CustomEvent('menu-item-selected', {
      detail: {
        selectedItem: item
      }
    });
    this.dispatchEvent(event);
  }

  [symbols.keydown](event) {

    switch (event.key) {
      // When open, Enter closes popup.
      case 'Enter':
        if (this.opened) {
          this.highlightSelectedItemAndClose();
          return true;
        }
    }

    // Give superclass a chance to handle.
    const base = super[symbols.keydown] && super[symbols.keydown](event);
    if (base) {
      return true;
    }

    if (this.opened && !event.metaKey && !event.altKey) {
      // If they haven't already been handled, absorb keys that might cause the
      // page to scroll in the background, which would in turn cause the popup to
      // inadvertently close.
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'End':
        case 'Home':
        case 'PageDown':
        case 'PageUp':
        case ' ':
          return true;
      }
    }

    return false;
  }

  /**
   * The class, tag, or template used to define the menu.
   * 
   * The menu element is responsible for presenting the menu items and handling
   * navigation between them.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default Menu
   */
  get menuRole() {
    return this.state.menu;
  }
  set menuRole(menuRole) {
    this.setState({ menuRole });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.popupRole) {
      this.$.popup.tabIndex = -1;
    }
    if (changed.menuRole) {
      template.transmute(this.$.menu, this.state.menuRole);

      // Close the popup if menu loses focus.
      this.$.menu.addEventListener('blur', async (event) => {
        /** @type {any} */
        const cast = event;
        const newFocusedElement = cast.relatedTarget || document.activeElement;
        if (this.opened && !deepContains(this.$.menu, newFocusedElement)) {
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

      // If the user mouses up on a menu item, close the menu with that item as
      // the close result.
      this.$.menu.addEventListener('mouseup', async (event) => {
        // If we're doing a drag-select (user moused down on button, dragged
        // mouse into menu, and released), we close. If we're not doing a
        // drag-select (the user opened the menu with a complete click), and
        // there's a selection, they clicked on an item, so also close.
        // Otherwise, the user clicked the menu open, then clicked on a menu
        // separator or menu padding; stay open.
        const menuSelectedIndex = this.state.menuSelectedIndex;
        if (this.state.dragSelect || menuSelectedIndex >= 0) {
          // We don't want the document mouseup handler to close
          // before we've asked the menu to highlight the selection.
          // We need to stop event propagation here, before we enter
          // any async code, to actually stop propagation.
          event.stopPropagation();
          this[symbols.raiseChangeEvents] = true;
          await this.highlightSelectedItemAndClose();
          this[symbols.raiseChangeEvents] = false;
        } else {
          event.stopPropagation();
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
    }
    if (changed.menuSelectedIndex) {
      const menu = /** @type {any} */ (this.$.menu);
      if ('selectedIndex' in menu) {
        menu.selectedIndex = this.state.menuSelectedIndex;
      }
    }
  }

  get [symbols.template]() {
    const base = super[symbols.template];

    // Wrap default slot with a menu.
    const menuTemplate = template.html`
      <div id="menu">
        <slot></slot>
      </div>
    `;
    const defaultSlot = base.content.querySelector('slot:not([name])');
    if (defaultSlot) {
      template.transmute(defaultSlot, menuTemplate);
    }

    // Inject a "..." icon into the source slot.
    // Default "..." icon is from Google Material Design icons.
    const sourceTemplate = template.html`
      <slot>
        <svg id="ellipsisIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </slot>
    `;
    const sourceSlot = base.content.querySelector('slot[name="source"]');
    if (sourceSlot) {
      template.transmute(sourceSlot, sourceTemplate);
    }

    return template.concat(
      base,
      template.html`
        <style>
          #menu {
            background: window;
            border: none;
            max-height: 100%;
            padding: 0.5em 0;
          }

          #source {
            align-items: center;
            display: flex;
          }

          #ellipsisIcon {
            display: block;
            fill: currentColor;
          }
        </style>
      `
    );
  }

}


function addDocumentListeners(element) {
  document.addEventListener('mouseup', element[documentMouseupListenerKey]);
}


function removeDocumentListeners(element) {
  document.removeEventListener('mouseup', element[documentMouseupListenerKey]);
}


export default MenuButton;
customElements.define('elix-menu-button', MenuButton);
