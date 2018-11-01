import * as symbols from './symbols.js';
import KeyboardMixin from "./KeyboardMixin.js";
import WrappedStandardElement from "./WrappedStandardElement.js";


const Base = 
  KeyboardMixin(
    WrappedStandardElement.wrap('input')
  );


// TODO: Rename AutosizeTextarea to AutoSizeTextarea?
// Or name this AutocompleteInput?
class AutoCompleteInput extends Base {

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }

    if (this.state.autoCompleteStart) {
      // We've finished rendering new auto-completed text.
      // Leave that selected.
      this.setSelectionRange(
        this.state.autoCompleteStart,
        this.value.length
      );
      this.setState({
        autoCompleteStart: null
      });
    }
  }

  // Keydown gives the best AutoComplete performance and behavior: among other
  // things, the AutoComplete happens as soon as the user begins typing.
  [symbols.keydown](event) {
    let handled = false;

    // Only AutoComplete if the user has been typing at the end of the input.
    // Also, only AutoComplete on Space, or characters from zero (0) and up,
    // ignoring any combinations that involve command modifiers.
    const typingAtEnd = this.$.inner.selectionEnd == this.value.length;
    if (typingAtEnd &&
      (event.keyCode == 32 || event.keyCode >= 48) &&
      !(event.altKey || event.ctrlKey || event.metaKey)) {
      // At this point, the input control's content won't actually reflect the
      // effects key the user just pressed down. We set a timeout to give the
      // keydown event a chance to bubble up and do its work, then do our
      // AutoComplete work against the resulting text.
      setTimeout(() => autoComplete(this));
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event)) || false;
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      autoCompleteStart: null,
      tabindex: null,
      texts: []
    });
  }

  get texts() {
    return this.state.texts;
  }
  set texts(texts) {
    this.setState({ texts });
  }

}


function autoComplete(element) {
  const value = element.value.toLowerCase();
  const texts = element.texts;
  if (value.length === 0 || !texts) {
    return;
  }
  const match = texts.find(text => text.toLowerCase().startsWith(value));
  if (!match) {
    return;
  }

  // Complete the match.
  element.value = match;

  // Arrange to leave the auto-completed portion selected.
  element.setState({
    autoCompleteStart: value.length
  });
}


export default AutoCompleteInput;
customElements.define('elix-auto-complete-input', AutoCompleteInput);
