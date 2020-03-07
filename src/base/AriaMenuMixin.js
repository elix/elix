import { defaultAriaRole } from "./accessibility.js";
import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Tells assistive technologies to describe a list's items as a menu of choices.
 *
 * @module AriaMenuMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function AriaMenuMixin(Base) {
  // The class prototype added by the mixin.
  class AriaMenu extends Base {
    get [internal.defaultState]() {
      const base = super[internal.defaultState];
      return Object.assign(base, {
        itemRole: base.itemRole || "menuitem",
        role: base.role || "menu"
      });
    }

    get itemRole() {
      return this[internal.state].itemRole;
    }
    set itemRole(itemRole) {
      this[internal.setState]({ itemRole });
    }

    [internal.render](/** @type {ChangedFlags} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }
      const { selectedIndex, itemRole } = this[internal.state];
      /** @type {ListItemElement[]} */ const items = this[internal.state].items;
      if ((changed.items || changed.itemRole) && items) {
        // Give each item a role.
        items.forEach(item => {
          if (itemRole === defaultAriaRole[item.localName]) {
            item.removeAttribute("role");
          } else {
            item.setAttribute("role", itemRole);
          }
        });
      }
      if ((changed.items || changed.selectedIndex) && items) {
        // Reflect the selection state to each item.
        items.forEach((item, index) => {
          const selected = index === selectedIndex;
          item.setAttribute("aria-checked", selected.toString());
        });
      }
      if (changed.role) {
        // Apply top-level role.
        const { role } = this[internal.state];
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
      if (!this[internal.rendering]) {
        this[internal.setState]({ role });
      }
    }
  }

  return AriaMenu;
}
