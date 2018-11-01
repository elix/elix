import * as symbols from './symbols.js';
import { TYPING_TIMEOUT_DURATION } from './constants.js';


// Symbols for private data members on an element.
const typedPrefixKey = Symbol('typedPrefix');
const prefixTimeoutKey = Symbol('prefixTimeout');


/**
 * Lets a user select a list item by typing the first few characters
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
 * The prefix typing feature has a one second timeout — the prefix to match
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
 */
export default function KeyboardPrefixSelectionMixin(Base) {

  // The class prototype added by the mixin.
  class KeyboardPrefixSelection extends Base {

    constructor() {
      // @ts-ignore
      super();
      resetTypedPrefix(this);
    }

    [symbols.keydown](event) {
      let handled;

      switch (event.key) {
        case 'Backspace':
          handleBackspace(this);
          handled = true;
          break;

        case 'Escape':
          // Pressing Escape lets user quickly start typing a new prefix.
          resetTypedPrefix(this);
          break;

        default:
          if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key.length === 1) {
            handlePlainCharacter(this, event.key);
          }
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super[symbols.keydown] && super[symbols.keydown](event));
    }

    /**
     * Select the first item whose text content begins with the given prefix.
     *
     * @param {string} prefix - The prefix string to search for
     * @returns {boolean}
     */
    selectItemWithTextPrefix(prefix) {
      if (super.selectItemWithTextPrefix) { super.selectItemWithTextPrefix(prefix); }
      if (prefix == null || prefix.length === 0) {
        return false;
      }
      // Find item that begins with the prefix. Ignore case.
      const searchText = prefix.toLowerCase();
      const selectedIndex = this.state.texts.findIndex(text => 
        text.substr(0, prefix.length).toLowerCase() === searchText
      );
      if (selectedIndex >= 0) {
        const previousIndex = this.selectedIndex;
        this.setState({ selectedIndex });
        return this.selectedIndex !== previousIndex;
      } else {
        return false;
      }
    }
  }

  return KeyboardPrefixSelection;
}

// Handle the Backspace key: remove the last character from the prefix.
function handleBackspace(element) {
  const length = element[typedPrefixKey] ? element[typedPrefixKey].length : 0;
  if (length > 0) {
    element[typedPrefixKey] = element[typedPrefixKey].substr(0, length - 1);
  }
  element.selectItemWithTextPrefix(element[typedPrefixKey]);
  setPrefixTimeout(element);
}

// Add a plain character to the prefix.
function handlePlainCharacter(element, char) {
  const prefix = element[typedPrefixKey] || '';
  element[typedPrefixKey] = prefix + char;
  element.selectItemWithTextPrefix(element[typedPrefixKey]);
  setPrefixTimeout(element);
}

// Stop listening for typing.
function resetPrefixTimeout(element) {
  if (element[prefixTimeoutKey]) {
    clearTimeout(element[prefixTimeoutKey]);
    element[prefixTimeoutKey] = false;
  }
}

// Clear the prefix under construction.
function resetTypedPrefix(element) {
  element[typedPrefixKey] = '';
  resetPrefixTimeout(element);
}

// Wait for the user to stop typing.
function setPrefixTimeout(element) {
  resetPrefixTimeout(element);
  element[prefixTimeoutKey] = setTimeout(() => {
    resetTypedPrefix(element);
  }, TYPING_TIMEOUT_DURATION);
}
