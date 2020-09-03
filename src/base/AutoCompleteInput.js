import { updateChildNodes } from "../core/dom.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import { transmute } from "../core/template.js";
import Input from "./Input.js";
import {
  defaultState,
  firstRender,
  ids,
  inputDelegate,
  matchText,
  raiseChangeEvents,
  render,
  rendered,
  setState,
  shadowRoot,
  state,
  stateEffects,
  template,
} from "./internal.js";
import ListBox from "./ListBox.js";

/**
 * A text input box that completes text as the user types
 *
 * @inherits Input
 */
class AutoCompleteInput extends Input {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      autoCompleteSelect: false,
      opened: false,
      originalText: "",
      textIndex: -1,
      texts: [],
    });
  }

  /**
   * Search the given array of text strings for one that matches `prefix`.
   *
   * This method is invoked by the auto-complete algorithm when the user types
   * characters into the input.
   *
   * The default implementation does a case-insensitive prefix search. You can
   * override this method to define custom auto-complete behavior. Return the
   * complete matching string if a match was found, or null if there was no
   * match.
   *
   * @param {string[]} texts
   * @param {string} prefix
   * @returns {string|null}
   */
  [matchText](texts, prefix) {
    if (prefix.length === 0 || !texts) {
      return null;
    }
    const prefixLowerCase = prefix.toLowerCase();
    const match = texts.find((text) =>
      text.toLowerCase().startsWith(prefixLowerCase)
    );
    return match || null;
  }

  get opened() {
    return this[state].opened;
  }
  set opened(opened) {
    this[setState]({ opened });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    if (this[firstRender]) {
      // In many ways it would be cleaner to do AutoComplete work in a keydown
      // listener. Unfortunately, Chrome for Android sets the keyCode on *all*
      // keydown events to a mysterious 229 value, making it impossible for us
      // to look at the keyCode and determine whether the user is typing a key
      // that should trigger AutoComplete.
      //
      // Instead, we listen to input events. That comes with its own set of
      // headaches, noted below.
      this[ids].inner.addEventListener("input", () => {
        // Gboard will generate multiple input events for a single keypress. In
        // particular, if we do AutoComplete and leave the text selected, then
        // when the user types the next key, we'll get *three* input events: one
        // for the actual change, and two other events (probably related to
        // Gboard's own AutoComplete behavior). We give the input value a chance
        // to stabilize by waiting a tick.
        setTimeout(() => {
          this[raiseChangeEvents] = true;
          /** @type {any} */
          const inner = this.inner;
          const text = this.value.toLowerCase();
          // We only AutoComplete if the user's typing at the end of the input.
          // Read the selection start and end directly off the inner element to
          // ensure they're up to date.
          const typingAtEnd =
            inner.selectionStart === text.length &&
            inner.selectionEnd === text.length;
          // Moreover, we only AutoComplete if we're sure the user's added a
          // single character to the value seen on the previous input event.
          // Among other things, we want to ensure the user can delete text from
          // the end without having AutoComplete kick in.
          const originalText = this[state].originalText;
          const userAddedText =
            text.startsWith(originalText) &&
            text.length === originalText.length + 1;
          if (typingAtEnd && userAddedText) {
            autoComplete(this);
          }
          // Remember what the user typed for next time.
          this[setState]({
            originalText: text,
          });
          this[raiseChangeEvents] = false;
        });
      });

      transmute(this[ids].accessibleList, ListBox);
    }

    // Let ARIA know whether combo box is open.
    if (changed.opened) {
      const { opened } = this[state];
      this[ids].inner.setAttribute("aria-expanded", opened.toString());
    }

    // Copy the text values to the invisible, accessible list.
    // TODO: We could defer this work to after the component gets focus.
    if (changed.texts) {
      const { texts } = this[state];
      const options =
        texts === null
          ? []
          : texts.map((text) => {
              const div = document.createElement("div");
              div.textContent = text;
              return div;
            });
      updateChildNodes(this[ids].accessibleList, options);
    }

    // Select the the accessible list item for the current text.
    if (changed.textIndex) {
      const { textIndex } = this[state];

      /** @type {any} */ const list = this[ids].accessibleList;
      if ("currentIndex" in list) {
        list.currentIndex = textIndex;
      }

      const item = list.currentItem;
      const id = item ? item.id : null;
      if (id) {
        this[inputDelegate].setAttribute("aria-activedescendant", id);
      } else {
        this[inputDelegate].removeAttribute("aria-activedescendant");
      }
    }
  }

  [rendered](/** @type {ChangedFlags} */ changed) {
    super[rendered](changed);
    const { autoCompleteSelect, originalText } = this[state];
    if (changed.originalText && autoCompleteSelect) {
      // We've finished rendering new auto-completed text.
      // Leave the auto-completed portion (after the part the user originally
      // typed) selected.
      this[setState]({
        autoCompleteSelect: false,
        selectionEnd: this[state].value.length,
        selectionStart: originalText.length,
      });

      // Dispatch an input event so that listeners can process the
      // auto-completed text.
      // @ts-ignore
      const InputEvent = window.InputEvent || Event;
      const event = new InputEvent("input", {
        // @ts-ignore
        detail: {
          originalText,
        },
      });
      this.dispatchEvent(event);
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects]
      ? super[stateEffects](state, changed)
      : {};

    if (changed.valueCopy) {
      const { texts, valueCopy } = state;
      const textIndex = texts.indexOf(valueCopy);
      Object.assign(effects, { textIndex });
    }

    return effects;
  }

  get [template]() {
    const result = super[template];

    // Apply ARIA combobox attributes to the input.
    const inner = result.content.querySelector('[part~="inner"]');
    if (inner) {
      inner.setAttribute("aria-autocomplete", "both");
      inner.setAttribute("aria-controls", "accessibleList");
      inner.setAttribute("role", "combobox");
    }

    // Add an accessible list.
    result.content.append(fragmentFrom.html`
      <style>
        #accessibleList {
          height: 0;
          position: absolute;
          width: 0;
        }
      </style>
      <div id="accessibleList" tabindex="-1"></div>
    `);

    return result;
  }

  /**
   * The set of texts the input will match against.
   *
   * @type {string[]}
   */
  get texts() {
    return this[state].texts;
  }
  set texts(texts) {
    this[setState]({ texts });
  }

  // Setting the value from the outside is treated as if the user had typed the
  // value. This way the component's value can be prepopulated, and the user can
  // start typing at the end of it to get AutoComplete.
  get value() {
    return super.value;
  }
  set value(value) {
    super.value = value;
    // If the input has focus, we assume the user is typing, and rely on
    // the `input` event to update the originalText state.
    if (this[shadowRoot] && !this.inner.matches(":focus")) {
      this[setState]({
        originalText: value,
      });
    }
  }
}

export function autoComplete(/** @type {AutoCompleteInput} */ element) {
  const match = element[matchText](element.texts, element.value);

  // If found, update the input value to the match.
  // Leave the auto-completed portion selected.
  if (match) {
    element[setState]({
      autoCompleteSelect: true,
      value: match,
    });
  }

  return match;
}

export default AutoCompleteInput;
