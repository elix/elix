import { defaultAriaRole } from './accessibility.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';


/**
 * Tells assistive technologies to describe a list's items as a menu of choices.
 *
 * @module AriaMenuMixin
 */
export default function AriaListMixin(Base) {

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

    itemUpdates(item, calcs, original) {
      const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};

      const role = base.original && base.original.attributes.role ||
        base.attributes && base.attributes.role ||
        this.state.itemRole;
      const setRole = role !== defaultAriaRole[item.localName];

      return merge(
        base,
        {
          attributes: {
            'aria-checked': calcs.selected ? 'true' : null,
          },
        },
        setRole && {
          attributes: {
            role
          }
        }
      );
    }

    [symbols.render](state, changed) {
      if (super[symbols.render]) { super[symbols.render](state, changed); }
      if (changed.original || changed.role) {
        const originalRole = state.original && state.original.attributes.role;
        if (!originalRole) {
          this.setAttribute('role', state.role);
        }
      }
    }

  }

  return AriaMenu;
}
