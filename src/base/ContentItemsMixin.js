import { isSubstantiveElement } from "./content.js";
import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Treats an element's content nodes as list items.
 *
 * Items differ from nodes contents in several ways:
 *
 * * They are often referenced via index.
 * * They may have a selection state.
 * * It's common to do work to initialize the appearance or state of a new
 *   item.
 * * Text nodes are filtered out.
 * * Auxiliary invisible child elements are filtered out and not counted as
 *   items. Auxiliary elements include link, script, style, and template
 *   elements. This filtering ensures that those auxiliary elements can be
 *   used in markup inside of a list without being treated as list items.
 *
 * This mixin expects a component to provide a `content` state member returning
 * a raw set of elements. You can provide that yourself, or use
 * [SlotContentMixin](SlotContentMixin).
 *
 * Most Elix [elements](elements) use `ContentItemsMixin`, including
 * [ListBox](ListBox), [Modes](Modes), and [Tabs](Tabs).
 *
 * @module ContentItemsMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function ContentItemsMixin(Base) {
  return class ContentItems extends Base {
    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        items: null
      });
    }

    /**
     * Returns true if the given item should be shown in the indicated state.
     *
     * @param {ListItemElement} item
     * @param {PlainObject} state
     * @returns {boolean}
     */
    [internal.itemMatchesState](item, state) {
      const base = super[internal.itemMatchesState]
        ? super[internal.itemMatchesState](item, state)
        : true;
      return base && isSubstantiveElement(item);
    }

    /**
     * The current set of items drawn from the element's current state.
     *
     * @type {ListItemElement[]|null} the element's current items
     */
    get items() {
      return this[internal.state] ? this[internal.state].items : null;
    }

    [internal.rendered](/** @type {ChangedFlags} */ changed) {
      if (super[internal.rendered]) {
        super[internal.rendered](changed);
      }

      // Raise items-changed if items changed after the initial render. We'll
      // see changed.items on initial render, and raiseChangeEvents will be true
      // if we're using SlotContentMixin, but we don't want to actually raise
      // the event then because the items didn't change in response to user
      // activity.
      if (
        !this[internal.firstRender] &&
        changed.items &&
        this[internal.raiseChangeEvents]
      ) {
        /**
         * Raised when the `items` property changes.
         *
         * @event items-changed
         */
        const event = new CustomEvent("items-changed");
        this.dispatchEvent(event);
      }
    }

    [internal.stateEffects](state, changed) {
      const effects = super[internal.stateEffects]
        ? super[internal.stateEffects](state, changed)
        : {};

      // Regenerate items when content changes, or if items has been nullified
      // by another mixin (as a signal that items should be regenerated).
      if (changed.content || changed.items) {
        /** @type {Node[]} */ const content = state.content;
        const needsItems = content && !state.items; // Signal from other mixins
        if (changed.content || needsItems) {
          const items = content
            ? Array.prototype.filter.call(content, (/** @type {Node} */ item) =>
                item instanceof HTMLElement || item instanceof SVGElement
                  ? this[internal.itemMatchesState](item, state)
                  : false
              )
            : null;
          if (items) {
            Object.freeze(items);
          }
          Object.assign(effects, { items });
        }
      }

      return effects;
    }
  };
}
