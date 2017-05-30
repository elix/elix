import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import ClickSelectionMixin from '../mixins/ClickSelectionMixin.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import DefaultSlotContentMixin from '../mixins/DefaultSlotContentMixin.js';
import DirectionSelectionMixin from '../mixins/DirectionSelectionMixin.js';
import KeyboardDirectionMixin from '../mixins/KeyboardDirectionMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import KeyboardPagedSelectionMixin from '../mixins/KeyboardPagedSelectionMixin.js';
import KeyboardPrefixSelectionMixin from '../mixins/KeyboardPrefixSelectionMixin.js';
import SelectedItemTextValueMixin from '../mixins/SelectedItemTextValueMixin.js';
import SelectionAriaMixin from '../mixins/SelectionAriaMixin.js';
import SelectionInViewMixin from '../mixins/SelectionInViewMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin.js';
import symbols from '../mixins/symbols.js';
import { toggleClass } from '../mixins/attributes.js';


const Base =
  AttributeMarshallingMixin(
  ClickSelectionMixin(
  ContentItemsMixin(
  DefaultSlotContentMixin(
  DirectionSelectionMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  KeyboardPagedSelectionMixin(
  KeyboardPrefixSelectionMixin(
  SelectedItemTextValueMixin(
  SelectionAriaMixin(
  SelectionInViewMixin(
  ShadowTemplateMixin(
  SingleSelectionMixin(
    HTMLElement
  ))))))))))))));


/**
 * A simple single-selection list box.
 *
 * This component supports a generic visual style, ARIA support, and full
 * keyboard navigation. See `KeyboardDirectionMixin`,
 * `KeyboardPagedSelectionMixin`, and `KeyboardPrefixSelectionMixin` for
 * keyboard details.
 *
 * @extends {HTMLElement}
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
class ListBox extends Base {

  get [symbols.defaults]() {
    const defaults = super[symbols.defaults] || {};
    // By default, we assume the list presents list items vertically.
    defaults.orientation = 'vertical';
    return defaults;
  }

  // Map item selection to a `selected` CSS class.
  /**
   * @param {Element} item 
   * @param {boolean} selected 
   */
  [symbols.itemSelected](item, selected) {
    if (super[symbols.itemSelected]) { super[symbols.itemSelected](item, selected); }
    toggleClass(item, 'selected', selected);
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
    // @ts-ignore
    if ('orientation' in Base) { super.orientation = value; }
    // Reflect attribute for styling
    this.reflectAttribute('orientation', value);
    if (changed && this[symbols.raiseChangeEvents]) {
      const event = new CustomEvent('orientation-changed');
      this.dispatchEvent(event);
    }
  }

  [symbols.template](filler) {
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
        ${filler || `<slot></slot>`}
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
