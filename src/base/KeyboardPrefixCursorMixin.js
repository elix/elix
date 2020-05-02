import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { TYPING_TIMEOUT_DURATION } from "./constants.js";
import * as internal from "./internal.js";

// Symbols for private data members on an element.
const typedPrefixKey = Symbol("typedPrefix");
const prefixTimeoutKey = Symbol("prefixTimeout");

/**
 * Lets a user navigate an item cursor by typing the beginning of items
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
 * key, the item cursor will move to "Banana", because it's the first item that
 * matches the prefix "b". (Matching is case-insensitive.) If the user now
 * presses the "l" or "L" key quickly, the prefix to match becomes "bl", so the
 * cursor will move to "Blackberry".
 *
 * The prefix typing feature has a one second timeout — the prefix to match will
 * be reset after a second has passed since the user last typed a key. If, in
 * the above example, the user waits a second between typing "b" and "l", the
 * prefix will become "l", so the cursor would move to "Lemon".
 *
 * This mixin expects the component to invoke a `keydown` method when a key is
 * pressed. You can use [KeyboardMixin](KeyboardMixin) for that purpose, or wire
 * up your own keyboard handling and call `keydown` yourself.
 *
 * This mixin also expects the component to provide an `items` property. The
 * `textContent` of those items will be used for purposes of prefix matching.
 *
 * @module KeyboardPrefixCursorMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function KeyboardPrefixCursorMixin(Base) {
  // The class prototype added by the mixin.
  class KeyboardPrefixCursor extends Base {
    constructor() {
      // @ts-ignore
      super();
      resetTypedPrefix(this);
    }

    /**
     * Go to the first item whose text content begins with the given prefix.
     *
     * @param {string} prefix - The prefix string to search for
     * @returns {boolean}
     */
    [internal.goToItemWithPrefix](prefix) {
      if (super[internal.goToItemWithPrefix]) {
        super[internal.goToItemWithPrefix](prefix);
      }
      if (prefix == null || prefix.length === 0) {
        return false;
      }
      // Find item that begins with the prefix. Ignore case.
      const searchText = prefix.toLowerCase();
      /** @type {string[]} */ const texts = this[internal.state].texts;
      const index = texts.findIndex(
        (text) => text.substr(0, prefix.length).toLowerCase() === searchText
      );
      if (index >= 0) {
        const previousIndex = this[internal.state].currentIndex;
        this[internal.setState]({ currentIndex: index });
        return this[internal.state].currentIndex !== previousIndex;
      } else {
        return false;
      }
    }

    [internal.keydown](/** @type {KeyboardEvent} */ event) {
      let handled;

      switch (event.key) {
        case "Backspace":
          handleBackspace(this);
          handled = true;
          break;

        case "Escape":
          // Pressing Escape lets user quickly start typing a new prefix.
          resetTypedPrefix(this);
          break;

        default:
          if (
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey &&
            event.key.length === 1
          ) {
            handlePlainCharacter(this, event.key);
          }
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return (
        handled || (super[internal.keydown] && super[internal.keydown](event))
      );
    }
  }

  return KeyboardPrefixCursor;
}

/**
 * Handle the Backspace key: remove the last character from the prefix.
 *
 * @private
 * @param {ReactiveElement} element
 */
function handleBackspace(element) {
  /** @type {any} */ const cast = element;
  const length = cast[typedPrefixKey] ? cast[typedPrefixKey].length : 0;
  if (length > 0) {
    cast[typedPrefixKey] = cast[typedPrefixKey].substr(0, length - 1);
  }
  element[internal.goToItemWithPrefix](cast[typedPrefixKey]);
  setPrefixTimeout(element);
}

/**
 * Add a plain character to the prefix.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {string} char
 */
function handlePlainCharacter(element, char) {
  /** @type {any} */ const cast = element;
  const prefix = cast[typedPrefixKey] || "";
  cast[typedPrefixKey] = prefix + char;
  element[internal.goToItemWithPrefix](cast[typedPrefixKey]);
  setPrefixTimeout(element);
}

/**
 * Stop listening for typing.
 *
 * @private
 * @param {ReactiveElement} element
 */
function resetPrefixTimeout(element) {
  /** @type {any} */ const cast = element;
  if (cast[prefixTimeoutKey]) {
    clearTimeout(cast[prefixTimeoutKey]);
    cast[prefixTimeoutKey] = false;
  }
}

/**
 * Clear the prefix under construction.
 *
 * @private
 * @param {ReactiveElement} element
 */
function resetTypedPrefix(element) {
  /** @type {any} */ (element)[typedPrefixKey] = "";
  resetPrefixTimeout(element);
}

/**
 * Wait for the user to stop typing.
 *
 * @private
 * @param {ReactiveElement} element
 */
function setPrefixTimeout(element) {
  resetPrefixTimeout(element);
  /** @type {any} */ (element)[prefixTimeoutKey] = setTimeout(() => {
    resetTypedPrefix(element);
  }, TYPING_TIMEOUT_DURATION);
}
