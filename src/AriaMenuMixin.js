import { defaultAriaRole } from './accessibility.js';
import { merge } from './updates.js';


/**
 * Mixin which treats a list of items as a menu of choices for ARIA purposes.
 *
 * @module AriaMenuMixin
 */
export default function AriaListMixin(Base) {

  // The class prototype added by the mixin.
  class AriaMenu extends Base {

    get defaultState() {
      const base = super.defaultState || {};
      return Object.assign({}, base, {
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

    get updates() {
      const base = super.updates || {};
      const role = this.state.original && this.state.original.attributes.role ||
        base.attributes && base.attributes.role ||
        this.state.role;
      return merge(base, {
        attributes: {
          role
        }
      });
    }

  }

  return AriaMenu;
}
