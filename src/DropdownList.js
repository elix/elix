import { apply, merge } from './updates.js';
import { createElement, html, replace } from './template.js';
import { getSuperProperty } from './workarounds.js';
import * as symbols from './symbols.js';
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
 * Shows a single choice made from a pop-up list of choices.
 * 
 * @inherits MenuButton
 * @mixes SelectedItemTextValueMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotItemsMixin
 */
class DropdownList extends Base {

  constructor() {
    super();
    Object.assign(this[symbols.descriptors], {
      value: 'div'
    });
  }

  // By default, opening the menu re-selects the component item that's currently
  // selected.
  get defaultMenuSelectedIndex() {
    return this.state.selectedIndex;
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      itemRole: 'menuitemradio',
      selectionRequired: true
    });
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    const { closeResult, opened, selectedIndex } = state;
    if (!opened && this.opened && closeResult !== undefined &&
        selectedIndex !== closeResult) {
      // Closing: Update our selection from menu selection.
      state.selectedIndex = closeResult;
      result = false;
    }
    return result;
  }

  get [symbols.template]() {
    // Next line is same as: const result = super.template;
    const result = getSuperProperty(this, DropdownList, symbols.template);
    const sourceSlot = result.content.querySelector('slot[name="source"]');
    if (!sourceSlot) {
      throw `Couldn't find slot with name "source".`;
    }
    const sourceSlotContent = html`
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
    apply(sourceSlot, {
      childNodes: sourceSlotContent.content.childNodes
    });
    if (this[symbols.descriptors].value !== 'div') {
      replace(
        result.content.querySelector('#value'),
        createElement(this[symbols.descriptors].value)
      );
    }
    return result;
  }

  get updates() {
    const popupPosition = this.state.popupPosition;
    const itemRole = 'itemRole' in this.$.menu ? this.state.itemRole : null;
    const clone = this.selectedItem ?
      this.selectedItem.cloneNode(true) :
      null;
    const childNodes = clone ? clone.childNodes : [];
    return merge(super.updates, {
      $: {
        downIcon: {
          style: {
            display: popupPosition === 'below' ? 'block' : 'none',
            fill: 'currentColor',
            'margin-left': '0.25em',
          }
        },
        menu: Object.assign(
          {
            style: {
              padding: 0
            },
          },
          itemRole ? { itemRole } : null
        ),
        upIcon: {
          style: {
            display: popupPosition === 'above' ? 'block' : 'none',
            fill: 'currentColor',
            'margin-left': '0.25em',
          }
        },
        value: {
          childNodes
        }
      }
    });
  }

  /**
   * The tag used to define the element that will contain the DropdownList's
   * current value.
   * 
   * @type {function|string|Node}
   * @default 'div'
   */
  get valueDescriptor() {
    return this[symbols.descriptors].value;
  }
  set valueDescriptor(valueDescriptor) {
    this[symbols.hasDynamicTemplate] = true;
    this[symbols.descriptors].value = valueDescriptor;
  }

}


export default DropdownList;
customElements.define('elix-dropdown-list', DropdownList);
