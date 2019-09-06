import { applyChildNodes } from './utilities.js';
import * as internal from './internal.js';
import * as template from './template.js';
import FormElementMixin from './FormElementMixin.js';
import MenuButton from './MenuButton.js';
import SelectedItemTextValueMixin from './SelectedItemTextValueMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotItemsMixin from './SlotItemsMixin.js';


const Base =
  FormElementMixin(
  SelectedItemTextValueMixin(
  SingleSelectionMixin(
  SlotItemsMixin(
    MenuButton
  ))));


/**
 * Shows a single choice made from a pop-up list of choices
 * 
 * @inherits MenuButton
 * @mixes FormElementMixin
 * @mixes SelectedItemTextValueMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotItemsMixin
 * @elementrole {'div'} value
 */
class DropdownList extends Base {

  // By default, opening the menu re-selects the component item that's currently
  // selected.
  get defaultMenuSelectedIndex() {
    return this[internal.state].selectedIndex;
  }

  get [internal.defaultState]() {
    const state = Object.assign(super[internal.defaultState], {
      itemRole: 'menuitemradio',
      selectionRequired: true,
      valueRole: 'div'
    });

    // When the menu closes, update our selection from the menu selection.
    state.onChange('opened', state => {
      const { closeResult, items, opened } = state;
      if (!opened && items && closeResult !== undefined) {
        const selectedIndex = items.indexOf(closeResult);
        return {
          selectedIndex
        };
      }
      return null;
    });

    return state;
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.itemRole) {
      if ('itemRole' in this[internal.$].menu) {
        /** @type {any} */ (this[internal.$].menu).itemRole = this[internal.state].itemRole;
      }
    }
    if (changed.valueRole) {
      template.transmute(this[internal.$].value, this[internal.state].valueRole);
    }
    if (changed.popupPosition) {
      const { popupPosition } = this[internal.state];
      this[internal.$].downIcon.style.display = popupPosition === 'below' ?
        'block' :
        'none';
      this[internal.$].upIcon.style.display = popupPosition === 'above' ?
        'block' :
        'none';
    }
    if (changed.selectedIndex) {
      const items = this[internal.state].items || [];
      const selectedItem = items[this[internal.state].selectedIndex];
      const clone = selectedItem ?
        selectedItem.cloneNode(true) :
        null;
      const childNodes = clone ? clone.childNodes : [];
      applyChildNodes(this[internal.$].value, childNodes);
    }
  }

  get [internal.template]() {
    const base = super[internal.template];
    const sourceSlot = base.content.querySelector('slot[name="source"]');
    if (!sourceSlot) {
      throw `Couldn't find slot with name "source".`;
    }
    const sourceSlotContent = template.html`
      <div id="value"></div>
      <div>
        <svg id="downIcon" xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5">
          <path d="M 0 0 l5 5 5 -5 z"/>
        </svg>
        <svg id="upIcon" xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5">
          <path d="M 0 5 l5 -5 5 5 z"/>
        </svg>
      </div>
    `;
    applyChildNodes(sourceSlot, sourceSlotContent.content.childNodes);
    return template.concat(
      base,
      template.html`
        <style>
          #downIcon,
          #upIcon {
            fill: currentColor;
            margin-left: 0.25em;
          }

          #menu {
            padding: 0;
          }
        </style>
      `
    );
  }

  /**
   * The class, tag, or template used to contain the dropdown list's current
   * value.
   * 
   * @type {Role}
   * @default 'div'
   */
  get valueRole() {
    return this[internal.state].valueRole;
  }
  set valueRole(valueRole) {
    this[internal.setState]({ valueRole });
  }

}


export default DropdownList;
customElements.define('elix-dropdown-list', DropdownList);
