import * as internal from "./internal.js";
import AutoCompleteInput from "./AutoCompleteInput.js";
import ListComboBox from "./ListComboBox.js";
import ItemsTextMixin from "./ItemsTextMixin.js";

const Base = ItemsTextMixin(ListComboBox);

/**
 * A combo box that auto-completes the user's input against the list items
 *
 * @inherits ListComboBox
 * @mixes ItemsTextMixin
 * @part {AutoCompleteInput} input
 */
class AutoCompleteComboBox extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      inputPartType: AutoCompleteInput
    });
  }

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);
    if (changed.texts) {
      if ("texts" in this[internal.ids].input) {
        /** @type {any} */ (this[internal.ids].input).texts = this[
          internal.state
        ].texts;
      }
    }
  }
}

export default AutoCompleteComboBox;
