import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { defaultAriaRole, ensureId } from "./accessibility.js";
import {
  defaultState,
  render,
  rendering,
  setState,
  state,
} from "./internal.js";

/**
 * Exposes a list's currently-selected item to assistive technologies.
 *
 * Handling ARIA selection state properly is actually quite complex:
 *
 * * The items in the list need to be indicated as possible items via an ARIA
 *   `role` attribute value such as "option".
 * * The selected item(s) need to be marked as selected by setting the item's
 *   `aria-selected` attribute to true *and* the other items need be marked as
 *   *not* selected by setting `aria-selected` to false.
 * * The outermost element with the keyboard focus needs to have attributes
 *   set on it so that the current item is knowable at the list level via the
 *   `aria-activedescendant` attribute.
 * * Use of `aria-activedescendant` in turn requires that all items in the
 *   list have ID attributes assigned to them.
 * * If the list supports mutli-selection, `aria-multiselectable` must be
 *   set to "true" on the host.
 *
 * This mixin tries to address all of the above requirements. To that end,
 * this mixin will assign generated IDs to any item that doesn't already have
 * an ID.
 *
 * ARIA relies on elements to provide `role` attributes. This mixin will apply
 * a default role of "listbox" on the outer list if it doesn't already have an
 * explicit role. Similarly, this mixin will apply a default role of "option"
 * to any list item that does not already have a role specified.
 *
 * This mixin expects the component to define a `currentIndex` state member to
 * indicate the current item. You can supply that yourself, or do so via
 * [ItemsCursorMixin](ItemsCursorMixin). For a multi-select list, you must also
 * define a `selectedItemFlags` state member, available via
 * [ItemsMultiSelectMixin](ItemsMultiSelectMixin).
 *
 * @module AriaListMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function AriaListMixin(Base) {
  // The class prototype added by the mixin.
  class AriaList extends Base {
    // @ts-ignore
    get [defaultState]() {
      const base = super[defaultState];
      return Object.assign(base, {
        itemRole: base.itemRole || "option",
        role: base.role || "listbox",
      });
    }

    get itemRole() {
      return this[state].itemRole;
    }
    set itemRole(itemRole) {
      this[setState]({ itemRole });
    }

    [render](/** @type {ChangedFlags} */ changed) {
      if (super[render]) {
        super[render](changed);
      }

      const { itemRole } = this[state];
      /** @type {ListItemElement[]} */ const items = this[state].items;

      // Give each item an ID.
      if (changed.items && items) {
        items.forEach((item) => {
          if (!item.id) {
            item.id = ensureId(item);
          }
        });
      }

      // Give each item a role.
      if ((changed.items || changed.itemRole) && items) {
        items.forEach((item) => {
          if (itemRole === defaultAriaRole[item.localName]) {
            item.removeAttribute("role");
          } else {
            item.setAttribute("role", itemRole);
          }
        });
      }

      // Reflect the selected state to each item.
      if (changed.items || changed.selectedIndex || changed.selectedItemFlags) {
        // Does the list support multi-selection?
        const { selectedItemFlags, selectedIndex } = this[state];
        if (items) {
          items.forEach((item, index) => {
            const selected = selectedItemFlags
              ? selectedItemFlags[index] // Multi-select
              : index === selectedIndex; // Single-select
            item.setAttribute("aria-selected", selected.toString());
          });
        }
      }

      // Indicate on the host that the current item is active.
      if (changed.items || changed.selectedIndex) {
        const { selectedIndex } = this[state];
        const selectedItem =
          selectedIndex >= 0 && items ? items[selectedIndex] : null;
        if (selectedItem) {
          if (!selectedItem.id) {
            selectedItem.id = ensureId(selectedItem);
          }
          this.setAttribute("aria-activedescendant", selectedItem.id);
        } else {
          this.removeAttribute("aria-activedescendant");
        }
      }

      if (changed.selectedItemFlags) {
        // Let ARIA know this is a multi-select list box.
        if (this[state].selectedItemFlags) {
          this.setAttribute("aria-multiselectable", "true");
        } else {
          this.removeAttribute("aria-multiselectable");
        }
      }

      // Let ARIA know list orientation.
      if (changed.orientation) {
        const { orientation } = this[state];
        this.setAttribute("aria-orientation", orientation);
      }

      // Apply top-level role.
      if (changed.role) {
        const { role } = this[state];
        this.setAttribute("role", role);
      }
    }

    // Setting the standard role attribute will invoke this property setter,
    // which will allow us to update our state.
    get role() {
      return super.role;
    }
    set role(role) {
      super.role = role;
      if (!this[rendering]) {
        this[setState]({ role });
      }
    }
  }

  return AriaList;
}
