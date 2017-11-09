import Symbol from '../utilities/Symbol.js';
import symbols from '../utilities/symbols.js';


// Symbols for private data members on an element.
const slotchangeFiredKey = Symbol('slotchangeFired');


/**
 * Mixin which defines a component's `symbols.content` property as the flattened
 * set of nodes assigned to a slot.
 *
 * This also provides notification of changes to a component's content. It
 * will invoke a `symbols.contentChanged` method when the component is first
 * instantiated, and whenever its distributed children change. This is intended
 * to satisfy the Gold Standard checklist item for monitoring
 * [Content Changes](https://github.com/webcomponents/gold-standard/wiki/Content-Changes).
 *
 * Example:
 *
 * ```
 * class CountingElement extends SlotContentMixin(HTMLElement) {
 *
 *   constructor() {
 *     super();
 *     let root = this.attachShadow({ mode: 'open' });
 *     root.innerHTML = `<slot></slot>`;
 *     this[symbols.shadowCreated]();
 *   }
 *
 *   [symbols.contentChanged]() {
 *     if (super[symbols.contentChanged]) { super[symbols.contentChanged](); }
 *     // Count the component's children, both initially and when changed.
 *     this.count = this.distributedChildren.length;
 *   }
 *
 * }
 * ```
 *
 * By default, the mixin looks in the component's shadow subtree for a default
 * (unnamed) `slot` element. You can specify that a different slot should be
 * used by overriding the `contentSlot` property.
 *
 * To receive `contentChanged` notification, this mixin expects a component to
 * invoke a method called `symbols.shadowCreated` after the component's shadow
 * root has been created and populated.
 *
 * Most Elix [elements](elements) use `SlotContentMixin`, including
 * [ListBox](ListBox), [Modes](Modes), and [Tabs](Tabs).
 *
 * @module SlotContentMixin
 */
export default function SlotContentMixin(Base) {

  // The class prototype added by the mixin.
  class SlotContent extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }

      // Listen to changes on the default slot.
      const slot = this.contentSlot;
      if (slot) {
        slot.addEventListener('slotchange', () => {
          this[slotchangeFiredKey] = true;
          // The polyfill seems to be able to trigger slotchange during
          // rendering, which shouldn't happen in native Shadow DOM. We try to
          // defend against this by deferring updating state. This feels hacky.
          if (!this[symbols.rendering]) {
            assignedNodesChanged(this);
          } else {
            Promise.resolve().then(() => {
              assignedNodesChanged(this);
            });
          }
        });
      }
    }

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      setTimeout(() => {
        // Some browsers fire slotchange when the slot's initial nodes are
        // assigned; others don't. If we haven't already received a slotchange
        // event by now, then act as if we did so the component can set things
        // up based on its initial content.
        if (!this[slotchangeFiredKey]) {
          // Invoke contentChanged as would have happened on slotchange.
          this[slotchangeFiredKey] = true;
          assignedNodesChanged(this);
        }
      });
    }

    get contentSlot() {
      const slot = this.shadowRoot && this.shadowRoot.querySelector('slot:not([name])');
      if (!this.shadowRoot || !slot) {
        /* eslint-disable no-console */
        console.warn(`SlotContentMixin expects a component to define a shadow tree that includes a default (unnamed) slot.`);
      }
      return slot;
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        content: null
      });
    }

  }

  return SlotContent;
}



/**
 * The content of this component, defined to be the flattened set of
 * nodes assigned to its default unnamed slot.
 *
 * @type {Element[]}
 */
function assignedNodesChanged(component) {

  const slot = component.contentSlot;
  const content = slot ?
    slot.assignedNodes({ flatten: true }) :
    null;

  // Make immutable.
  Object.freeze(content);
  
  component.setState({ content });
}
