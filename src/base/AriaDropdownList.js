import { fragmentFrom } from "../core/htmlLiterals.js";
import DropdownList from "./DropdownList.js";
import {
  defaultState,
  firstRender,
  ids,
  raiseChangeEvents,
  render,
  setState,
  shadowRoot,
  state,
  template,
} from "./internal.js";

class AriaDropdownList extends DropdownList {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      menu: null,
      role: "combobox",
    });
  }

  // Override [ids].input to reference our light DOM input.
  get [ids]() {
    const base = super[ids];
    const element = this;
    return new Proxy(this, {
      get(target, id) {
        if (id === "menu") {
          return element.querySelector('[slot="menu"]');
        } else {
          return base[id];
        }
      },
    });
  }

  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      // Listen to changes in the menu slot.
      const menuSlot = this[shadowRoot].querySelector('slot[name="menu"]');
      if (menuSlot) {
        menuSlot.addEventListener("slotchange", async () => {
          // Although slotchange isn't generally a user-driven event, it's
          // impossible for us to know whether a change in slot content is going
          // to result in effects that the host of this element can predict.
          // To be on the safe side, we raise any change events that come up
          // during the processing of this event.
          this[raiseChangeEvents] = true;

          // The nodes assigned to the given component have changed.
          // Update the component's state to reflect the new content.
          const menu = menuSlot.assignedNodes({ flatten: true })[0];

          const content = [...menu.childNodes];
          Object.freeze(content);
          this[setState]({
            content,
            menu,
          });

          await Promise.resolve();
          this[raiseChangeEvents] = false;
        });
      }

      this.setAttribute("aria-autocomplete", "none");
    }

    if (changed.menu) {
      const { menu } = this[state];
      if (menu) {
        // TODO: Ensure ID
        const menuId = menu.id;
        this.setAttribute("aria-controls", menuId);
      } else {
        this.removeAttribute("aria-controls");
      }
    }

    // Override AriaListMixin
    // if (changed.items || changed.selectedIndex) {
    //   this.setAttribute("aria-activedescendant", "value");
    // }
  }

  get [template]() {
    const result = super[template];

    // Replace the menu part with a slot.
    const menu = result.content.querySelector('[part~="menu"]');
    if (menu) {
      menu.replaceWith(fragmentFrom.html`
        <slot name="menu"></slot>
      `);
    }

    return result;
  }
}

export default AriaDropdownList;
