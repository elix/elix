import { merge } from './updates.js';
import * as symbols from './symbols.js';
import Input from './Input.js';


/**
 * A text input box that completes text as the user types
 * 
 * @inherits Input
 */
class AutoCompleteInput extends Input {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }

    // In many ways it would be cleaner to do AutoComplete work in a keydown
    // listener. Unfortunately, Chrome for Android sets the keyCode on *all*
    // keydown events to a mysterious 229 value, making it impossible for us to
    // look at the keyCode and determine whether the user is typing a key that
    // should trigger AutoComplete.
    //
    // Instead, we listen to input events. That comes with its own
    // set of headaches, noted below.
    this.$.inner.addEventListener('input', () => {
      // Gboard will generate multiple input events for a single keypress. In
      // particular, if we do AutoComplete and leave the text selected, then
      // when the user types the next key, we'll get *three* input events: one
      // for the actual change, and two other events (probably related to
      // Gboard's own AutoComplete behavior). We give the input value a chance
      // to stabilize by waiting a tick.
      setTimeout(() => {
        this[symbols.raiseChangeEvents] = true;
          /** @type {any} */
        const inner = this.inner;
        const text = this.value.toLowerCase();
        // We only AutoComplete if the user's typing at the end of the input.
        // Read the selection start and end directly off the inner element to
        // ensure they're up to date.
        const typingAtEnd = inner.selectionStart === text.length &&
          inner.selectionEnd === text.length;
        // Moreover, we only AutoComplete if we're sure the user's added a
        // single character to the value seen on the previous input event. Among
        // other things, we want to ensure the user can delete text from the end
        // without having AutoComplete kick in.
        const originalInput = this.state.originalInput;
        const userAddedText = text.startsWith(originalInput) &&
          text.length === originalInput.length + 1;
        if (typingAtEnd && userAddedText) {
          autoComplete(this);
        } else {
          // Update our notion of what the user's typed.
          this.setState({
            originalInput: text
          });
        }
        this[symbols.raiseChangeEvents] = false;
      });
    });
  }

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }

    const { autoCompleteSelect, originalInput } = this.state;
    if (autoCompleteSelect) {
      // We've finished rendering new auto-completed text.
      // Leave that selected.
      /** @type {any} */
      const cast = this;
      cast.setSelectionRange(
        originalInput.length,
        this.value.length
      );
      this.setState({
        autoCompleteSelect: false
      });

      // Dispatch an input event so that listeners can process the
      // auto-completed text.
      // @ts-ignore
      const InputEvent = window.InputEvent || Event;
      const event = new InputEvent('input', {
        // @ts-ignore
        detail: {
          originalInput
        }
      });
      this.dispatchEvent(event);
    }
  }

  get defaultState() {
    return Object.assign(super.defaultState, {
      autoCompleteSelect: false,
      originalInput: '',
      previousValue: '',
      texts: []
    });
  }

  get texts() {
    return this.state.texts;
  }
  set texts(texts) {
    this.setState({ texts });
  }

  get updates() {
    return merge(super.updates, {
      attributes: {
        'aria-hidden': 'true'
      }
    });
  }

}


export function autoComplete(element) {
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

  // Leave the auto-completed portion selected, and remember what text input the
  // user originally typed.
  element.setState({
    autoCompleteSelect: true,
    originalInput: value
  });

  return match;
}


export default AutoCompleteInput;
customElements.define('elix-auto-complete-input', AutoCompleteInput);
