import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import ClickSelectionMixin from '../mixins/ClickSelectionMixin.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import DefaultSlotContentMixin from '../mixins/DefaultSlotContentMixin.js';
import DirectionSelectionMixin from '../mixins/DirectionSelectionMixin.js';
import KeyboardDirectionMixin from '../mixins/KeyboardDirectionMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin.js';
import Symbol from '../mixins/Symbol.js';
import symbols from '../mixins/symbols.js';


// Symbols for private data members on an element.
const tabAlignSymbol = Symbol('tabAlign');
const tabPositionSymbol = Symbol('tabPosition');


const Base =
  AttributeMarshallingMixin(
  ClickSelectionMixin(
  ContentItemsMixin(
  DefaultSlotContentMixin(
  DirectionSelectionMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  ShadowTemplateMixin(
  SingleSelectionMixin(
    HTMLElement
  )))))))));


/**
 * A container for a set of tab buttons.
 *
 * `TabStrip` is specifically responsible for handling keyboard navigation
 * between tab buttons, and for the visual layout of the buttons.
 *
 * The user can select a tab with the mouse or touch, as well as by through the
 * keyboard. Each tab appears as a separate button in the tab order.
 * Additionally, if the focus is currently on a tab, the user can quickly
 * navigate between tabs with the left/right arrow keys (or, if the tabs are
 * in vertical position, the up/down arrow keys).
 *
 * By default, the tabs are shown aligned to the left (in left-to-right
 * languages like English), where each tab is only as big as necessary. You
 * can adjust the alignment of the tabs with the `tabAlign` property.
 *
 * The component assumes that the tab buttons will appear above the tab panels
 * they control. You can adjust that positioning with the `tabPosition`
 * property.
 *
 * A `TabStrip` is often wrapped around a set of tab panels, a scenario which
 * can be handled with the separate [TabStripWrapper](TabStripWrapper)
 * component.
 *
 * @extends HTMLElement
 * @mixes AttributeMarshallingMixin
 * @mixes ClickSelectionMixin
 * @mixes ContentItemsMixin
 * @mixes DefaultSlotContentMixin
 * @mixes DirectionSelectionMixin
 * @mixes KeyboardMixin
 * @mixes KeyboardDirectionMixin
 * @mixes ShadowTemplateMixin
 * @mixes SingleSelectionMixin
 */
class TabStrip extends Base {

  constructor() {
    super();

    // Set defaults.
    const defaults = this[symbols.defaults];
    if (typeof this.tabAlign === 'undefined') {
      this.tabAlign = defaults.tabAlign;
    }
    if (typeof this.tabPosition === 'undefined') {
      this.tabPosition = defaults.tabPosition;
    }
  }

  get [symbols.defaults]() {
    const defaults = super[symbols.defaults] || {};
    defaults.tabindex = null;
    defaults.tabAlign = 'start';
    defaults.tabPosition = 'top';
    defaults.selectionRequired = true;
    return defaults;
  }

  [symbols.itemAdded](item) {
    if (super[symbols.itemAdded]) { super[symbols.itemAdded](item); }
    item.setAttribute('role', 'tab');
    item.setAttribute('tabindex', 0);
  }

  [symbols.itemSelected](item, selected) {
    if (super[symbols.itemSelected]) { super[symbols.itemSelected](item, selected); }
    if (selected) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
    item.setAttribute('aria-selected', selected);
  }

  [symbols.keydown](event) {

    let handled;

    // Let user select a tab button with Enter or Space.
    switch (event.keyCode) {
      case 13: /* Enter */
      case 32: /* Space */
        const index = this.items.indexOf(event.target);
        if (index !== this.selectedIndex) {
          this.selectedIndex = index;
          handled = true;
        }
        break;
    }

    // Give mixins a chance to do work.
    handled = handled || (super[symbols.keydown] && super[symbols.keydown](event));

    if (handled && this.selectedItem instanceof HTMLElement) {
      // If the event resulted in a change of selection, move the focus to the
      // newly-selected tab.
      this.selectedItem.focus();
    }

    return handled;
  }

  /**
   * @type {string}
   */
  get tabAlign() {
    return this[tabAlignSymbol];
  }
  set tabAlign(tabAlign) {
    this[tabAlignSymbol] = tabAlign;
    this.reflectAttribute('tab-align', tabAlign);
  }

  /**
   * The position of the tab strip relative to the element's children. Valid
   * values are "top", "left", "right", and "bottom".
   *
   * @default "top"
   * @type {string}
   */
  get tabPosition() {
    return this[tabPositionSymbol];
  }
  set tabPosition(tabPosition) {
    this[tabPositionSymbol] = tabPosition;
    this.reflectAttribute('tab-position', tabPosition);
    this.navigationAxis = (tabPosition === 'top' || tabPosition === 'bottom') ?
      'horizontal' :
      'vertical';

    // Let tabs know their tab position, too.
    [].forEach.call(this.items, tab => {
      tab.setAttribute('tab-position', tabPosition);
    });
  }

  [symbols.template](filler) {
    return `
      <style>
        :host {
          display: inline-flex;
        }

        /*
         * Avoid having tab container stretch across. User won't be able to see
         * it, but since it handles the keyboard, in Mobile Safari a tap on the
         * container background will cause the region to flash. Aligning the
         * region collapses it down to hold its contents.
         */
        #tabButtonContainer {
          /* For IE bug (clicking tab produces gap between tab and page). */
          display: flex;
          flex-direction: row;
          flex: 1;
          /*
           * Try to obtain fast-tap behavior on all tabs.
           * See https://webkit.org/blog/5610/more-responsive-tapping-on-ios/.
           */
          touch-action: manipulation;
        }

        /* Left/right positions */
        :host([tab-position="left"]) #tabButtonContainer,
        :host([tab-position="right"]) #tabButtonContainer {
          flex-direction: column;
        }

        /* Alignment */
        :host([tab-align="start"]) #tabButtonContainer {
          justify-content: flex-start;
        }
        :host([tab-align="center"]) #tabButtonContainer {
          justify-content: center;
        }
        :host([tab-align="end"]) #tabButtonContainer {
          justify-content: flex-end;
        }
        :host([tab-align="stretch"]) #tabButtonContainer > ::slotted(*) {
          flex: 1;
        }
      </style>

      <div id="tabButtonContainer" role="none">
        ${filler || `<slot></slot>`}
      </div>
    `;
  }
}


customElements.define('elix-tab-strip', TabStrip);
export default TabStrip;
