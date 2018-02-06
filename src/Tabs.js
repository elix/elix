import './Modes.js';
import './TabButton.js';
import './TabStrip.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import ContentItemsMixin from './ContentItemsMixin.js';
import CustomTagsMixin from './CustomTagsMixin.js';
import ElementBase from './ElementBase.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';
import TabButton from './TabButton.js';


const generatedIdKey = Symbol('generatedId');
const previousItemsKey = Symbol('previousItems');
const tabButtonsKey = Symbol('tabButtons');


const Base =
  ContentItemsMixin(
  CustomTagsMixin(
  SingleSelectionMixin(
  SlotContentMixin(
    ElementBase
  ))));


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
 * @inherits ElementBase
 * @mixes ContentItemsMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotContentMixin
 */
class Tabs extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.tabStrip.addEventListener('selected-index-changed', () => {
      /** @type {any} */
      const tabStrip = this.$.tabStrip;
      this.selectedIndex = tabStrip.selectedIndex;
    });
    this.$.tabButtonsSlot.addEventListener('slotchange', () => {
      updateDefaultTabButtons(this);
    });
  }

  /* eslint-disable no-unused-vars */
  componentDidUpdate(previousState) {
    if (super.componentDidMount) { super.componentDidMount(); }
    updateDefaultTabButtons(this);
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectionRequired: true,
      tabAlign: 'start',
      tabButtons: [],
      tabPosition: 'top'
    });
  }

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
    
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
      console.warn(`Tabs expects ${this.constructor.name} to define a shadowRoot.\nThis can be done with ShadowTemplateMixin: https://elix.org/documentation/ShadowTemplateMixin.`);
    } else if (firstElement.nextSibling !== lastElement) {
      this.shadowRoot.insertBefore(firstElement, lastElement);
    }
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
   * Returns the set of tab buttons.
   * 
   * By default, this looks in the slot named `tabButtons` for items. If nothing
   * is assigned to that slot, this generates an array of [TabButton](TabButton)
   * elements for use as tab buttons, one for each tab panel.
   * 
   * You can override this if you want the component to treat a different
   * collection of elements as the tab buttons.
   * 
   * @returns {Element[]}
   */
  get tabButtons() {
    /** @type {any} */
    const tabButtonsSlot = this.$.tabButtonsSlot;
    const assignedButtons = tabButtonsSlot.assignedNodes({ flatten: true });
    return assignedButtons.length > 0 ?
      assignedButtons :
      defaultTabButtons(this);
  }

  /**
   * The position of the tab strip with respect to the associated tab panels.
   * 
   * @type {('bottom'|'left'|'right'|'top')}
   * @default 'top'
   */
  get tabPosition() {
    return this.state.tabPosition;
  }
  set tabPosition(tabPosition) {
    this.setState({ tabPosition });
  }

  get tags() {
    const base = super.tags || {};
    return Object.assign({}, super.tags, {
      tabButton: base.tabButton || 'elix-tab-button',
      tabPanels: base.tabPanels || 'elix-modes'
    });
  }
  set tags(tags) {
    super.tags = tags;
  }

  get [symbols.template]() {
    const tabPanelsTag = this.tags.tabPanels;
    return `
      <style>
        :host {
          display: inline-flex;
          position: relative;
        }
      </style>
      <elix-tab-strip id="tabStrip"><slot id="tabButtonsSlot" name="tabButtons"></slot></elix-tab-strip>
      <${tabPanelsTag} id="tabPanels" style="display: flex; flex: 1;">
        <slot></slot>
      </${tabPanelsTag}>
    `;
  }

  get updates() {
    const tabPosition = this.state.tabPosition;
    const lateralPosition = tabPosition === 'left' || tabPosition === 'right';

    // Generate tab buttons if no nodes are assigned to the tabButtons slot.
    // It'd be a lot cleaner if we could just stick the default tab buttons
    // directly inside the slot as default content. However, both Safari and the
    // polyfill have bugs that crop up when working with default slot content.
    // Instead, if we need default tab buttons, we'll append them to the tab
    // strip after the slot. We still need to leave the slot there so that, if
    // nodes are later assigned to the slot, we can detect that and drop our
    // default tab buttons.
    /** @type {any} */
    const tabButtons = this.state.tabButtons || [];
    let tabStripChildNodes = [this.$.tabButtonsSlot, ...tabButtons];

    // Some of the styling applied to the tabStrip and tabPanels is static, and
    // properly should be done through static CSS in the template. However,
    // Edge's flex box implementation seems to struggle with dynamic changes to
    // properties like flex-direction, and works better if we reapply the
    // styling each time.
    return merge(super.updates, {
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
          childNodes: tabStripChildNodes,
          style: {
            'z-index': 1
          }
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

}


// Return true if arrays a and b have the same elements.
function arrayEquals(a, b) {
  if ((a && !b) || (!a && b) || (!a && !b) || (a.length !== b.length)) {
    return false;
  }
  return !a.some((element, index) => element !== b[index]);
}


// Return the set of buttons generated for the given Tabs element.
function defaultTabButtons(element) {
  if (element.items !== element[previousItemsKey]) {
    if (!element.items) {
      // No items yet.
      element[tabButtonsKey] = [];
    } else {
      // Items have changed; create new buttons set.
      const tabButtonTag = element.tags.tabButton;
      element[tabButtonsKey] = element.items.map((panel, index) => {
        const label = panel.getAttribute('aria-label');
        const panelId = getIdForPanel(element, panel, index);
        const tabButton = document.createElement(tabButtonTag);
        const id = getIdForTabButton(element, index);
        tabButton.setAttribute('id', id);
        tabButton.setAttribute('aria-controls', panelId);
        tabButton.textContent = label;
        return tabButton;
      });
      // Make the array immutable.
      Object.freeze(element[tabButtonsKey]);
    }
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


// See if any nodes are assigned to the tabButtonsSlot and, if so, generate a
// set of default tab buttons. Alternatively, if we previously needed default
// tab buttons, but nodes have now been assigned to the slot, remove the default
// buttons. If anything changed, set state and trigger a render.
function updateDefaultTabButtons(element) {
  /** @type {any} */
  const tabButtonsSlot = element.$.tabButtonsSlot;
  const assignedButtons = tabButtonsSlot.assignedNodes({ flatten: true });
  const tabButtons = assignedButtons.length > 0 ?
    [] :
    defaultTabButtons(element);
  const changed = !arrayEquals(tabButtons, element.state.tabButtons);
  if (changed) {
    element.setState({ tabButtons });
  }
}


customElements.define('elix-tabs', Tabs);
export default Tabs;
