/*
 * This is currently a demo of how multiple mixins cooperate to perform useful
 * functions.
 *
 * * The component uses ShadowTemplateMixin to populate its shadow root.
 * * A user can click on a child item, and ClickSelectionMixin will set the
 *   selected item.
 * * The SingleSelectionMixin will track the selected item, and map that to
 *   changes in the selection state of the selected/deselected items.
 * * The SelectionAriaMixin will reflect an item's selection state using ARIA
 *   attributes to support assistive devices like screen readers.
 *
 * This demo will eventually evolve into a complete list box component, but
 * at the moment omits many features, including support for Page Up/Page Down
 * keys, keeping the selected item in view, the ability to select an item
 * by typing its initial characters, and support for slot elements as children.
 */


import AttributeMarshallingMixin from '../../mixins/AttributeMarshallingMixin';
import ClickSelectionMixin from '../../mixins/ClickSelectionMixin';
import ContentItemsMixin from '../../mixins/ContentItemsMixin';
import DefaultSlotContentMixin from '../../mixins/DefaultSlotContentMixin';
import DirectionSelectionMixin from '../../mixins/DirectionSelectionMixin';
import KeyboardDirectionMixin from '../../mixins/KeyboardDirectionMixin';
import KeyboardMixin from '../../mixins/KeyboardMixin';
import KeyboardPagedSelectionMixin from '../../mixins/KeyboardPagedSelectionMixin';
import KeyboardPrefixSelectionMixin from '../../mixins/KeyboardPrefixSelectionMixin';
import SelectionAriaMixin from '../../mixins/SelectionAriaMixin';
import SelectionInViewMixin from '../../mixins/SelectionInViewMixin';
import ShadowTemplateMixin from '../../mixins/ShadowTemplateMixin';
import SingleSelectionMixin from '../../mixins/SingleSelectionMixin';
import symbols from '../../mixins/symbols';


// We want to apply a number of mixin functions to HTMLElement.
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
  SelectionAriaMixin,
  SelectionInViewMixin,
  ShadowTemplateMixin,
  SingleSelectionMixin
];

// The mixins are functions, so an efficient way to apply them all is with
// reduce. This is just function composition. We end up with a base class we
// can extend below.
const base = mixins.reduce((cls, mixin) => mixin(cls), HTMLElement);


/**
 * A simple single-selection list box.
 *
 * This uses the base class we just created above, and adds in the behavior
 * unique to this list box element. As it turns out, much of this behavior is
 * also interesting to other components, and will eventually get factored into
 * other mixins.
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
 * @mixes SelectionAriaMixin
 * @mixes SelectionInViewMixin
 * @mixes ShadowTemplateMixin
 * @mixes SingleSelectionMixin
 */
class ListBox extends base {

  // We define a collection of default property values which can be set in
  // the constructor or connectedCallback. Defining the actual default values
  // in those calls would complicate things if a subclass someday wants to
  // define its own default value.
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

  // Define a template that will be stamped into the Shadow DOM by the
  // ShadowTemplateMixin.
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


customElements.define('sample-list-box', ListBox);
export default ListBox;
