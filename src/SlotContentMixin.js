import * as symbols from './symbols.js';


/** @type {any} */
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
      const slot = this[symbols.contentSlot];
      if (slot) {
        slot.addEventListener('slotchange', async () => {

          // Although slotchange isn't generally a user-driven event, it's
          // impossible for us to know whether a change in slot content is going
          // to result in effects that the host of this element can predict.
          // To be on the safe side, we raise any change events that come up
          // during the processing of this event.
          this[symbols.raiseChangeEvents] = true;
          
          // Note that the event has fired. We use this flag in the
          // normalization promise below.
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

          await Promise.resolve();
          this[symbols.raiseChangeEvents] = false;
        });
        
        // Chrome and the polyfill will fire slotchange with the initial content,
        // but Safari won't. We wait to see whether the event fires. (We'd prefer
        // to synchronously call assignedNodesChanged, but then if a subsequent
        // slotchange fires, we won't know whether it's an initial one or not.)
        // We do our best to normalize the behavior so the component always gets
        // a chance to process its initial content.
        Promise.resolve().then(() => {
          if (!this[slotchangeFiredKey]) {
            // The event didn't fire, so we're most likely in Safari.
            // Update our notion of the component content.
            this[symbols.raiseChangeEvents] = true;
            this[slotchangeFiredKey] = true;
            assignedNodesChanged(this);
            this[symbols.raiseChangeEvents] = false;
          }
        });

      }
    }

    /**
     * See [symbols.contentSlot](symbols#contentSlot).
     */
    get [symbols.contentSlot]() {
      const slot = this.shadowRoot && this.shadowRoot.querySelector('slot:not([name])');
      if (!this.shadowRoot || !slot) {
        /* eslint-disable no-console */
        console.warn(`SlotContentMixin expects ${this.constructor.name} to define a shadow tree that includes a default (unnamed) slot.\nSee https://elix.org/documentation/SlotContentMixin.`);
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



// The nodes assigned to the given component have changed.
// Update the component's state to reflect the new content.
function assignedNodesChanged(component) {

  const slot = component[symbols.contentSlot];
  const content = slot ?
    slot.assignedNodes({ flatten: true }) :
    null;

  // Make immutable.
  Object.freeze(content);
  
  component.setState({ content });
}
