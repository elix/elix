import './Modes.js';
import { apply, merge } from './updates.js';
import * as symbols from './symbols.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import ReactiveElement from './ReactiveElement.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotItemsMixin from './SlotItemsMixin.js';


const proxyTagKey = Symbol('proxyTag');
const proxySlotchangeFiredKey = Symbol('proxySlotchangeFired');
const proxyListTagKey = Symbol('listTag');
const stageTagKey = Symbol('stageTag');


// Does a list position imply a lateral arrangement of list and stage?
const lateralPositions = {
  end: true,
  left: true,
  right: true,
  start: true
};


const Base =
  LanguageDirectionMixin(
  SingleSelectionMixin(
  SlotItemsMixin(
    ReactiveElement
  )));


/**
 * A component that couples a list-type element for selecting an item from a
 * collection with a stage-type element for focusing attention on a single
 * selected item.
 *
 * @inherits ReactiveElement
 * @mixes LanguageDirectionMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotItemsMixin
 * @elementtag {HTMLDivElement} proxy
 * @elementtag {HTMLDivElement} proxyList
 * @elementtag {Modes} stage
 */
class Explorer extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    const handleSelectedIndexChanged = event => {
      this[symbols.raiseChangeEvents] = true;
      const selectedIndex = event.detail.selectedIndex;
      if (this.selectedIndex !== selectedIndex) {
        this.selectedIndex = selectedIndex;
      }
      this[symbols.raiseChangeEvents] = false;
    };
    this.$.stage.addEventListener('selected-index-changed', handleSelectedIndexChanged);
    this.$.list.addEventListener('selected-index-changed', handleSelectedIndexChanged);

    // Work around inconsistencies in slotchange timing; see SlotContentMixin.
    this.$.proxySlot.addEventListener('slotchange', () => {
      this[proxySlotchangeFiredKey] = true;
      updateAssignedProxies(this);
    });
    Promise.resolve().then(() => {
      if (!this[proxySlotchangeFiredKey]) {
        // The event didn't fire, so we're most likely in Safari.
        // Update our notion of the component content.
        this[proxySlotchangeFiredKey] = true;
        updateAssignedProxies(this);
      }
    });
  }

  get defaults() {
    return {
      tags: {
        proxyList: 'div',
        proxy: 'div',
        stage: 'elix-modes'
      }
    };
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      assignedProxies: [],
      defaultProxies: [],
      proxyListOverlap: false,
      proxyListPosition: 'top'
    });
  }

  // Return either the default proxies (if defined) or the assigned proxies.
  get proxies() {
    return this.state.defaultProxies.length > 0 ?
      this.state.defaultProxies :
      this.state.assignedProxies;
  }

  /**
   * True if the list of proxies should overlap the stage, false if not.
   * 
   * @type {boolean}
   * @default {false}
   */
  get proxyListOverlap() {
    return this.state.proxyListOverlap;
  }
  set proxyListOverlap(proxyListOverlap) {
    this.setState({ proxyListOverlap });
  }

  /**
   * The position of the proxy list relative to the stage.
   * 
   * The `start` and `end` values refer to text direction: in left-to-right languages
   * such as English, these are equivalent to `left` and `right`, respectively.
   * 
   * @type {('bottom'|'end'|'left'|'right'|'start'|'top')}
   * @default 'start'
   */
  get proxyListPosition() {
    return this.state.proxyListPosition;
  }
  set proxyListPosition(proxyListPosition) {
    this.setState({ proxyListPosition });
  }

  /**
   * The tag used to create the Explorer's list of proxies.
   * 
   * @default 'div'
   */
  get proxyListTag() {
    return this[proxyListTagKey];
  }
  set proxyListTag(listTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[proxyListTagKey] = listTag;
  }

  get proxyListTemplate() {
    const proxyListTag = this.proxyListTag || this.defaults.tags.proxyList;
    return `<${proxyListTag} id="list"><slot id="proxySlot" name="proxy"></slot></${proxyListTag}>`;
  }

  /**
   * The tag used to create default proxies for the list items.
   * 
   * @default 'div'
   */
  get proxyTag() {
    return this[proxyTagKey];
  }
  set proxyTag(proxyTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[proxyTagKey] = proxyTag;
  }

  /**
   * Determine what updates should be applied to a proxy to reflect the state of
   * the corresponding item, using the format defined by the [updates](updates)
   * helpers.
   * 
   * By default, this returns an empty object. You should override this method
   * (or use mixins that override this method) to indicate what updates should
   * be applied to the given proxy during rendering.
   * 
   * The `calcs` parameter is an object with the following members:
   * 
   * * `index`: the index of this proxy in the list.
   * * `isDefaultProxy`: true if this proxy was generated by the `Explorer`,
   *   false if the proxy was assigned to the Explorer's `proxy` slot.
   * * `item`: the list item corresponding to this proxy. E.g., for a tab
   *   button, the `item` is the corresponding tab panel.
   * 
   * @param {Element} proxy - the proxy to be updated
   * @param {object} calcs - per-proxy calculations derived from element state
   * @returns {object} the DOM updates that should be applied to the item
   */
  proxyUpdates(proxy, calcs) {   // eslint-disable no-unused-vars
    return {};
  }

  [symbols.render]() {
    if (super[symbols.render]) { super[symbols.render](); }

    // Physically reorder the list and stage to reflect the desired arrangement.
    // We could change the visual appearance by reversing the order of the flex
    // box, but then the visual order wouldn't reflect the document order, which
    // determines focus order. That would surprise a user trying to tab through
    // the controls.
    const listInInitialPosition = isListInInitialPosition(this);
    const container = this.$.explorerContainer;
    const stage = findChildContainingNode(container, this.$.stage);
    const list = findChildContainingNode(container, this.$.list);
    const firstElement = listInInitialPosition ? list : stage;
    const lastElement = listInInitialPosition ? stage : list;
    if (firstElement.nextElementSibling !== lastElement) {
      this.$.explorerContainer.insertBefore(firstElement, lastElement);
    }

    const items = this.items;
    if (items) {
      // Render updates for proxies.
      const proxies = this.proxies;
      const isDefaultProxy = this.state.defaultProxies.length > 0;
      proxies.forEach((proxy, index) => {
        // Ask component for any updates to this proxy.
        const item = items[index];
        const calcs = {
          item,
          index,
          isDefaultProxy
        };
        const updates = this.proxyUpdates(proxy, calcs);
        // Apply updates to the proxy.
        /** @type {any} */
        const element = proxy;
        apply(element, updates);
      });
    }
  }

  /**
   * The tag used to create the main "stage" element showing a single item at a
   * time.
   * 
   * @default 'elix-modes'
   */
  get stageTag() {
    return this[stageTagKey];
  }
  set stageTag(stageTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[stageTagKey] = stageTag;
  }

  get stageTemplate() {
    const stageTag = this.stageTag || this.defaults.tags.stage;
    return `<${stageTag} id="stage" role="none"><slot></slot></${stageTag}>`;
  }

  get [symbols.template]() {
    const listTemplate = this.proxyListTemplate;
    const stageTemplate = this.stageTemplate;
    const templates = isListInInitialPosition(this) ?
      `${listTemplate}${stageTemplate}` :
      `${stageTemplate}${listTemplate}`;
    return `
      <style>
        :host {
          display: inline-flex;
        }
        
        #explorerContainer {
          display: flex;
          flex: 1;
          max-width: 100%; /* For Firefox */
          position: relative;
        }

        #stage {
          flex: 1;
        }
      </style>
      <div id="explorerContainer" role="none">
        ${templates}
      </div>
    `;
  }

  get updates() {
    // Map the relative position of the list vis-a-vis the stage to a position
    // from the perspective of the list.
    const proxyListPosition = this.state.proxyListPosition;
    const lateralPosition = lateralPositions[proxyListPosition];
    const rightToLeft = this[symbols.rightToLeft];
    let position;
    switch (proxyListPosition) {
      case 'end':
        position = rightToLeft ? 'left' : 'right';
        break;
      case 'start':
        position = rightToLeft ? 'right' : 'left';
        break;
      default:
        position = proxyListPosition;
        break;
    }

    const selectedIndex = this.selectedIndex;
    const swipeFraction = this.state.swipeFraction;

    const listChildNodes = [this.$.proxySlot, ...this.state.defaultProxies];
    const listStyle = {
      bottom: '',
      height: '',
      left: '',
      position: '',
      right: '',
      top: '',
      width: '',
      'z-index': ''
    };
    if (this.state.proxyListOverlap) {
      listStyle.position = 'absolute';
      listStyle['z-index'] = '1';
      if (lateralPosition) {
        listStyle.height = '100%';
      } else {
        listStyle.width = '100%';
      }
      listStyle[proxyListPosition] = '0';
    }

    return merge(super.updates, {
      $: {
        explorerContainer: {
          style: {
            'flex-direction': lateralPosition ? 'row' : 'column'
          },
        },
        list: {
          childNodes: listChildNodes,
          position,
          selectedIndex,
          style: listStyle,
          swipeFraction
        },
        stage: {
          selectedIndex,
          swipeFraction
        }
      }
    });
  }

  validateState(state) {
    let result = super.validateState ? super.validateState(state) : true;
    const assignedCount = state.assignedProxies.length;
    const defaultCount = state.defaultProxies.length;
    let defaultProxies;
    let itemsForDefaultProxies;
    if (assignedCount > 0 && defaultCount > 0) {
      // Assigned proxies take precedence, remove default proxies.
      defaultProxies = [];
      itemsForDefaultProxies = null;
    } else if (assignedCount === 0) {
      const items = state.items;
      const itemsChanged = items !== state.itemsForDefaultProxies;
      if (itemsChanged) {
        // Generate sufficient default proxies.
        const proxyTag = this.proxyTag || this.defaults.tags.proxy;
        defaultProxies = createDefaultProxies(items, proxyTag);
        itemsForDefaultProxies = items;
      }
    }
    if (defaultProxies) {
      Object.freeze(defaultProxies);
      Object.assign(state, {
        defaultProxies,
        itemsForDefaultProxies
      });
      result = false;
    }
    return result;
  }

}


// Return the default list generated for the given items.
function createDefaultProxies(items, proxyTag) {
  const proxies = items ?
    items.map(() => document.createElement(proxyTag)) :
    [];
  // Make the array immutable to help update performance.
  Object.freeze(proxies);
  return proxies;
}


// Find the child of root that is or contains the given node.
function findChildContainingNode(root, node) {
  const parentNode = node.parentNode;
  return parentNode === root ?
    node :
    findChildContainingNode(root, parentNode);
}


function isListInInitialPosition(element) {
  const proxyListPosition = element.state.proxyListPosition;
  const rightToLeft = element[symbols.rightToLeft];
  return proxyListPosition === 'top' ||
      proxyListPosition === 'start' ||
      proxyListPosition === 'left' && !rightToLeft ||
      proxyListPosition === 'right' && rightToLeft;
}


function updateAssignedProxies(element) {
  const proxySlot = element.$.proxySlot;
  const assignedProxies = proxySlot.assignedNodes({ flatten: true });
  element.setState({
    assignedProxies
  });
}


customElements.define('elix-explorer', Explorer);
export default Explorer;
