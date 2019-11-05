import { deepContains, indexOfItemContainingTarget } from './utilities.js';
import * as internal from './internal.js';
import * as template from './template.js';
import Menu from './Menu.js';
import PopupButton from './PopupButton.js';

const documentMouseupListenerKey = Symbol('documentMouseupListener');

/**
 * A button that invokes a menu.
 *
 * @inherits PopupButton
 * @part {Menu} menu - the menu shown in the popup
 * @part toggle-icon - icon shown in the button that invokes the menu
 */
class MenuButton extends PopupButton {
  [internal.componentDidMount]() {
    super[internal.componentDidMount]();

    // If the user hovers over an item, select it.
    this.addEventListener('mousemove', event => {
      const target = event.target;
      if (target && target instanceof Node) {
        const hoverIndex = indexOfItemContainingTarget(this.items, target);
        if (hoverIndex !== this[internal.state].menuSelectedIndex) {
          this[internal.raiseChangeEvents] = true;
          this[internal.setState]({
            menuSelectedIndex: hoverIndex
          });
          this[internal.raiseChangeEvents] = false;
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
    /** @type {any} */ const cast = this;
    cast[documentMouseupListenerKey] = handleMouseup.bind(this);

    if (this[internal.state].opened) {
      addDocumentListeners(this);
    }
  }

  [internal.componentDidUpdate](/** @type {PlainObject} */ changed) {
    super[internal.componentDidUpdate](changed);
    if (changed.menuSelectedIndex) {
      const selectedItem =
        this[internal.state].menuSelectedIndex >= 0
          ? this.items[this[internal.state].menuSelectedIndex]
          : null;
      this.itemSelected(selectedItem);
    }
    if (changed.opened) {
      if (this[internal.state].opened) {
        addDocumentListeners(this);
      } else {
        removeDocumentListeners(this);
      }
    }
  }

  // The index that will be selected by default when the menu opens.
  get defaultMenuSelectedIndex() {
    return -1;
  }

  get [internal.defaultState]() {
    const state = Object.assign(super[internal.defaultState], {
      dragSelect: true,
      menuPartType: Menu,
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
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    /** @type {any} */ const cast = this;
    document.removeEventListener('mouseup', cast[documentMouseupListenerKey]);
    cast[documentMouseupListenerKey] = null;
  }

  /**
   * Highlight the selected item (if one exists), then close the menu.
   */
  async highlightSelectedItemAndClose() {
    const raiseChangeEvents = this[internal.raiseChangeEvents];
    const selectionDefined = this[internal.state].menuSelectedIndex >= 0;
    const closeResult = selectionDefined
      ? this.items[this[internal.state].menuSelectedIndex]
      : undefined;
    /** @type {any} */ const menu = this[internal.ids].menu;
    if (selectionDefined && 'highlightSelectedItem' in menu) {
      await menu.highlightSelectedItem();
    }
    const saveRaiseChangeEvents = this[internal.raiseChangeEvents];
    this[internal.raiseChangeEvents] = raiseChangeEvents;
    await this.close(closeResult);
    this[internal.raiseChangeEvents] = saveRaiseChangeEvents;
  }

  get items() {
    /** @type {any} */
    const menu = this[internal.ids] && this[internal.ids].menu;
    return menu ? menu.items : null;
  }

  /**
   * Invoked when a new item is selected.
   *
   * @param {ListItemElement} item
   */
  itemSelected(item) {
    if (this[internal.raiseChangeEvents]) {
      /**
       * Raised when the user has moved the selection to a new menu item. This
       * event is raised while the menu is still open. To check which item the
       * user selected from a menu, listen to the `closed` event and inspect the
       * event `details` object for its `closeResult` member.
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
  }

  [internal.keydown](/** @type {KeyboardEvent} */ event) {
    switch (event.key) {
      // When open, Enter closes popup.
      case 'Enter':
        if (this.opened) {
          this.highlightSelectedItemAndClose();
          return true;
        }
    }

    // Give superclass a chance to handle.
    const base = super[internal.keydown] && super[internal.keydown](event);
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
   * The class, tag, or template used to define the `menu` part – the element
   * presenting the menu items and handling navigation between them.
   *
   * @type {PartDescriptor}
   * @default Menu
   */
  get menuPartType() {
    return this[internal.state].menuPartType;
  }
  set menuPartType(menuPartType) {
    this[internal.setState]({ menuPartType });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.popupPartType) {
      this[internal.ids].popup.tabIndex = -1;
    }
    if (changed.menuPartType) {
      template.transmute(
        this[internal.ids].menu,
        this[internal.state].menuPartType
      );

      // Close the popup if menu loses focus.
      this[internal.ids].menu.addEventListener('blur', async event => {
        /** @type {any} */
        const cast = event;
        const newFocusedElement = cast.relatedTarget || document.activeElement;
        if (
          this.opened &&
          !deepContains(this[internal.ids].menu, newFocusedElement)
        ) {
          this[internal.raiseChangeEvents] = true;
          await this.close();
          this[internal.raiseChangeEvents] = false;
        }
      });

      // mousedown events on the menu will propagate up to the top-level element,
      // which will then steal the focus. We want to keep the focus on the menu,
      // both to permit keyboard use, and to avoid closing the menu on blur (see
      // separate blur handler). To keep the focus on the menu, we prevent the
      // default event behavior.
      this[internal.ids].menu.addEventListener('mousedown', event => {
        if (this.opened) {
          event.stopPropagation();
          event.preventDefault();
        }
      });

      // If the user mouses up on a menu item, close the menu with that item as
      // the close result.
      this[internal.ids].menu.addEventListener('mouseup', async event => {
        // If we're doing a drag-select (user moused down on button, dragged
        // mouse into menu, and released), we close. If we're not doing a
        // drag-select (the user opened the menu with a complete click), and
        // there's a selection, they clicked on an item, so also close.
        // Otherwise, the user clicked the menu open, then clicked on a menu
        // separator or menu padding; stay open.
        const menuSelectedIndex = this[internal.state].menuSelectedIndex;
        if (this[internal.state].dragSelect || menuSelectedIndex >= 0) {
          // We don't want the document mouseup handler to close
          // before we've asked the menu to highlight the selection.
          // We need to stop event propagation here, before we enter
          // any async code, to actually stop propagation.
          event.stopPropagation();
          this[internal.raiseChangeEvents] = true;
          await this.highlightSelectedItemAndClose();
          this[internal.raiseChangeEvents] = false;
        } else {
          event.stopPropagation();
        }
      });

      // Track changes in the menu's selection state.
      this[internal.ids].menu.addEventListener(
        'selected-index-changed',
        event => {
          this[internal.raiseChangeEvents] = true;
          /** @type {any} */
          const cast = event;
          this[internal.setState]({
            menuSelectedIndex: cast.detail.selectedIndex
          });
          this[internal.raiseChangeEvents] = false;
        }
      );
    }
    if (changed.menuSelectedIndex) {
      const menu = /** @type {any} */ (this[internal.ids].menu);
      if ('selectedIndex' in menu) {
        menu.selectedIndex = this[internal.state].menuSelectedIndex;
      }
    }
  }

  get [internal.template]() {
    const base = super[internal.template];

    // Wrap default slot with a menu.
    const menuTemplate = template.html`
      <div id="menu" part="menu">
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
        <svg id="toggleIcon" part="toggle-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
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

          #toggleIcon {
            display: block;
            fill: currentColor;
          }
        </style>
      `
    );
  }
}

function addDocumentListeners(/** @type {MenuButton} */ element) {
  /** @type {any} */ const cast = element;
  document.addEventListener('mouseup', cast[documentMouseupListenerKey]);
}

async function handleMouseup(/** @type {MouseEvent} */ event) {
  // @ts-ignore
  const element = this;
  const hitTargets = element.shadowRoot.elementsFromPoint(
    event.clientX,
    event.clientY
  );
  const overSource = hitTargets.indexOf(element[internal.ids].source) >= 0;
  if (element.opened) {
    if (overSource) {
      // User released the mouse over the source button (behind the
      // backdrop), so we're no longer doing a drag-select.
      if (element[internal.state].dragSelect) {
        element[internal.raiseChangeEvents] = true;
        element[internal.setState]({
          dragSelect: false
        });
        element[internal.raiseChangeEvents] = false;
      }
    } else {
      // If we get to this point, the user released over the backdrop with
      // the popup open, so close.
      element[internal.raiseChangeEvents] = true;
      await element.close();
      element[internal.raiseChangeEvents] = false;
    }
  }
}

function removeDocumentListeners(/** @type {MenuButton} */ element) {
  /** @type {any} */ const cast = element;
  document.removeEventListener('mouseup', cast[documentMouseupListenerKey]);
}

export default MenuButton;
