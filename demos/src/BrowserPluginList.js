/*
 * Demo of a list box with hard-coded contents.
 * As a list source, this enumerates `navigator.plugins`.
 */


import AttributeMarshallingMixin from '../../mixins/src/AttributeMarshallingMixin';
import ClickSelectionMixin from '../../mixins/src/ClickSelectionMixin';
import ContentItemsMixin from '../../mixins/src/ContentItemsMixin';
import DirectionSelectionMixin from '../../mixins/src/DirectionSelectionMixin';
import KeyboardDirectionMixin from '../../mixins/src/KeyboardDirectionMixin';
import KeyboardMixin from '../../mixins/src/KeyboardMixin';
import KeyboardPagedSelectionMixin from '../../mixins/src/KeyboardPagedSelectionMixin';
import KeyboardPrefixSelectionMixin from '../../mixins/src/KeyboardPrefixSelectionMixin';
import SelectionAriaMixin from '../../mixins/src/SelectionAriaMixin';
import SelectionInViewMixin from '../../mixins/src/SelectionInViewMixin';
import ShadowTemplateMixin from '../../mixins/src/ShadowTemplateMixin';
import SingleSelectionMixin from '../../mixins/src/SingleSelectionMixin';
import symbols from '../../mixins/src/symbols';


// We want to apply a number of mixin functions to HTMLElement.
const mixins = [
  AttributeMarshallingMixin,
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


class BrowserPluginList extends base {

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

  // HACK to work around limitations of pre-v1 ShadyCSS.
  [symbols.itemAdded](item) {
    if (super[symbols.itemAdded]) { super[symbols.itemAdded](item); }
    item.classList.add('style-scope');
    item.classList.add('browser-plugin-list');
  }

  // Map item selection to a `selected` CSS class.
  [symbols.itemSelected](item, selected) {
    if (super[symbols.itemSelected]) { super[symbols.itemSelected](item, selected); }
    item.classList.toggle('selected', selected);
  }

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
    const choices = [...navigator.plugins].map(plugin => plugin.name);
    const sorted = choices.sort();
    setOptions(this, sorted);
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
        display: inline-flex;
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

      <div id="devicesContainer" role="none"></div>
    `;
  }

}


function setOptions(element, options) {
  const container = element.shadowRoot.querySelector('#devicesContainer');
  while (container.children.length > 0) {
    container.children[0].remove();
  }
  const divs = options.map(option => {
    const div = document.createElement('div');
    div.textContent = option;
    return div;
  });
  divs.forEach(option => container.appendChild(option));
  element[symbols.contentChanged]();
}


customElements.define('browser-plugin-list', BrowserPluginList);
export default BrowserPluginList;
