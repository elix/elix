import Symbol from './Symbol.js';
import symbols from './symbols.js';


// Symbols for private data members on an element.
const slotchangeFiredKey = Symbol('slotchangeFired');


/**
 * Mixin which defines a component's `symbols.content` property as the flattened
 * set of nodes assigned to its default slot.
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
 * class CountingElement extends DefaultSlotContentMixin(HTMLElement) {
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
 * To use this mixin, the component should define a default (unnamed) `slot`
 * element in its shadow subtree.
 *
 * To receive `contentChanged` notification, this mixin expects a component to
 * invoke a method called `symbols.shadowCreated` after the component's shadow
 * root has been created and populated.
 *
 * Most Elix [elements](elements) use `DefaultSlotContentMixin`, including
 * [ListBox](ListBox), [Modes](Modes), and [Tabs](Tabs).
 *
 * @module DefaultSlotContentMixin
 */
export default function DefaultSlotContentMixin(Base) {

  // The class prototype added by the mixin.
  class DefaultSlotContent extends Base {

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      // HACK for Blink, which doesn't correctly fire initial slotchange.
      // See https://bugs.chromium.org/p/chromium/issues/detail?id=696659
      setTimeout(() => {
        // By this point, the slotchange event should have fired.
        if (!this[slotchangeFiredKey]) {
          // slotchange event didn't fire; we're in Blink. Force the invocation
          // of contentChanged that would have happened on slotchange.
          if (this[symbols.contentChanged]) {
            this[symbols.contentChanged]();
          }
        }
      });
    }

    /**
     * The content of this component, defined to be the flattened set of
     * nodes assigned to its default unnamed slot.
     *
     * @type {Element[]}
     */
    get [symbols.content]() {
      const slot = defaultSlot(this);
      let assignedNodes;
      // As of 18 July 2017, the polyfill contains a bug
      // (https://github.com/webcomponents/shadydom/issues/165)
      // that throws an exception if assignedNodes is read during a constructor
      // Until that bug is fixed, we work around the problem by catching the
      // exception.
      try {
        assignedNodes = slot ?
          slot.assignedNodes({ flatten: true }) :
          [];
      } catch (e) {
        assignedNodes = [];
      }
      return assignedNodes;
    }

    [symbols.shadowCreated]() {
      if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
      // Listen to changes on the default slot.
      const slot = defaultSlot(this);
      slot.addEventListener('slotchange', event => {
        this[slotchangeFiredKey] = true;
        if (this[symbols.contentChanged]) {
          this[symbols.contentChanged]();
        }
      });
    }
  }

  return DefaultSlotContent;
}


function defaultSlot(element) {
  const defaultSlot = element.shadowRoot && element.shadowRoot.querySelector('slot:not([name])');
  if (element.shadowRoot && !defaultSlot) {
    console.warn(`DefaultSlotContentMixin expects a component to define a shadow tree that includes a default (unnamed) slot.`);
  }
  return defaultSlot;
}
