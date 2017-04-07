import symbols from './symbols';


/**
 * Mixin which defines a `value` property that reflects the text content of a
 * selected item.
 *
 * This mixin exists for list-like components that want to provide a more
 * convenient way to get/set the selected item using text. It adds a `value`
 * property that gets the `textContent` of a component's `selectedItem`. The
 * `value` property can also be set to set the selection to the first item in
 * the `items` collection that has the requested `textContent`. If the indicated
 * text is not found in `items`, the selection is cleared.
 *
 * This mixin expects a component to provide an `items` array of all elements
 * in the list. A standard way to do that with is
 * [ContentItemsMixin](ContentItemsMixin). This also expects the definition
 * of `selectedIndex` and `selectedItem` properties, which can be obtained
 * from [SingleSelectionMixin](SingleSelectionMixin).
 *
 * An example of an element using `SelectedItemTextValueMixin` is
 * [ListBox](ListBox).
 *
 * @module SelectedItemTextValueMixin
 * @param base {Class} the base class to extend
 * @returns {Class} the extended class
 */
export default function SelectedItemTextValueMixin(base) {

  // The class prototype added by the mixin.
  class SelectedItemTextValue extends base {

    /**
     * The text content of the selected item.
     *
     * Setting this value to a string will attempt to select the first list item
     * whose text content match that string. Setting this to a string not matching
     * any list item will result in no selection.
     *
     * @type {string}
     */
    get value() {
      return this.selectedItem == null || this.selectedItem.textContent == null ?
        '' :
        this.selectedItem.textContent;
    }
    set value(text) {

      const currentIndex = this.selectedIndex;
      let newIndex = -1; // Assume we won't find the text.

      // Find the item with the indicated text.
      const items = this.items;
      for (let i = 0, length = items.length; i < length; i++) {
        if (items[i].textContent === text) {
          newIndex = i;
          break;
        }
      }

      if (newIndex !== currentIndex) {
        this.selectedIndex = newIndex;
        if (this[symbols.raiseChangeEvents]) {
          const event = new CustomEvent('value-changed');
          this.dispatchEvent(event);
        }
      }
    }
  }

  return SelectedItemTextValue;
}
