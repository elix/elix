import './Modes.js';
import { apply, merge } from './updates.js';
import * as symbols from './symbols.js';
import ContentItemsMixin from './ContentItemsMixin.js';
import ElementBase from './ElementBase.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';


const proxyTagKey = Symbol('proxyTag');
const proxySlotchangeFiredKey = Symbol('proxySlotchangeFired');
const listTagKey = Symbol('listTag');
const stageTagKey = Symbol('stageTag');


const Base =
  ContentItemsMixin(
  SingleSelectionMixin(
  SlotContentMixin(
    ElementBase
  )));


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
        list: 'div',
        proxy: 'div',
        stage: 'elix-modes'
      }
    };
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      assignedProxies: [],
      defaultProxies: [],
      listOverlap: false,
      listPosition: 'top'
    });
  }

  get listOverlap() {
    return this.state.listOverlap;
  }
  set listOverlap(listOverlap) {
    this.setState({ listOverlap });
  }

  get listPosition() {
    return this.state.listPosition;
  }
  set listPosition(listPosition) {
    this.setState({ listPosition });
  }

  get listTag() {
    return this[listTagKey];
  }
  set listTag(listTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[listTagKey] = listTag;
  }

  get listTemplate() {
    const listTag = this.listTag || this.defaults.tags.list;
    return `<${listTag} id="list"><slot id="proxySlot" name="proxy"></slot></${listTag}>`;
  }

  get proxyTag() {
    return this[proxyTagKey];
  }
  set proxyTag(proxyTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[proxyTagKey] = proxyTag;
  }

  // Return either the default proxies (if defined) or the assigned proxies.
  get proxies() {
    return this.state.defaultProxies.length > 0 ?
      this.state.defaultProxies :
      this.state.assignedProxies;
  }

  /* eslint-disable no-unused-vars */
  proxyUpdates(proxy, calcs) {
    return {};
  }

  [symbols.render]() {
    if (super[symbols.render]) { super[symbols.render](); }

    // Physically reorder the list and stage to reflect the desired arrangement.
    // We could change the visual appearance by reversing the order of the flex
    // box, but then the visual order wouldn't reflect the document order, which
    // determines focus order. That would surprise a user trying to tab through
    // the controls.
    const listPosition = this.state.listPosition;
    const topOrLeftPosition = (listPosition === 'top' || listPosition === 'left');
    const container = this.$.explorerContainer;
    const stage = findChildContainingNode(container, this.$.stage);
    const list = findChildContainingNode(container, this.$.list);
    const firstElement = topOrLeftPosition ? list : stage;
    const lastElement = topOrLeftPosition ? stage : list;
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
    const listTemplate = this.listTemplate;
    const stageTemplate = this.stageTemplate;
    const listPosition = this.state.listPosition;
    const templates = listPosition === 'top' || listPosition === 'left' ?
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
    const listPosition = this.state.listPosition;
    const lateralPosition = listPosition === 'left' || listPosition === 'right';

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
    if (this.state.listOverlap) {
      listStyle.position = 'absolute';
      listStyle['z-index'] = '1';
      if (lateralPosition) {
        listStyle.height = '100%';
      } else {
        listStyle.width = '100%';
      }
      listStyle[listPosition] = '0';
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
          position: listPosition,
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


function updateAssignedProxies(element) {
  const proxySlot = element.$.proxySlot;
  const assignedProxies = proxySlot.assignedNodes({ flatten: true });
  element.setState({
    assignedProxies
  });
}


customElements.define('elix-explorer', Explorer);
export default Explorer;
