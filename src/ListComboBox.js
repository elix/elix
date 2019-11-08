import { getItemText } from './ItemsTextMixin.js';
import { indexOfItemContainingTarget } from './utilities.js';
import * as internal from './internal.js';
import * as template from './template.js';
import ComboBox from './ComboBox.js';
import DelegateItemsMixin from './DelegateItemsMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import ListBox from './ListBox.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';

const Base = DelegateItemsMixin(
  DirectionSelectionMixin(SingleSelectionMixin(ComboBox))
);

/**
 * A combo box whose popup presents a list of choices
 *
 * @inherits ComboBox
 * @mixes DelegateItemsMixin
 * @mixes DirectionSelectionMixin
 * @mixes SingleSelectionMixin
 * @part {ListBox} list - the list of choices
 */
class ListComboBox extends Base {
  [internal.componentDidMount]() {
    super[internal.componentDidMount]();
    this.setAttribute('aria-haspopup', 'listbox');
  }

  get [internal.defaultState]() {
    const state = Object.assign(super[internal.defaultState], {
      horizontalAlign: 'stretch',
      listPartType: ListBox,
      selectedIndex: -1
    });

    // If value was changed directly or items have updated, select the
    // corresponding item in list.
    state.onChange(['items', 'value'], state => {
      const { value } = state;
      /** @type {ListItemElement[]} */ const items = state.items;
      if (items && value != null) {
        const searchText = value.toLowerCase();
        const selectedIndex = items.findIndex(item => {
          const itemText = getItemText(item);
          return itemText.toLowerCase() === searchText;
        });
        return {
          selectedIndex
        };
      }
      return null;
    });

    // If user selects a new item, or combo is closing, make selected item the
    // value.
    state.onChange(['opened', 'selectedIndex'], (state, changed) => {
      const { closeResult, items, opened, selectedIndex, value } = state;
      const closing = changed.opened && !opened;
      const canceled = closeResult && closeResult.canceled;
      if (
        selectedIndex >= 0 &&
        (changed.selectedIndex || (closing && !canceled))
      ) {
        const selectedItem = items[selectedIndex];
        if (selectedItem) {
          const selectedItemText = getItemText(selectedItem);
          // See notes on mobile at ComboBox.defaultState.
          const probablyMobile = matchMedia('(pointer: coarse)').matches;
          const selectText = !probablyMobile;
          if (value !== selectedItemText) {
            return {
              selectText,
              value: selectedItemText
            };
          }
        }
      }
      return null;
    });

    // When items change, we need to recalculate popup size.
    state.onChange('items', () => ({
      popupMeasured: false
    }));

    return state;
  }

  // We do our own handling of the Up and Down arrow keys, rather than relying
  // on KeyboardDirectionMixin. The latter supports Home and End, and we don't
  // want to handle those -- we want to let the text input handle them.
  // We also need to forward PageDown/PageUp to the list element.
  [internal.keydown](/** @type {KeyboardEvent} */ event) {
    let handled;
    /** @type {any} */
    const list = this[internal.ids].list;

    switch (event.key) {
      case 'ArrowDown':
        if (this.opened) {
          handled = event.altKey
            ? this[internal.goEnd]()
            : this[internal.goDown]();
        }
        break;

      case 'ArrowUp':
        if (this.opened) {
          handled = event.altKey
            ? this[internal.goStart]()
            : this[internal.goUp]();
        }
        break;

      case 'PageDown':
        if (this.opened) {
          handled = list.pageDown && list.pageDown();
        }
        break;

      case 'PageUp':
        if (this.opened) {
          handled = list.pageUp && list.pageUp();
        }
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return (
      handled || (super[internal.keydown] && super[internal.keydown](event))
    );
  }

  /**
   * The class, tag, or template used to create the `list` part - the list of
   * available choices shown in the popup.
   *
   * @type {PartDescriptor}
   * @default ListBox
   */
  get listPartType() {
    return this[internal.state].listPartType;
  }
  set listPartType(listPartType) {
    this[internal.setState]({ listPartType });
  }

  get [internal.itemsDelegate]() {
    return this[internal.ids].list;
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.inputPartType) {
      this[internal.ids].input.setAttribute('aria-autocomplete', 'both');
    }
    if (changed.listPartType) {
      template.transmute(
        this[internal.ids].list,
        this[internal.state].listPartType
      );

      this[internal.ids].list.addEventListener('mousedown', event => {
        // Mousing down inside a list item closes the popup.
        /** @type {any} */
        const target = event.target;
        if (target) {
          const targetIndex = indexOfItemContainingTarget(this.items, target);
          if (this.opened && targetIndex >= 0) {
            this[internal.raiseChangeEvents] = true;
            this.close();
            this[internal.raiseChangeEvents] = false;
          }
        }
      });

      // Track changes in the list's selection state.
      // Known bug: this behavior seems to confuse Gboard on Chrome for Android.
      // If we update our notion of the selection index, we'll ultimately update
      // the text shown in the input and leave it selected. If the user then
      // presses Backspace to delete that selected text, Gboard/Chrome seems to
      // ignore the first press of the Backspace key. The user must press
      // Backspace a second time to actually delete the selected text.
      this[internal.ids].list.addEventListener(
        'selected-index-changed',
        event => {
          /** @type {any} */
          const cast = event;
          const listSelectedIndex = cast.detail.selectedIndex;
          if (this[internal.state].selectedIndex !== listSelectedIndex) {
            this[internal.raiseChangeEvents] = true;
            this[internal.setState]({
              selectedIndex: listSelectedIndex
            });
            this[internal.raiseChangeEvents] = false;
          }
        }
      );
    }
    if (changed.selectedIndex) {
      const list = /** @type {any} */ (this[internal.ids].list);
      if ('selectedIndex' in list) {
        list.selectedIndex = this[internal.state].selectedIndex;
      }
    }
  }

  get [internal.template]() {
    const result = super[internal.template];

    // Wrap default slot with a list.
    const listTemplate = template.html`
      <style>
        #list {
          border: none;
          flex: 1;
          height: 100%;
          max-height: 100%;
          overscroll-behavior: contain;
          width: 100%;
        }
      </style>
      <div id="list" part="list" tabindex="-1">
        <slot></slot>
      </div>
    `;
    const defaultSlot = template.defaultSlot(result.content);
    if (defaultSlot) {
      template.transmute(defaultSlot, listTemplate);
    }

    return result;
  }
}

export default ListComboBox;
