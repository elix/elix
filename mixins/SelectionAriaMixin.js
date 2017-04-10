import symbols from './symbols';


// Used to assign unique IDs to item elements without IDs.
let idCount = 0;


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
 * @module
 * @param base {Class} - The base class to extend
 * @returns {Class} The extended class
 */
export default function (base) {

  // The class prototype added by the mixin.
  class SelectionAria extends base {

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }

      // Set default ARIA role for the overall component.
      if (this.getAttribute('role') == null && this[symbols.defaults].role) {
        this.setAttribute('role', this[symbols.defaults].role);
      }
    }

    get [symbols.defaults]() {
      const defaults = super[symbols.defaults] || {};
      defaults.role = 'listbox';
      defaults.itemRole = 'option';
      return defaults;
    }

    [symbols.itemAdded](item) {
      if (super[symbols.itemAdded]) { super[symbols.itemAdded](item); }

      if (!item.getAttribute('role')) {
        // Assign a default ARIA role for an individual item.
        item.setAttribute('role', this[symbols.defaults].itemRole);
      }

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
      if (!item.id) {
        const baseId = this.id ?
            "_" + this.id + "Option" :
            "_option";
        item.id = baseId + idCount++;
      }
    }

    [symbols.itemSelected](item, selected) {
      if (super[symbols.itemSelected]) { super[symbols.itemSelected](item, selected); }
      item.setAttribute('aria-selected', selected);
      const itemId = item.id;
      if (itemId && selected) {
        this.setAttribute('aria-activedescendant', itemId);
      }
    }

    get selectedItem() {
      return super.selectedItem;
    }
    set selectedItem(item) {
      if ('selectedItem' in base.prototype) { super.selectedItem = item; }
      if (item == null) {
        // Selection was removed.
        this.removeAttribute('aria-activedescendant');
      }
    }

  }

  return SelectionAria;
}
