import { merge } from './updates.js';


const generatedIdKey = Symbol('generatedId');


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

    itemUpdates(item, calcs, original) {
      const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
      
      // Ensure each item has an ID so we can set aria-activedescendant on the
      // overall list whenever the selection changes.
      //
      // The ID will take the form of a base ID plus a unique integer. The base
      // ID will be incorporate the component's own ID. E.g., if a component has
      // ID "foo", then its items will have IDs that look like "_fooOption1". If
      // the compnent has no ID itself, its items will get IDs that look like
      // "_option1". Item IDs are prefixed with an underscore to differentiate
      // them from manually-assigned IDs, and to minimize the potential for ID
      // conflicts.
      let id = item[generatedIdKey] ||
          original.attributes.id ||
          base.attributes && base.attributes.id;
      if (!id) {
        id = getIdForItem(this, item, calcs.index);
        // Remember that we generated an ID for this item.
        item[generatedIdKey] = id;
      }

      const defaultRole = item instanceof HTMLOptionElement ? null : 'option';
      const role = original.role || base.role || this.state.itemRole || defaultRole;

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
        'listbox';
      const orientation = this.state.orientation === 'horizontal' ? 'horizontal' : null;
      const selectedItem = this.state.selectedIndex >= 0 && this.items ?
        this.items[this.state.selectedIndex] :
        null;
      // We need the ID for the selected item. It's possible an ID hasn't been
      // assigned yet, so we spectulatively determine the ID that will be used
      // on the subsequent call to itemUpdates for this item.
      const selectedItemId = selectedItem ?
        getIdForItem(this, selectedItem, this.state.selectedIndex) :
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


function getIdForItem(element, item, index) {
  let id = item.id;
  if (!id) {
    // Determine a default ID unique to the scope of this element.
    const hostId = element.id ?
      "_" + element.id + "Option" :
      "_option";
    id = `${hostId}${index}`;
  }
  return id;
}
