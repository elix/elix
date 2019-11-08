import * as internal from './internal.js';
import SeamlessButton from './SeamlessButton.js';

/**
 *
 * @inherits SeamlessButton
 */
class SelectableButton extends SeamlessButton {
  constructor() {
    super();
    if (!this[internal.nativeInternals] && this.attachInternals) {
      this[internal.nativeInternals] = this.attachInternals();
    }
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      selected: false
    });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (
      changed.selected &&
      this[internal.nativeInternals] &&
      this[internal.nativeInternals].states
    ) {
      // Reflect selected property to element `:state`.
      const { selected } = this[internal.state];
      this.toggleAttribute('selected', selected);
      this[internal.nativeInternals].states.toggle('selected', selected);
    }
  }

  get selected() {
    return this[internal.state].selected;
  }
  // Note: AttributeMarshallingMixin will recognize `selected` as the name of
  // attribute that should be parsed as a boolean attribute, and so will
  // handling parsing it for us.
  set selected(selected) {
    this[internal.setState]({ selected });
  }
}

export default SelectableButton;
