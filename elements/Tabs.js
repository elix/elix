import { html } from '../node_modules/lit-html/lit-html.js';
import { formatStyleProps, mergeProps } from '../mixins/props.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import DefaultSlotContentMixin from '../mixins/DefaultSlotContentMixin.js';
import LitHtmlShadowMixin from '../mixins/LitHtmlShadowMixin.js';
import Modes from './Modes.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin';
import TabButton from './TabButton.js';
import TabStrip from './TabStrip.js';
import symbols from '../mixins/symbols.js';


const Base =
  ContentItemsMixin(
  DefaultSlotContentMixin(
  LitHtmlShadowMixin(
  ReactiveMixin(
  SingleSelectionMixin(
    HTMLElement
  )))));


/**
 * A set of pages with a tab strip governing which page is shown.
 *
 * Use tabs when you want to provide a large set of options or elements than
 * can comfortably fit inline, the options can be coherently grouped into pages,
 * and you want to avoid making the user navigate to a separate page. Tabs work
 * best if you only have a small handful of pages, say 2–7.
 *
 * This stock combination applies the [TabStripWrapper](TabStripWrapper) to a
 * [Modes](Modes) element. The former takes care of the relative positioning
 * of the tab buttons and tab panels; the latter takes care of displaying only
 * the currently-selected tab panel. If you'd like to create something more
 * complex than this arrangement, you can use either of those elements on its
 * own.
 *
 * You will need to provide `Tabs` with the buttons that will select the
 * corresponding tab panels. Do this by slotting the buttons into the slot named
 * "tabButtons". If you don't require custom tab buttons, you can use the more
 * specialized [LabeledTabs](LabeledTabs) component, which will generate text
 * tab buttons for you.
 *
 * @extends Modes
 */
class Tabs extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectionRequired: true,
      tabAlign: 'start',
      tabPosition: 'top'
    });
  }

  hostProps(original) {
    const base = super.hostProps ? super.hostProps(original) : {};
    const tabPosition = this.state.tabPosition;
    const lateralPosition = tabPosition === 'left' || tabPosition === 'right';
    const lateralStyle = {
      'flexDirection': 'row'
    };
    const style = Object.assign(
      {},
      original.style,
      {
        'display': 'inline-flex',
        'flexDirection': 'column',
        'position': 'relative'
      },
      lateralPosition && lateralStyle
    );
    return mergeProps(base, { style });
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

  /**
   * Default implementation of tabButtons property uses TabButton components for
   * the tab buttons.
   */
  // tabButtons() {
  //   if (this.state.tabButtons) {
  //     return this.state.tabButtons;
  //   }
  //   return this.state.children.map((panel, index) => {
  //     const label = panel.props['aria-label'];
  //     const panelId = panel.props.id || `_panel${index}`;
  //     const TabButtonClass = this.state.tabButtonClass || TabButton;
  //     return (
  //       <TabButtonClass key={index} aria-controls={panelId} tabIndex="0">{label}</TabButtonClass>
  //     );
  //   });
  // }

  get [symbols.template]() {

    const tabStripStyle = {
      'zIndex': 1
    };

    const tabPanelsContainerStyle = {
      'background': 'white',
      'border': '1px solid #ccc',
      'box-sizing': 'border-box',
      'display': 'flex',
      'flex': 1
    };

    // Create the tab strip and tab panels.
    // TODO: handle selected-index-changed
    const tabStrip = html`
      <elix-tab-strip
        selected-index=${this.state.selectedIndex}
        style=${formatStyleProps(tabStripStyle)}
        tabAlign=${this.state.tabAlign}
        tabPosition=${this.state.tabPosition}
        >
        <slot name="tabButtons"></slot>
      </elix-tab-strip>
    `;

    const tabPanels = html`
      <elix-modes
        selected-index=${this.state.selectedIndex}
        style=${formatStyleProps(tabPanelsContainerStyle)}
        >
        <slot></slot>
      </elix-modes>
    `;

    // Physically reorder the tabs and panels to reflect the desired arrangement.
    // We could change the visual appearance by reversing the order of the flex
    // box, but then the visual order wouldn't reflect the document order, which
    // determines focus order. That would surprise a user trying to tab through
    // the controls.
    const tabPosition = this.state.tabPosition;
    const topOrLeftPosition = (tabPosition === 'top' || tabPosition === 'left');
    const firstElement = topOrLeftPosition ?
      tabStrip :
      tabPanels;
    const lastElement = topOrLeftPosition ?
      tabPanels :
      tabStrip;

    return html`
      ${firstElement}
      ${lastElement}
    `;
  }

}

customElements.define('elix-tabs', Tabs);
export default Tabs;
