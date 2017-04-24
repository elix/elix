//
// Copyright © 2016-2017 Component Kitchen, Inc. and contributors to the 
// Elix Project
//

import ShadowReferencesMixin from '../mixins/ShadowReferencesMixin';
import symbols from '../mixins/symbols';
import TabStrip from './TabStrip'; // jshint ignore:line


// Used to assign unique IDs to tabs for ARIA purposes.
let idCount = 0;


/**
 * A wrapper which adds strip of tabs for selecting one of the component's
 * children.
 *
 * The `TabStripWrapper` component does not define how a selected child is
 * represented. If you're looking for the standard behavior of just showing only
 * the selected child, you can use `TabStripWrapper` in combination with the
 * separate [Modes](Modes) component. The above combination is so common it
 * is provided as a single component, [Tabs](Tabs).
 *
 * `TabStripWrapper` defines a slot named "tabButtons" into which you can slot
 * the buttons that will be used to select the tab panels. That slot sits inside
 * a [TabStrip](TabStrip) instance, which handles keyboard navigation and
 * the ordering of the tab buttons.
 *
 * @module TabStripWrapper
 * @param base {Class} - The base class to extend
 * @returns {Class} The extended class
 */
export default function TabStripWrapper(base) {

  class TabStripWrap extends ShadowReferencesMixin(base) {

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }

      // Set default ARIA role for the overall component.
      if (this.getAttribute('role') == null && this[symbols.defaults].role) {
        this.setAttribute('role', this[symbols.defaults].role);
      }

      // Ensure we reflect attributes.
      const defaults = this[symbols.defaults];
      if (!this.getAttribute('tab-align')) {
        this.tabAlign = defaults.tabAlign;
      }
      if (!this.getAttribute('tab-position')) {
        this.tabPosition = defaults.tabPosition;
      }
    }

    get [symbols.defaults]() {
      const defaults = super[symbols.defaults] || {};
      defaults.role = 'tablist';
      defaults.tabAlign = 'start';
      defaults.tabPosition = 'top';
      return defaults;
    }

    [symbols.itemsChanged]() {
      if (super[symbols.itemsChanged]) { super[symbols.itemsChanged](); }

      const baseId = this.id ?
        "_" + this.id + "Panel" :
        "_panel";

      // Confirm that items have at least a default role and ID for ARIA purposes.
      this.items.forEach(item => {
        if (!item.getAttribute('role')) {
          item.setAttribute('role', 'tabpanel');
        }
        if (!item.id) {
          item.id = baseId + idCount++;
        }
      });
    }

    get selectedIndex() {
      return super.selectedIndex;
    }
    set selectedIndex(value) {
      if ('selectedIndex' in base.prototype) { super.selectedIndex = value; }
      if (this.tabStrip.selectedIndex !== value) {
        this.tabStrip.selectedIndex = value;
      }
    }

    [symbols.shadowCreated]() {
      if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
      this.$.tabStrip.addEventListener('selected-index-changed', event => {
        this.selectedIndex = event.detail.selectedIndex;
      });
    }

    get tabAlign() {
      return this.tabStrip.tabAlign;
    }
    set tabAlign(tabAlign) {
      if (this.tabStrip.tabAlign !== tabAlign) {
        this.tabStrip.tabAlign = tabAlign;
      }
      if (this.getAttribute('tab-align') !== tabAlign) {
        this.setAttribute('tab-align', tabAlign);
      }
    }

    get tabPosition() {
      return this.tabStrip.tabPosition;
    }
    set tabPosition(tabPosition) {
      if (this.tabStrip.tabPosition !== tabPosition) {
        this.tabStrip.tabPosition = tabPosition;
      }
      if (this.getAttribute('tab-position') !== tabPosition) {
        this.setAttribute('tab-position', tabPosition);
      }

      // Physically reorder the tabs and pages to reflect the desired arrangement.
      // We could change the visual appearance by reversing the order of the flex
      // box, but then the visual order wouldn't reflect the document order, which
      // determines focus order. That would surprise a user trying to tab through
      // the controls.
      const topOrLeft = (tabPosition === 'top' || tabPosition === 'left');
      const firstElement = topOrLeft ?
        this.$.tabStrip :
        this.$.pages;
      const lastElement = topOrLeft ?
        this.$.pages :
        this.$.tabStrip;
      if (firstElement.nextSibling !== lastElement) {
        this.shadowRoot.insertBefore(firstElement, lastElement);
      }
    }

    get tabs() {
      return this.tabStrip.items;
    }

    get tabStrip() {
      return this.$.tabStrip;
    }

    get [symbols.template]() {
      let baseTemplate = super[symbols.template] || '';
      if (baseTemplate instanceof HTMLTemplateElement) {
        baseTemplate = baseTemplate.innerHTML; // Downgrade to string.
      }
      return `
        <elix-tab-strip id="tabStrip">
          <slot name="tabButtons"></slot>
        </elix-tab-strip>

        <div id="pages">
          ${baseTemplate}
        </div>

        <style>
          :host {
            display: inline-flex;
            flex-direction: column;
            position: relative;
          }

          #pages {
            display: flex;
            flex: 1;
            flex-direction: column;
          }

          #pages ::slotted(*) {
            display: flex;
            flex: 1;
          }

          /* Left/right positions */
          :host([tab-position="left"]),
          :host([tab-position="right"]) {
            flex-direction: row;
          }

          /* Generic style */
          #pages {
            background: white;
            border: 1px solid #ccc;
            box-sizing: border-box;
          }
        </style>
      `;
    }

  }

  return TabStripWrap;
}
