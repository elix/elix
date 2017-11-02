import * as props from '../mixins/props.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import ElementBase from './ElementBase.js';
// @ts-ignore
import Modes from './Modes.js'; // eslint-disable-line no-unused-vars
import SingleSelectionMixin from '../mixins/SingleSelectionMixin.js';
import TabButton from './TabButton.js';
// @ts-ignore
import TabStrip from './TabStrip.js'; // eslint-disable-line no-unused-vars
import SlotContentMixin from '../mixins/SlotContentMixin.js';
import Symbol from '../mixins/Symbol.js';
import symbols from '../mixins/symbols.js';


const previousItemsKey = Symbol('previousItems');
const tabButtonsKey = Symbol('tabButtons');


const Base =
  ContentItemsMixin(
  SingleSelectionMixin(
  SlotContentMixin(
    ElementBase
  )));


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

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.tabStrip.addEventListener('selected-index-changed', () => {
      /** @type {any} */
      const tabStrip = this.$.tabStrip;
      this.updateSelectedIndex(tabStrip.selectedIndex);
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectionRequired: true,
      tabAlign: 'start',
      TabButtonClass: TabButton,
      tabPosition: 'top'
    });
  }

  get props() {
    const tabPosition = this.state.tabPosition;
    const lateralPosition = tabPosition === 'left' || tabPosition === 'right';

    // Some of the styling applied to the tabStrip and tabPanels is static, and
    // properly should be done through static CSS in the template. However,
    // Edge's flex box implementation seems to struggle with dynamic changes to
    // properties like flex-direction, and works better if we reapply the
    // styling each time.
    return props.merge(super.props, {
      style: {
        'flex-direction': lateralPosition ? 'row' : 'column'
      },
      $: {
        tabStrip: {
          attributes: {
            'selected-index': this.state.selectedIndex,
            'tab-align': this.state.tabAlign,
            'tab-position': this.state.tabPosition
          },
          style: {
            'z-index': 1
          }
        },
        tabButtonsSlot: {
          childNodes: this.tabButtons
        },
        tabPanels: {
          attributes: {
            'selected-index': this.state.selectedIndex
          },
          style: {
            'background': 'white',
            'border': '1px solid #ccc',
            'box-sizing': 'border-box',
            'flex': 1
          }
        }
      }
    });
  }

  get tabAlign() {
    return this.state.tabAlign;
  }
  set tabAlign(tabAlign) {
    this.setState({ tabAlign });
  }
  
  /**
   * Default implementation of tabButtons property uses elix-tab-button elements for
   * the tab buttons.
   */
  get tabButtons() {
    if (this.items !== this[previousItemsKey]) {
      // Items have changed; create new buttons set.
      this[tabButtonsKey] = this.items.map((panel, index) => {
        const label = panel.getAttribute('aria-label');
        const panelId = panel.getAttribute('id') || `_panel${index}`;
        const TabButtonClass = this.state.TabButtonClass;
        const tabButton = new TabButtonClass();
        tabButton.setAttribute('aria-controls', panelId);
        tabButton.textContent = label;
        return tabButton;
      });
      // Make the array immutable.
      Object.freeze(this[tabButtonsKey]);
      this[previousItemsKey] = this.items;
    }
    return this[tabButtonsKey];
  }

  get tabPosition() {
    return this.state.tabPosition;
  }
  set tabPosition(tabPosition) {
    this.setState({ tabPosition });
  }

  [symbols.render]() {
    if (super[symbols.render]) { super[symbols.render](); }

    // Physically reorder the tabs and panels to reflect the desired arrangement.
    // We could change the visual appearance by reversing the order of the flex
    // box, but then the visual order wouldn't reflect the document order, which
    // determines focus order. That would surprise a user trying to tab through
    // the controls.
    const tabPosition = this.state.tabPosition;
    const topOrLeftPosition = (tabPosition === 'top' || tabPosition === 'left');
    const firstElement = topOrLeftPosition ?
      this.$.tabStrip :
      this.$.tabPanels;
    const lastElement = topOrLeftPosition ?
      this.$.tabPanels :
      this.$.tabStrip;
    if (!this.shadowRoot) {
      /* eslint-disable no-console */
      console.warn(`Tabs expects a component to define a shadowRoot.`);
    } else if (firstElement.nextSibling !== lastElement) {
      this.shadowRoot.insertBefore(firstElement, lastElement);
    }
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          display: inline-flex;
          position: relative;
        }
      </style>
      <elix-tab-strip id="tabStrip">
        <slot id="tabButtonsSlot" name="tabButtons"></slot>
      </elix-tab-strip>
      <elix-modes id="tabPanels" style="display: flex; flex: 1;">
        <slot></slot>
      </elix-modes>
    `;
  }

}

customElements.define('elix-tabs', Tabs);
export default Tabs;
