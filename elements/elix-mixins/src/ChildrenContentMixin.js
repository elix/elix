import { assignedChildren } from './content';
import microtask from './microtask';
import symbols from './symbols';


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
 * Note: This mixin relies upon the browser firing `slotchange` events when the
 * contents of a `slot` change. Safari and the polyfills fire this event when a
 * custom element is first upgraded, while Chrome does not. This mixin always
 * invokes the `contentChanged` method after component instantiation so that the
 * method will always be invoked at least once. However, on Safari (and possibly
 * other browsers), `contentChanged` might be invoked _twice_ for a new
 * component instance.
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

    constructor() {
      super();

      // Make an initial call to contentChanged() so that the component can do
      // initialization that it normally does when content changes.
      //
      // This will invoke contentChanged() handlers in other mixins. In order
      // that those mixins have a chance to complete their own initialization,
      // we add the contentChanged() call to the microtask queue.
      microtask(() => {
        if (this[symbols.contentChanged]) {
          this[symbols.contentChanged]();
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
        if (this[symbols.contentChanged]) {
          this[symbols.contentChanged]();
        }
      }));
    }
  }

  return ChildrenContent;
}
