/*
 * Demo of a list box with hard-coded contents.
 */


import ClickSelectionMixin from '../../elix-mixins/src/ClickSelectionMixin';
import ContentItemsMixin from '../../elix-mixins/src/ContentItemsMixin';
import DirectionSelectionMixin from '../../elix-mixins/src/DirectionSelectionMixin';
import KeyboardDirectionMixin from '../../elix-mixins/src/KeyboardDirectionMixin';
import KeyboardMixin from '../../elix-mixins/src/KeyboardMixin';
import KeyboardPagedSelectionMixin from '../../elix-mixins/src/KeyboardPagedSelectionMixin';
import KeyboardPrefixSelectionMixin from '../../elix-mixins/src/KeyboardPrefixSelectionMixin';
import SelectionAriaMixin from '../../elix-mixins/src/SelectionAriaMixin';
import SelectionInViewMixin from '../../elix-mixins/src/SelectionInViewMixin';
import ShadowTemplateMixin from '../../elix-mixins/src/ShadowTemplateMixin';
import SingleSelectionMixin from '../../elix-mixins/src/SingleSelectionMixin';
import symbols from '../../elix-mixins/src/symbols';


// We want to apply a number of mixin functions to HTMLElement.
const mixins = [
  ClickSelectionMixin,
  ContentItemsMixin,
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


class MediaDeviceList extends base {

  // Map attribute changes to the corresponding property.
  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (super.attributeChangedCallback) { super.attributeChangedCallback(attributeName, oldValue, newValue); }
    const mapAttributeToProperty = {
      'selected-index': 'selectedIndex'
    };
    const propertyName = mapAttributeToProperty[attributeName] || attributeName;
    this[propertyName] = newValue;
  }

  get [symbols.content]() {
    return this.shadowRoot.querySelector('#devicesContainer').children;
  }

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

  // Tell the browser which attributes we want to handle.
  static get observedAttributes() {
    return ['selected-index'];
  }

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
    this[symbols.contentChanged]();
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

      #devicesContainer {
        flex: 1;
        -webkit-overflow-scrolling: touch; /* for momentum scrolling */
        overflow-x: hidden;
        overflow-y: scroll;
      }

      #devicesContainer > * {
        cursor: default;
        padding: 0.25em;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      #devicesContainer > .selected {
        background: highlight;
        color: highlighttext;
      }
      </style>

      <div id="devicesContainer" role="none">
        <div>Device 1</div>
        <div>Device 2</div>
        <div>Device 3</div>
      </div>
    `;
  }

}


customElements.define('media-device-list', MediaDeviceList);
export default MediaDeviceList;
