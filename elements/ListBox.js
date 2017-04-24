//
// Copyright © 2016-2017 Component Kitchen, Inc. and contributors to the 
// Elix Project
//

import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin';
import ClickSelectionMixin from '../mixins/ClickSelectionMixin';
import ContentItemsMixin from '../mixins/ContentItemsMixin';
import DefaultSlotContentMixin from '../mixins/DefaultSlotContentMixin';
import DirectionSelectionMixin from '../mixins/DirectionSelectionMixin';
import KeyboardDirectionMixin from '../mixins/KeyboardDirectionMixin';
import KeyboardMixin from '../mixins/KeyboardMixin';
import KeyboardPagedSelectionMixin from '../mixins/KeyboardPagedSelectionMixin';
import KeyboardPrefixSelectionMixin from '../mixins/KeyboardPrefixSelectionMixin';
import SelectedItemTextValueMixin from '../mixins/SelectedItemTextValueMixin';
import SelectionAriaMixin from '../mixins/SelectionAriaMixin';
import SelectionInViewMixin from '../mixins/SelectionInViewMixin';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin';
import symbols from '../mixins/symbols';


const mixins = [
  AttributeMarshallingMixin,
  ClickSelectionMixin,
  ContentItemsMixin,
  DefaultSlotContentMixin,
  DirectionSelectionMixin,
  KeyboardDirectionMixin,
  KeyboardMixin,
  KeyboardPagedSelectionMixin,
  KeyboardPrefixSelectionMixin,
  SelectedItemTextValueMixin,
  SelectionAriaMixin,
  SelectionInViewMixin,
  ShadowTemplateMixin,
  SingleSelectionMixin
];

// Apply the above mixins to HTMLElement.
const base = mixins.reduce((cls, mixin) => mixin(cls), HTMLElement);


/**
 * A simple single-selection list box.
 *
 * This component supports a generic visual style, ARIA support, and full
 * keyboard navigation. See `KeyboardDirectionMixin`,
 * `KeyboardPagedSelectionMixin`, and `KeyboardPrefixSelectionMixin` for
 * keyboard details.
 *
 * @extends HTMLElement
 * @mixes AttributeMarshallingMixin
 * @mixes ClickSelectionMixin
 * @mixes ContentItemsMixin
 * @mixes DefaultSlotContentMixin
 * @mixes DirectionSelectionMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes KeyboardPagedSelectionMixin
 * @mixes KeyboardPrefixSelectionMixin
 * @mixes SelectedItemTextValueMixin
 * @mixes SelectionAriaMixin
 * @mixes SelectionInViewMixin
 * @mixes ShadowTemplateMixin
 * @mixes SingleSelectionMixin
 */
class ListBox extends base {

  get [symbols.defaults]() {
    const defaults = super[symbols.defaults] || {};
    // By default, we assume the list presents list items vertically.
    defaults.orientation = 'vertical';
    return defaults;
  }

  // Map item selection to a `selected` CSS class.
  [symbols.itemSelected](item, selected) {
    if (super[symbols.itemSelected]) { super[symbols.itemSelected](item, selected); }
    item.classList.toggle('selected', selected);
  }

  /**
   * The vertical (default) or horizontal orientation of the list.
   *
   * Supported values are "horizontal" or "vertical".
   *
   * @type {string}
   */
  get orientation() {
    return this[symbols.orientation] || this[symbols.defaults].orientation;
  }
  set orientation(value) {
    const changed = value !== this[symbols.orientation];
    this[symbols.orientation] = value;
    if ('orientation' in base) { super.orientation = value; }
    // Reflect attribute for styling
    this.reflectAttribute('orientation', value);
    if (changed && this[symbols.raiseChangeEvents]) {
      const event = new CustomEvent('orientation-changed');
      this.dispatchEvent(event);
    }
  }

  get [symbols.template]() {
    return `
      <style>
      :host {
        border: 1px solid gray;
        box-sizing: border-box;
        cursor: default;
        display: flex;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }

      #itemsContainer {
        flex: 1;
        -webkit-overflow-scrolling: touch; /* for momentum scrolling */
        overflow-x: hidden;
        overflow-y: scroll;
      }
      :host([orientation="horizontal"]) #itemsContainer {
        display: flex;
        overflow-x: scroll;
        overflow-y: hidden;
      }

      #itemsContainer ::slotted(*) {
        cursor: default;
        padding: 0.25em;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      #itemsContainer ::slotted(.selected) {
        background: var(--elix-selected-background, highlight);
        color: var(--elix-selected-color, highlighttext);
      }
      </style>

      <div id="itemsContainer" role="none">
        <slot></slot>
      </div>
    `;
  }

  /**
   * Fires when the orientation property changes in response to internal
   * component activity.
   *
   * @memberof ListBox
   * @event orientation-changed
   */
}


customElements.define('elix-list-box', ListBox);
export default ListBox;
