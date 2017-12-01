import { merge } from './updates.js';
import AriaListMixin from './AriaListMixin.js';
import ClickSelectionMixin from './ClickSelectionMixin.js';
import ContentItemsMixin from './ContentItemsMixin.js';
import deepContains from './deepContains.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import ElementBase from './ElementBase.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';
import symbols from './symbols.js';


const Base =
  AriaListMixin(
  ClickSelectionMixin(
  ContentItemsMixin(
  DirectionSelectionMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  LanguageDirectionMixin(
  SingleSelectionMixin(
  SlotContentMixin(
    ElementBase
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
 * @mixes AriaListMixin
 * @mixes ClickSelectionMixin
 * @mixes ContentItemsMixin
 * @mixes DirectionSelectionMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes LanguageDirectionMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotContentMixin
 */
class TabStrip extends Base {

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }

    // Does this component, or any of its assigned nodes, have focus?
    // This is a surprisingly hard question to answer.
    // Try finding the deepest active element, then walking up.
    let activeElement = document.activeElement;
    while (activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
      activeElement = activeElement.shadowRoot.activeElement;
    }
    const focused = deepContains(this, activeElement);

    // Ensure the selected tab button has the focus.
    const selectedItem = this.selectedItem;
    if (focused &&
      selectedItem &&
      selectedItem instanceof HTMLElement &&
      selectedItem !== document.activeElement) {
      selectedItem.focus();
    }
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      orientation: 'horizontal',
      selectionRequired: true,
      tabAlign: 'start',
      tabButtonRole: 'tab',
      tabindex: null,
      tabPosition: 'top'
    });
  }

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};

    const tabAlign = this.state.tabAlign;
    const tabPosition = this.state.tabPosition;

    return merge(base, {
      attributes: {
        index: calcs.index,
        role: original.attributes.role || this.state.tabButtonRole,
        'tab-align': tabAlign,
        'tab-position': tabPosition
      },
      classes: {
        selected: calcs.selected
      },
      style: {
        'cursor': 'pointer',
        'font-family': 'inherit',
        'font-size': 'inherit',
        '-webkit-tap-highlight-color': 'transparent'
      }
    });
  }

  [symbols.keydown](event) {

    let handled;

    // Let user select a tab button with Enter or Space.
    switch (event.keyCode) {
      /* eslint-disable no-case-declarations */
      case 13: /* Enter */
      case 32: /* Space */
        // TODO
        // const index = this.indexOfTarget(event.target);
        const index = this.items && this.items.indexOf(event.target);
        handled = this.updateSelectedIndex(index);
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event)) || false;
  }

  // TabStrip orientation depends on tabPosition property.
  get orientation() {
    const tabPosition = this.state.tabPosition;
    return tabPosition === 'top' || tabPosition === 'bottom' ?
      'horizontal' :
      'vertical';
  }

  get tabAlign() {
    return this.state.tabAlign;
  }
  set tabAlign(tabAlign) {
    this.setState({ tabAlign });
  }

  get tabPosition() {
    return this.state.tabPosition;
  }
  set tabPosition(tabPosition) {
    this.setState({ tabPosition });
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          display: flex;
        }
      </style>
      <slot></slot>
    `;
  }

  get updates() {
    const base = super.updates || {};
    const original = this.state.original;

    const tabPosition = this.state.tabPosition;
    const lateralPosition = tabPosition === 'left' || tabPosition === 'right';
    const tabAlign = this.state.tabAlign;
    const justifyContent = {
      'center': 'center',
      'end': 'flex-end',
      'start': 'flex-start',
      'stretch': null // No style needed for "stretch"
    };

    return merge(base, {
      attributes: {
        role: original.attributes.role || 'tablist'
      },
      style: {
        'flex-direction': lateralPosition ? 'column' : 'row',
        'justify-content': justifyContent[tabAlign] || original.style['justify-content']
      }
    });
  }

}


customElements.define('elix-tab-strip', TabStrip);
export default TabStrip;
