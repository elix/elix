import { merge } from './updates.js';
import { ensureId } from './idGeneration.js';


/**
 * Mixin which treats the selected item in a list as the active item in ARIA
 * accessibility terms.
 *
 * Handling ARIA selection state properly is actually quite complex:
 *
 * * The items in the list need to be indicated as possible items via an ARIA
 *   `role` attribute value such as "option".
 * * The selected item need to be marked as selected by setting the item's
 *   `aria-selected` attribute to true *and* the other items need be marked as
 *   *not* selected by setting `aria-selected` to false.
 * * The outermost element with the keyboard focus needs to have attributes
 *   set on it so that the selection is knowable at the list level via the
 *   `aria-activedescendant` attribute.
 * * Use of `aria-activedescendant` in turn requires that all items in the
 *   list have ID attributes assigned to them.
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
 * This mixin expects a set of members that manage the state of the selection:
 * `[symbols.itemSelected]`, `[symbols.itemAdded]`, and `selectedItem`. You can
 * supply these yourself, or do so via
 * [SingleSelectionMixin](SingleSelectionMixin).
 *
 * @module AriaListMixin
 */
export default function AriaListMixin(Base) {

  // The class prototype added by the mixin.
  class AriaList extends Base {

    get defaultState() {
      const base = super.defaultState || {};
      return Object.assign({}, base, {
        itemRole: 'option',
        role: base.role || 'listbox'
      });
    }

    itemUpdates(item, calcs, original) {
      const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
      
      // Ensure each item has an ID so we can set aria-activedescendant on the
      // overall list whenever the selection changes.
      const baseId = base.attributes && base.attributes.id;
      const id = baseId || ensureId(item);

      const defaultRole = item instanceof HTMLOptionElement ?
        null :
        this.state.itemRole;
      const originalAttributes = base.original ? base.original.attributes : {};
      const role = originalAttributes.role || defaultRole;

      return merge(base, {
        attributes: {
          'aria-selected': calcs.selected,
          id,
          role
        },
      });
    }

    get updates() {
      const base = super.updates || {};
      const role = this.state.original && this.state.original.attributes.role ||
        base.attributes && base.attributes.role ||
        this.state.role;
      const orientation = this.state.orientation;
      const selectedIndex = this.selectedIndex || this.state.selectedIndex;
      const selectedItem = selectedIndex >= 0 && this.items ?
        this.items[selectedIndex] :
        null;
      // We need the ID for the selected item. It's possible an ID hasn't been
      // assigned yet, so we spectulatively determine the ID that will be used
      // on the subsequent call to itemUpdates for this item.
      const selectedItemId = selectedItem ?
        ensureId(selectedItem) :
        null;
      return merge(base, {
        attributes: {
          'aria-activedescendant': selectedItemId,
          'aria-orientation': orientation,
          role
        }
      });
    }

  }

  return AriaList;
}
