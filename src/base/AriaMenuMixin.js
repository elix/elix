import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { defaultAriaRole } from "./accessibility.js";
import {
  defaultState,
  render,
  rendering,
  setState,
  state,
} from "./internal.js";

/**
 * Tells assistive technologies to describe a list's items as a menu of choices.
 *
 * @module AriaMenuMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function AriaMenuMixin(Base) {
  // The class prototype added by the mixin.
  class AriaMenu extends Base {
    // @ts-ignore
    get [defaultState]() {
      const base = super[defaultState];
      return Object.assign(base, {
        itemRole: base.itemRole || "menuitem",
        role: base.role || "menu",
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

      /** @type {ListItemElement[]} */ const items = this[state].items;
      if ((changed.items || changed.itemRole) && items) {
        // Give each item a role.
        const { itemRole } = this[state];
        items.forEach((item) => {
          if (itemRole === defaultAriaRole[item.localName]) {
            item.removeAttribute("role");
          } else {
            item.setAttribute("role", itemRole);
          }
        });
      }

      if (changed.role) {
        // Apply top-level role.
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

  return AriaMenu;
}
