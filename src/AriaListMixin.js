import { defaultAriaRole } from './accessibility.js';
import { ensureId } from './idGeneration.js';
import * as symbols from './symbols.js';


/**
 * Exposes a list's currently-selected item to assistive technologies.
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
      const base = super.defaultState;
      return Object.assign(base, {
        itemRole: base.itemRole || 'option',
        role: base.role || 'listbox'
      });
    }

    get itemRole() {
      return this.state.itemRole;
    }
    set itemRole(itemRole) {
      this.setState({ itemRole });
    }

    [symbols.render](state, changed) {
      if (super[symbols.render]) { super[symbols.render](state, changed); }
      const { selectedIndex, items } = state;
      if (changed.items) {
        if (items) {
          items.forEach((item, index) => {
            const selected = index === selectedIndex;
            item.setAttribute('aria-selected', selected);
          });
        }
      }
      if (changed.items || changed.itemRole) {
        if (items) {
          items.forEach(item => {
            const original = this.originalItemAttributes ?
              this.originalItemAttributes(item) :
              null;
            const originalRole = original && original.attributes ?
              original.attributes.role :
              null;
            const role = originalRole || state.itemRole;
            if (role === defaultAriaRole[item.localName]) {
              item.removeAttribute('role');
            } else {
              item.setAttribute('role', role);
            }
          });
        }
      }
      if (changed.orientation) {
        this.setAttribute('aria-orientation', state.orientation);
      }
      if (changed.original || changed.role) {
        const originalRole = state.original && state.original.attributes.role;
        if (!originalRole) {
          this.setAttribute('role', state.role);
        }
      }
      if (changed.selectedIndex) {
        if (items) {
          items.forEach((item, index) => {
            const selected = index === selectedIndex;
            item.setAttribute('aria-selected', selected);
          });
        }
        const selectedItem = selectedIndex >= 0 && items ?
          items[selectedIndex] :
          null;
        if (selectedItem) {
          // If no ID has been assigned, generate one.
          if (!selectedItem.id) {
            selectedItem.id = ensureId(selectedItem);
          }
          this.setAttribute('aria-activedescendant', selectedItem.id);
        } else {
          this.removeAttribute('aria-activedescendant');
        }
      }
    }    
  }

  return AriaList;
}
