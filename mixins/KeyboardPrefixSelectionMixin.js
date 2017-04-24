//
// Copyright © 2016-2017 Component Kitchen, Inc. and contributors to the 
// Elix Project
//

import constants from './constants';
import Symbol from './Symbol';
import symbols from './symbols';


// Symbols for private data members on an element.
const itemTextContentsSymbol = Symbol('itemTextContents');
const typedPrefixSymbol = Symbol('typedPrefix');
const prefixTimeoutSymbol = Symbol('prefixTimeout');
const settingSelectionSymbol = Symbol('settingSelection');


/**
 * Mixin that handles list box-style prefix typing, in which the user can type
 * a string to select the first item that begins with that string.
 *
 * Example: suppose a component using this mixin has the following items:
 *
 *     <sample-list-component>
 *       <div>Apple</div>
 *       <div>Apricot</div>
 *       <div>Banana</div>
 *       <div>Blackberry</div>
 *       <div>Blueberry</div>
 *       <div>Cantaloupe</div>
 *       <div>Cherry</div>
 *       <div>Lemon</div>
 *       <div>Lime</div>
 *     </sample-list-component>
 *
 * If this component receives the focus, and the user presses the "b" or "B"
 * key, the "Banana" item will be selected, because it's the first item that
 * matches the prefix "b". (Matching is case-insensitive.) If the user now
 * presses the "l" or "L" key quickly, the prefix to match becomes "bl", so
 * "Blackberry" will be selected.
 *
 * The prefix typing feature has a one second timeout — the prefix to match
 * will be reset after a second has passed since the user last typed a key.
 * If, in the above example, the user waits a second between typing "b" and
 * "l", the prefix will become "l", so "Lemon" would be selected.
 *
 * This mixin expects the component to invoke a `keydown` method when a key is
 * pressed. You can use [KeyboardMixin](KeyboardMixin) for that
 * purpose, or wire up your own keyboard handling and call `keydown` yourself.
 *
 * This mixin also expects the component to provide an `items` property. The
 * `textContent` of those items will be used for purposes of prefix matching.
 *
 * @module KeyboardPrefixSelectionMixin
 * @param base {Class} - The base class to extend
 * @returns {Class} The extended class
 */
export default function KeyboardPrefixSelectionMixin(base) {

  // The class prototype added by the mixin.
  class KeyboardPrefixSelection extends base {

    // Default implementation returns an item's `alt` attribute or its
    // `textContent`, in that order.
    [symbols.getItemText](item) {
      return item.getAttribute('alt') || item.textContent;
    }

    // If the set of items has changed, reset the prefix. We'll also need to
    // rebuild our cache of item text the next time we're asked for it.
    [symbols.itemsChanged]() {
      if (super[symbols.itemsChanged]) { super[symbols.itemsChanged](); }
      this[itemTextContentsSymbol] = null;
      resetTypedPrefix(this);
    }

    [symbols.keydown](event) {
      let handled;
      let resetPrefix = true;

      switch (event.keyCode) {
        case 8: // Backspace
          handleBackspace(this);
          handled = true;
          resetPrefix = false;
          break;
        case 27: // Escape
          handled = true;
          break;
        default:
          if (!event.ctrlKey && !event.metaKey && !event.altKey &&
              event.which !== 32 /* Space */) {
            handlePlainCharacter(this, String.fromCharCode(event.keyCode));
          }
          resetPrefix = false;
      }

      if (resetPrefix) {
        resetTypedPrefix(this);
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super[symbols.keydown] && super[symbols.keydown](event));
    }

    get selectedIndex() {
      return super.selectedIndex;
    }
    set selectedIndex(index) {
      if ('selectedIndex' in base.prototype) { super.selectedIndex = index; }
      if (!this[settingSelectionSymbol]) {
        // Someone else (not this mixin) has changed the selection. In response,
        // we invalidate the prefix under construction.
        resetTypedPrefix(this);
      }
    }

    /**
     * Select the first item whose text content begins with the given prefix.
     *
     * @param prefix {String} - The prefix string to search for
     */
    selectItemWithTextPrefix(prefix) {
      if (super.selectItemWithTextPrefix) { super.selectItemWithTextPrefix(prefix); }
      if (prefix == null || prefix.length === 0) {
        return;
      }
      const index = getIndexOfItemWithTextPrefix(this, prefix);
      if (index >= 0) {
        // Update the selection. During that operation, set the flag that lets
        // us know that we are the cause of the selection change. See note at
        // this mixin's `selectedIndex` implementation.
        this[settingSelectionSymbol] = true;
        this.selectedIndex = index;
        this[settingSelectionSymbol] = false;
      }
    }

  }

  return KeyboardPrefixSelection;
}


// Return the index of the first item with the given prefix, else -1.
function getIndexOfItemWithTextPrefix(element, prefix) {
  const itemTextContents = getItemTextContents(element);
  const prefixLength = prefix.length;
  for (let i = 0; i < itemTextContents.length; i++) {
    const itemTextContent = itemTextContents[i];
    if (itemTextContent.substr(0, prefixLength) === prefix) {
      return i;
    }
  }
  return -1;
}

// Return an array of the text content (in lowercase) of all items.
// Cache these results.
function getItemTextContents(element) {
  if (!element[itemTextContentsSymbol]) {
    const items = element.items;
    element[itemTextContentsSymbol] = Array.prototype.map.call(items, item => {
      const text = element[symbols.getItemText](item);
      return text.toLowerCase();
    });
  }
  return element[itemTextContentsSymbol];
}

// Handle the Backspace key: remove the last character from the prefix.
function handleBackspace(element) {
  const length = element[typedPrefixSymbol] ? element[typedPrefixSymbol].length : 0;
  if (length > 0) {
    element[typedPrefixSymbol] = element[typedPrefixSymbol].substr(0, length - 1);
  }
  element.selectItemWithTextPrefix(element[typedPrefixSymbol]);
  setPrefixTimeout(element);
}

// Add a plain character to the prefix.
function handlePlainCharacter(element, char) {
  const prefix = element[typedPrefixSymbol] || '';
  element[typedPrefixSymbol] = prefix + char.toLowerCase();
  element.selectItemWithTextPrefix(element[typedPrefixSymbol]);
  setPrefixTimeout(element);
}

// Stop listening for typing.
function resetPrefixTimeout(element) {
  if (element[prefixTimeoutSymbol]) {
    clearTimeout(element[prefixTimeoutSymbol]);
    element[prefixTimeoutSymbol] = false;
  }
}

// Clear the prefix under construction.
function resetTypedPrefix(element) {
  element[typedPrefixSymbol] = '';
  resetPrefixTimeout(element);
}

// Wait for the user to stop typing.
function setPrefixTimeout(element) {
  resetPrefixTimeout(element);
  element[prefixTimeoutSymbol] = setTimeout(() => {
    resetTypedPrefix(element);
  }, constants.TYPING_TIMEOUT_DURATION);
}
