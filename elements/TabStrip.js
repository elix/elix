import { html } from '../node_modules/lit-html/lit-html.js';
import { mergeDeep } from '../mixins/helpers.js';
import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import ClickSelectionMixin from '../mixins/ClickSelectionMixin.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import DefaultSlotContentMixin from '../mixins/DefaultSlotContentMixin.js';
import DirectionSelectionMixin from '../mixins/DirectionSelectionMixin.js';
import KeyboardDirectionMixin from '../mixins/KeyboardDirectionMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
// import LanguageDirectionMixin from '../mixins/LanguageDirectionMixin';
import LitHtmlShadowMixin from '../mixins/LitHtmlShadowMixin.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import SelectionAriaMixin from '../mixins/SelectionAriaMixin.js';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin.js';
import symbols from '../mixins/symbols.js';


const Base =
  AttributeMarshallingMixin(
  ClickSelectionMixin(
  ContentItemsMixin(
  DefaultSlotContentMixin(
  DirectionSelectionMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  LitHtmlShadowMixin(
  ReactiveMixin(
  SelectionAriaMixin(
  SingleSelectionMixin(
    HTMLElement
  )))))))))));


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

  componentDidUpdate() {
    if (super.componentDidUpdate) { super.componentDidUpdate(); }

    // If the selectedIndex changes due to keyboard action within this
    // component, the old tab button might still have focus. Ensure the new
    // selected tab button has the focus.
    const selectedItem = this.selectedItem;
    if (selectedItem &&
      this.contains(document.activeElement) &&
      selectedItem !== document.activeElement &&
      selectedItem instanceof HTMLElement) {
      selectedItem.focus();
    }
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      orientation: 'horizontal',
      selectionRequired: true,
      tabAlign: 'start',
      tabButtonRole: 'tab',
      tabPosition: 'top'
    });
  }

  hostProps(original) {
    const base = super.hostProps ? super.hostProps(original) : {};

    const tabPosition = this.state.tabPosition;
    const lateralPosition = tabPosition === 'left' || tabPosition === 'right';
    const lateralStyle = {
      'flexDirection': 'column'
    };

    const tabAlign = this.state.tabAlign;
    const alignStyles = {
      'center': {
        'justifyContent': 'center'
      },
      'end': {
        'justifyContent': 'flex-end'
      },
      'start': {
        'justifyContent': 'flex-start'
      }
      // No style needed for "stretch"
    };
    const alignStyle = alignStyles[tabAlign];

    const style = Object.assign(
      {},
      original.style,
      base.style,
      {
        'display': 'flex',
      },
      lateralPosition && lateralStyle,
      alignStyle
    );
    const role = original.role || 'tablist';
    return mergeDeep(base, {
      role,
      style
    });
  }

  itemProps(item, index, original) {
    const base = super.itemProps ? super.itemProps(item, index, original) : {};

    const itemStyle = {
      'cursor': 'pointer',
      'fontFamily': 'inherit',
      'fontSize': 'inherit',
      // 'outline': 'none',
      // 'position': 'relative',
      'WebkitTapHighlightColor': 'transparent',
    };

    const tabAlign = this.state.tabAlign;
    const tabPosition = this.state.tabPosition;

    const selected = index === this.state.selectedIndex;

    const classes = Object.assign(
      {},
      original.classes,
      base.classes,
      { selected }
    );

    const role = original.tabButtonRole || this.state.tabButtonRole;
    const style = Object.assign(
      {},
      base.style,
      itemStyle
    );

    // const isComponent = typeof item.type === 'function';
    // const componentProps = {
    //   index,
    //   selected,
    //   tabAlign,
    //   tabPosition
    // };

    return mergeDeep(
      base,
      {
        classes,
        role,
        style
      },
      // isComponent && componentProps
    );
  }

  [symbols.keydown](event) {

    let handled;

    // Let user select a tab button with Enter or Space.
    switch (event.keyCode) {
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

  get template() {
    return html`<slot></slot>`;
  }

}


customElements.define('elix-tab-strip', TabStrip);
export default TabStrip;
