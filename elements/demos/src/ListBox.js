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


import ClickSelectionMixin from '../../elix-mixins/src/ClickSelectionMixin';
import SelectionAriaMixin from '../../elix-mixins/src/SelectionAriaMixin';
import ShadowTemplateMixin from '../../elix-mixins/src/ShadowTemplateMixin';
import SingleSelectionMixin from '../../elix-mixins/src/SingleSelectionMixin';
import symbols from '../../elix-mixins/src/symbols';


// We want to apply a number of mixin functions to HTMLElement.
const mixins = [
  ClickSelectionMixin,
  SelectionAriaMixin,
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
 * @mixes ClickSelectionMixin
 * @mixes SelectionAriaMixin
 * @mixes ShadowTemplateMixin
 * @mixes SingleSelectionMixin
 */
class ListBox extends base {

  constructor() {
    super();

    // Simplistic keyboard handling for Left/Right and Up/Down keys.
    this.addEventListener('keydown', event => {
      this[symbols.raiseChangeEvents] = true;
      let handled = false;
      switch(event.keyCode) {
        case 37: // Left
        case 38: // Up
          handled = this.selectPrevious();
          break;
        case 39: // Right
        case 40: // Down
          handled = this.selectNext();
          break;
      }
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
      this[symbols.raiseChangeEvents] = false;
    });

    // The list needs to initialize any items it starts with by invoking the
    // itemsChanged method. Mixins like the ARIA mixin will then use that signal
    // to apply attributes to each item, as well as to the list element itself.
    // For now, we invoke the method manually, but eventually we'll want a mixin
    // to handle this common need. Because the Custom Element spec prevents an
    // element from modifying itself in its own constructor, we do so in
    // timeout.
    setTimeout(() => {
      this[symbols.itemsChanged]();
    });
  }

  // Map attribute changes to the corresponding property.
  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (super.attributeChangedCallback) { super.attributeChangedCallback(attributeName, oldValue, newValue); }
    if (attributeName === 'selected-index') {
      this.selectedIndex = parseInt(newValue);
    }
  }

  connectedCallback() {
    if (super.connectedCallback) { super.connectedCallback(); }
    // Set a default tabindex so that the element can receive focus. That lets
    // us support keyboard selection. We take care to avoid ovewritting any
    // tabindex that's explicitly set on the list element.
    if (this.getAttribute('tabindex') == null && this[symbols.defaults].tabindex !== null) {
      this.setAttribute('tabindex', this[symbols.defaults].tabindex);
    }
  }

  // We define a collection of default property values which can be set in
  // the constructor or connectedCallback. Defining the actual default values
  // in those calls would complicate things if a subclass someday wants to
  // define its own default value.
  get [symbols.defaults]() {
    const defaults = super[symbols.defaults] || {};
    // The default tab index is 0 (document order).
    defaults.tabindex = 0;
    return defaults;
  }

  // Map item selection to a `selected` CSS class.
  [symbols.itemSelected](item, selected) {
    if (super[symbols.itemSelected]) { super[symbols.itemSelected](item, selected); }
    item.classList.toggle('selected', selected);
  }

  // Simplistic implementation of an items property so that SingleSelectionMixin
  // has items to work with. This doesn't handle Shadow DOM redistribution, so
  // if someone puts a slot element inside the list, it won't behave as
  // expected.
  get items() {
    return this.children;
  }

  // A simplistic implementation of itemsChanged. A real implementation
  // would also need to track changes in the set of children, and invoke
  // itemAdded for new children.
  [symbols.itemsChanged]() {
    Array.prototype.forEach.call(this.items, child => {
      this[symbols.itemAdded](child);
    });
  }

  // Tell the browser which attributes we want to handle.
  static get observedAttributes() {
    return ['selected-index'];
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
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll; /* for momentum scrolling */
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

}


customElements.define('sample-list-box', ListBox);
export default ListBox;
