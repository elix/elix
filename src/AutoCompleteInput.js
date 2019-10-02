import * as internal from './internal.js';
import Input from './Input.js';

/**
 * A text input box that completes text as the user types
 *
 * @inherits Input
 */
class AutoCompleteInput extends Input {
  [internal.componentDidMount]() {
    super[internal.componentDidMount]();

    // In many ways it would be cleaner to do AutoComplete work in a keydown
    // listener. Unfortunately, Chrome for Android sets the keyCode on *all*
    // keydown events to a mysterious 229 value, making it impossible for us to
    // look at the keyCode and determine whether the user is typing a key that
    // should trigger AutoComplete.
    //
    // Instead, we listen to input events. That comes with its own
    // set of headaches, noted below.
    this[internal.ids].inner.addEventListener('input', () => {
      // Gboard will generate multiple input events for a single keypress. In
      // particular, if we do AutoComplete and leave the text selected, then
      // when the user types the next key, we'll get *three* input events: one
      // for the actual change, and two other events (probably related to
      // Gboard's own AutoComplete behavior). We give the input value a chance
      // to stabilize by waiting a tick.
      setTimeout(() => {
        this[internal.raiseChangeEvents] = true;
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
        // single character to the value seen on the previous input event. Among
        // other things, we want to ensure the user can delete text from the end
        // without having AutoComplete kick in.
        const originalText = this[internal.state].originalText;
        const userAddedText =
          text.startsWith(originalText) &&
          text.length === originalText.length + 1;
        if (typingAtEnd && userAddedText) {
          autoComplete(this);
        }
        // Remember what the user typed for next time.
        this[internal.setState]({
          originalText: text
        });
        this[internal.raiseChangeEvents] = false;
      });
    });
  }

  [internal.componentDidUpdate](/** @type {PlainObject} */ changed) {
    super[internal.componentDidUpdate](changed);

    const { autoCompleteSelect, originalText } = this[internal.state];
    if (changed.originalText && autoCompleteSelect) {
      // We've finished rendering new auto-completed text.
      // Leave the auto-completed portion (after the part the user originally
      // typed) selected.
      this[internal.setState]({
        autoCompleteSelect: false
      });
      this.setInnerProperty('selectionStart', originalText.length);
      this.setInnerProperty('selectionEnd', this.value.length);

      // Dispatch an input event so that listeners can process the
      // auto-completed text.
      // @ts-ignore
      const InputEvent = window.InputEvent || Event;
      const event = new InputEvent('input', {
        // @ts-ignore
        detail: {
          originalText
        }
      });
      this.dispatchEvent(event);
    }
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      autoCompleteSelect: false,
      originalText: '',
      texts: []
    });
  }

  /**
   * The set of texts the input will match against.
   *
   * @type {string[]}
   */
  get texts() {
    return this[internal.state].texts;
  }
  set texts(texts) {
    this[internal.setState]({ texts });
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
    if (this.shadowRoot && !this.inner.matches(':focus')) {
      this[internal.setState]({
        originalText: value
      });
    }
  }
}

export function autoComplete(/** @type {AutoCompleteInput} */ element) {
  const value = element.value.toLowerCase();
  const texts = element.texts;
  if (value.length === 0 || !texts) {
    return null;
  }
  const match = texts.find(text => text.toLowerCase().startsWith(value));
  if (!match) {
    return null;
  }

  // Update the input value to the match. This is just a convenient way to
  // set state.innerProperties.value if the value actually changed.
  element.setInnerProperty('value', match);

  // Leave the auto-completed portion selected.
  element[internal.setState]({
    autoCompleteSelect: true
  });

  return match;
}

export default AutoCompleteInput;
