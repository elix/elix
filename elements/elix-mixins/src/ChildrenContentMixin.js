import { assignedChildren } from './content';
import Symbol from './Symbol';
import symbols from './symbols';


// Symbols for private data members on an element.
const slotchangeFiredSymbol = Symbol('slotchangeFired');


/**
 * Mixin which defines a component's `symbols.content` property as all
 * child elements, including elements distributed to the component's slots.
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
 * let base = ChildrenContentMixin(DistributedChildrenMixin(HTMLElement));
 * class CountingElement extends base {
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
 * Note that content change detection depends upon the element having at least
 * one `slot` element in its shadow subtree.
 *
 * This mixin is intended for use with the
 * [DistributedChildrenMixin](DistributedChildrenMixin.md). See that mixin for
 * a discussion of how that works. This ChildrenContentMixin
 * provides an easy way of defining the "content" of a component as the
 * component's distributed children. That in turn lets mixins like
 * [ContentItemsMixin](ContentItemsMixin.md) manipulate the children as list
 * items.
 *
 * To receive `contentChanged` notification, this mixin expects a component to
 * invoke a method called `symbols.shadowCreated` after the component's shadow
 * root has been created and populated.
 *
 * @module ChildrenContentMixin
 * @param base {Class} the base class to extend
 * @returns {Class} the extended class
 */
export default function ChildrenContentMixin(base) {

  /**
   * The class prototype added by the mixin.
   */
  class ChildrenContent extends base {

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      // HACK for Blink, which doesn't correctly fire initial slotchange.
      // See https://bugs.chromium.org/p/chromium/issues/detail?id=696659
      setTimeout(() => {
        // By this point, the slotchange event should have fired.
        if (!this[slotchangeFiredSymbol]) {
          // slotchange event didn't fire; we're in Blink. Force the invocation
          // of contentChanged that would have happened on slotchange.
          if (this[symbols.contentChanged]) {
            this[symbols.contentChanged]();
          }
        }
      });
    }

    /**
     * The content of this component, defined to be the flattened array of
     * children distributed to the component.
     *
     * The default implementation of this property only returns instances of
     * Element
     *
     * @type {HTMLElement[]}
     */
    get [symbols.content]() {
      return assignedChildren(this);
    }

    [symbols.shadowCreated]() {
      if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
      // Listen to changes on all slots.
      const slots = this.shadowRoot.querySelectorAll('slot');
      slots.forEach(slot => slot.addEventListener('slotchange', event => {
        this[slotchangeFiredSymbol] = true;
        if (this[symbols.contentChanged]) {
          this[symbols.contentChanged]();
        }
      }));
    }
  }

  return ChildrenContent;
}
