import { applyChildNodes } from './utilities.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import MenuButton from './MenuButton.js';
import SelectedItemTextValueMixin from './SelectedItemTextValueMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotItemsMixin from './SlotItemsMixin.js';


const Base =
  SelectedItemTextValueMixin(
  SingleSelectionMixin(
  SlotItemsMixin(
    MenuButton
  )));


/**
 * Shows a single choice made from a pop-up list of choices
 * 
 * @inherits MenuButton
 * @mixes SelectedItemTextValueMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotItemsMixin
 * @elementrole {'div'} value
 */
class DropdownList extends Base {

  // By default, opening the menu re-selects the component item that's currently
  // selected.
  get defaultMenuSelectedIndex() {
    return this.state.selectedIndex;
  }

  get defaultState() {
    const state = Object.assign(super.defaultState, {
      itemRole: 'menuitemradio',
      selectionRequired: true,
      valueRole: 'div'
    });

    // When the menu closes, update our selection from the menu selection.
    state.onChange('opened', state => {
      const { closeResult, opened } = state;
      if (!opened && closeResult !== undefined) {
        return {
          selectedIndex: closeResult
        };
      }
      return null;
    });

    return state;
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.itemRole) {
      if ('itemRole' in this.$.menu) {
        /** @type {any} */ (this.$.menu).itemRole = this.state.itemRole;
      }
    }
    if (changed.valueRole) {
      template.transmute(this.$.value, this.state.valueRole);
    }
    if (changed.popupPosition) {
      const { popupPosition } = this.state;
      this.$.downIcon.style.display = popupPosition === 'below' ?
        'block' :
        'none';
      this.$.upIcon.style.display = popupPosition === 'above' ?
        'block' :
        'none';
    }
    if (changed.selectedIndex) {
      const items = this.state.items || [];
      const selectedItem = items[this.state.selectedIndex];
      const clone = selectedItem ?
        selectedItem.cloneNode(true) :
        null;
      const childNodes = clone ? clone.childNodes : [];
      applyChildNodes(this.$.value, childNodes);
    }
  }

  get [symbols.template]() {
    const base = super[symbols.template];
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
   * @type {function|string|HTMLTemplateElement}
   * @default 'div'
   */
  get valueRole() {
    return this.state.valueRole;
  }
  set valueRole(valueRole) {
    this.setState({ valueRole });
  }

}


export default DropdownList;
customElements.define('elix-dropdown-list', DropdownList);
