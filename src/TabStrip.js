import { deepContains } from './utilities.js';
import { html } from './templates.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import AriaListMixin from './AriaListMixin.js';
import ClickSelectionMixin from './ClickSelectionMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import ReactiveElement from './ReactiveElement.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotItemsMixin from './SlotItemsMixin.js';


const Base =
  AriaListMixin(
  ClickSelectionMixin(
  DirectionSelectionMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  LanguageDirectionMixin(
  SingleSelectionMixin(
  SlotItemsMixin(
    ReactiveElement
  ))))))));


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
 * they control. You can adjust that positioning with the `position`
 * property.
 *
 * A `TabStrip` is often wrapped around a set of tab panels, a scenario which
 * can be handled with the separate [TabStripWrapper](TabStripWrapper)
 * component.
 *
 * @inherits ReactiveElement
 * @mixes AriaListMixin
 * @mixes ClickSelectionMixin
 * @mixes DirectionSelectionMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes LanguageDirectionMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotItemsMixin
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
      position: 'top'
    });
  }

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};

    const tabAlign = this.state.tabAlign;
    const position = this.state.position;

    return merge(base, {
      attributes: {
        index: calcs.index,
        role: original.attributes.role || this.state.tabButtonRole,
        'tab-align': tabAlign,
        position
      },
      classes: {
        selected: calcs.selected
      },
      style: {
        'cursor': 'pointer',
        'font-family': 'inherit',
        'font-size': 'inherit',
        '-webkit-tap-highlight-color': 'transparent',
        'z-index': 1
      }
    });
  }

  [symbols.keydown](event) {

    let handled;

    // Let user select a tab button with Enter or Space.
    switch (event.key) {
      /* eslint-disable no-case-declarations */
      case ' ':
      case 'Enter':
        // TODO
        // const index = this.indexOfTarget(event.target);
        const selectedIndex = this.items && this.items.indexOf(event.target);
        const previousIndex = this.state.selectedIndex;
        this.setState({ selectedIndex });
        handled = this.state.selectedIndex !== previousIndex;
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event)) || false;
  }

  // TabStrip orientation depends on position property.
  get orientation() {
    return this.state.orientation;
  }

  /**
   * The alignment of the tabs within the tab strip.
   * 
   * @type {('start'|'center'|'end'|'stretch')}
   * @default 'start'
   */
  get tabAlign() {
    return this.state.tabAlign;
  }
  set tabAlign(tabAlign) {
    this.setState({ tabAlign });
  }

  /**
   * The position of the tab strip with respect to the associated tab panels.
   * 
   * Setting this property does not actually change the tab strip's position in
   * the document, but works as a signal to the contained tab buttons as to how
   * they should present themselves. The standard [TabButton](TabButton) uses
   * this information, for example, to remove the visible border between the tab
   * button and its associated panel.
   * 
   * @type {('bottom'|'left'|'right'|'top')}
   * @default 'top'
   */
  get position() {
    return this.state.position;
  }
  set position(position) {
    const orientation = position === 'top' || position === 'bottom' ?
      'horizontal' :
      'vertical';
    this.setState({
      orientation,
      position
    });
  }

  get [symbols.template]() {
    return html`
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

    const position = this.state.position;
    const lateralPosition = position === 'left' || position === 'right';
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
