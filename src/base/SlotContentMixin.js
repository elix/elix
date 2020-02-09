import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Defines a component's content as the flattened set of nodes assigned to a
 * slot.
 *
 * This mixin defines a component's `content` state member as the flattened
 * set of nodes assigned to a slot, typically the default slot.
 *
 * If the set of assigned nodes changes, the `content` state will be updated.
 * This helps a component satisfy the Gold Standard checklist item for
 * monitoring
 * [Content Changes](https://github.com/webcomponents/gold-standard/wiki/Content-Changes).
 *
 * By default, the mixin looks in the component's shadow subtree for a default
 * (unnamed) `slot` element. You can specify that a different slot should be
 * used by overriding the `internal.contentSlot` property.
 *
 * Most Elix [elements](elements) use `SlotContentMixin`, including
 * [ListBox](ListBox), [Modes](Modes), and [Tabs](Tabs).
 *
 * @module SlotContentMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function SlotContentMixin(Base) {
  // The class prototype added by the mixin.
  class SlotContent extends Base {
    [internal.componentDidMount]() {
      if (super[internal.componentDidMount]) {
        super[internal.componentDidMount]();
      }

      // Listen to changes on the default slot.
      const slot = this[internal.contentSlot];
      if (slot) {
        slot.addEventListener("slotchange", async () => {
          // Although slotchange isn't generally a user-driven event, it's
          // impossible for us to know whether a change in slot content is going
          // to result in effects that the host of this element can predict.
          // To be on the safe side, we raise any change events that come up
          // during the processing of this event.
          this[internal.raiseChangeEvents] = true;

          // The nodes assigned to the given component have changed.
          // Update the component's state to reflect the new content.
          const content = slot.assignedNodes({ flatten: true });
          Object.freeze(content);
          this[internal.setState]({ content });

          await Promise.resolve();
          this[internal.raiseChangeEvents] = false;
        });
      }
    }

    /**
     * See [internal.contentSlot](symbols#contentSlot).
     */
    get [internal.contentSlot]() {
      /** @type {HTMLSlotElement|null} */ const slot =
        this[internal.shadowRoot] &&
        this[internal.shadowRoot].querySelector("slot:not([name])");
      if (!this[internal.shadowRoot] || !slot) {
        /* eslint-disable no-console */
        console.warn(
          `SlotContentMixin expects ${this.constructor.name} to define a shadow tree that includes a default (unnamed) slot.\nSee https://elix.org/documentation/SlotContentMixin.`
        );
      }
      return slot;
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        content: null
      });
    }
  }

  return SlotContent;
}
