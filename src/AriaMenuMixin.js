import { defaultAriaRole } from './accessibility.js';
import * as symbols from './symbols.js';


/**
 * Tells assistive technologies to describe a list's items as a menu of choices.
 *
 * @module AriaMenuMixin
 */
export default function AriaMenuMixin(Base) {

  // The class prototype added by the mixin.
  class AriaMenu extends Base {

    get defaultState() {
      const base = super.defaultState;
      return Object.assign(base, {
        itemRole: base.itemRole || 'menuitem',
        role: base.role || 'menu'
      });
    }

    get itemRole() {
      return this.state.itemRole;
    }
    set itemRole(itemRole) {
      this.setState({ itemRole });
    }

    [symbols.render](changed) {
      if (super[symbols.render]) { super[symbols.render](changed); }
      const { selectedIndex, itemRole, items } = this.state;
      if ((changed.items || changed.itemRole) && items) {
        // Give each item a role.
        items.forEach(item => {
          if (itemRole === defaultAriaRole[item.localName]) {
            item.removeAttribute('role');
          } else {
            item.setAttribute('role', itemRole);
          }
        });
      }
      if ((changed.items || changed.selectedIndex) && items) {
        // Reflect the selection state to each item.
        items.forEach((item, index) => {
          const selected = index === selectedIndex;
          item.setAttribute('aria-checked', selected);
        });
      }
      if (changed.role) {
        // Apply top-level role.
        const { role } = this.state;
        this.setAttribute('role', role);
      }
    }

    // Setting the standard role attribute will invoke this property setter,
    // which will allow us to update our state.
    get role() {
      return super.role;
    }
    set role(role) {
      super.role = role;
      if (!this[symbols.rendering]) {
        this.setState({
          role
        });
      }
    }

  }

  return AriaMenu;
}
