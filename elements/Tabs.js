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


const generatedIdKey = Symbol('generatedId');
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
      tabPanelsTag: 'elix-modes',
      tabPosition: 'top'
    });
  }

  itemProps(item, calcs, original) {
    const base = super.itemProps ? super.itemProps(item, calcs, original) : {};
    
    // See notes in AriaListMixin for similar handling of ID.
    let id = item[generatedIdKey] ||
    original.attributes.id ||
    base.attributes && base.attributes.id;
    if (!id) {
      id = getIdForPanel(this, item, calcs.index);
      // Remember that we generated an ID for this item.
      item[generatedIdKey] = id;
    }
    
    // Look up corresponding tab button.
    const tabButtons = this.tabButtons;
    const tabButton = tabButtons && calcs.index < tabButtons.length ?
      tabButtons[calcs.index] :
      null;
    const tabButtonId = tabButton && tabButton.id;

    return {
      attributes: {
        id,
        'aria-labelledby': tabButtonId
      }
    };
  }

  get props() {
    const tabPosition = this.state.tabPosition;
    const lateralPosition = tabPosition === 'left' || tabPosition === 'right';

    // Generate tab buttons if necessary.
    /** @type {any} */
    const tabButtonsSlot = this.$.tabButtonsSlot
    const assignedButtons = tabButtonsSlot.assignedNodes();
    const tabButtons = assignedButtons.length > 0 ?
      [] :
      defaultTabButtons(this);

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
          childNodes: tabButtons
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
   * Default implementation of tabButtons property looks in the tab buttons slot
   * for items. If nothing is distributed to that slot, it generates an array of
   * elix-tab-button elements for use as tab buttons.
   */
  get tabButtons() {
    /** @type {any} */
    const tabButtonsSlot = this.$.tabButtonsSlot;
    const assignedButtons = tabButtonsSlot.assignedNodes();
    return assignedButtons.length > 0 ?
      assignedButtons :
      defaultTabButtons(this);
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
    const tabPanelsTag = this.state.tabPanelsTag;
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
      <${tabPanelsTag} id="tabPanels" style="display: flex; flex: 1;">
        <slot></slot>
      </${tabPanelsTag}>
    `;
  }

}


// Return the set of buttons generated for the given Tabs element.
function defaultTabButtons(element) {
  if (element.items !== element[previousItemsKey]) {
    // Items have changed; create new buttons set.
    element[tabButtonsKey] = element.items.map((panel, index) => {
      const label = panel.getAttribute('aria-label');
      const panelId = getIdForPanel(element, panel, index);
      const TabButtonClass = element.state.TabButtonClass;
      const tabButton = new TabButtonClass();
      const id = getIdForTabButton(element, index);
      tabButton.setAttribute('id', id);
      tabButton.setAttribute('aria-controls', panelId);
      tabButton.textContent = label;
      return tabButton;
    });
    // Make the array immutable.
    Object.freeze(element[tabButtonsKey]);
    element[previousItemsKey] = element.items;
  }
  return element[tabButtonsKey];
}


function getIdForTabButton(element, index) {
  const hostId = element.id ?
    "_" + element.id + "Button" :
    "_button";
  const id = `${hostId}${index}`;
  return id;
}


function getIdForPanel(element, panel, index) {
  let id = panel.id;
  if (!id) {
    const hostId = element.id ?
      "_" + element.id + "Panel" :
      "_panel";
    id = `${hostId}${index}`;
  }
  return id;
}


customElements.define('elix-tabs', Tabs);
export default Tabs;
