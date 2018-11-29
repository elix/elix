import { getSuperProperty } from './workarounds.js';
import { html } from './template.js';
import * as symbols from './symbols.js';
import KeyboardMixin from "./KeyboardMixin.js";
import WrappedStandardElement from "./WrappedStandardElement.js";
import { merge } from './updates.js';


const Base = 
  KeyboardMixin(
    WrappedStandardElement.wrap('input')
  );


/**
 * A text input box that completes text as the user types
 * 
 * @inherits WrappedStandardElement
 * @mixes KeyboardMixin
 */
class AutoCompleteInput extends Base {

  // Delegate relevant ARIA attributes to inner element.
  get ariaAutocomplete() {
    return this.getInnerAttribute('aria-autocomplete');
  }
  set ariaAutocomplete(value) {
    this.setInnerAttribute('aria-autocomplete', value);
  }

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
        const cast = this;
        const inner = cast.$.inner;
        const value = cast.value;
        // We only AutoComplete if the user's typing at the end of the input.
        const typingAtEnd = inner.selectionStart === value.length &&
          inner.selectionEnd === value.length;
        // Moreover, we only AutoComplete if we're sure the user's added
        // text to the value seen on the previous input event.
        const previousValue = this.state.previousValue;
        const userAddedText = previousValue != null &&
          !previousValue.startsWith(value) &&
          value.length === previousValue.length + 1;
        if (typingAtEnd) {
          if (userAddedText) {
            autoComplete(this);
          }
          // Only update our notion of the previous value if the user was typing
          // at the end. This unfortunately misses the case where the user makes
          // an edit somewhere else in the text, then resumes typing at the end.
          // AutoComplete won't start working again for them until they type a
          // second character at the end. That's unfortunate, but does manage to
          // work around the worse problem of having Gboard's magic input events
          // corrupt our notion of what the user actually typed.
          this.setState({
            previousValue: value
          });
        }
        this[symbols.raiseChangeEvents] = false;
      });
    });
  }

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }

    if (this.state.autoCompleteStart) {
      // We've finished rendering new auto-completed text.
      // Leave that selected.
      /** @type {any} */
      const cast = this;
      cast.setSelectionRange(
        this.state.autoCompleteStart,
        cast.value.length
      );
      this.setState({
        autoCompleteStart: null
      });

      // Dispatch an input event so that listeners can process the
      // auto-completed text.
      // @ts-ignore
      const InputEvent = window.InputEvent || Event;
      const originalInput = cast.value.slice(0, this.state.autoCompleteStart);
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
    return Object.assign({}, super.defaultState, {
      autoCompleteStart: null,
      tabindex: null,
      texts: [],
      previousValue: ''
    });
  }

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, AutoCompleteInput, symbols.template);
    const styleTemplate = html`
      <style>
        #inner {
          font-family: inherit;
          font-size: inherit;
          font-style: inherit;
          font-weight: inherit;
        }
      </style>
    `;
    result.content.appendChild(styleTemplate.content);
    return result;
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

  get value() {
    // @ts-ignore
    return super.value || '';
  }
  set value(value) {
    // Only set the value if it's actually different, because we want to avoid
    // trampling on any selection in the input. Chrome's input handles this as
    // we'd like: setting the value will leave the selection unaffected if the
    // value is the same as before. Safari doesn't do what we want: setting the
    // value collapses the selection, even if the value is the same as before.
    // We want to emulate Chrome's behavior.
    if (this.value !== value) {
      // @ts-ignore
      super.value = value;
      // Update our notion of what's been set as the value so the user can type
      // at the end of it and get AutoComplete on the extended text.
      this.setState({
        previousValue: value
      });
    }
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

  // Complete the match.
  element.value = match;

  // Arrange to leave the auto-completed portion selected.
  element.setState({
    autoCompleteStart: value.length
  });
  return match;
}


export default AutoCompleteInput;
customElements.define('elix-auto-complete-input', AutoCompleteInput);
