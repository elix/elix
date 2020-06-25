import DropdownList from "../base/DropdownList.js";
import { defaultState, template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import PlainBorderButton from "./PlainBorderButton.js";
import PlainOpenCloseToggle from "./PlainOpenCloseToggle.js";
import PlainOptionList from "./PlainOptionList.js";
import PlainPopup from "./PlainPopup.js";

/**
 * DropdownList component in the Plain reference design system
 *
 * @inherits DropdownList
 * @part {PlainBorderButton} source
 * @part {PlainOptionList} list
 * @part {PlainOpenCloseToggle} popup-toggle
 * @part {PlainPopup} popup
 */
class PlainDropdownList extends DropdownList {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      listPartType: PlainOptionList,
      popupPartType: PlainPopup,
      sourcePartType: PlainBorderButton,
      popupTogglePartType: PlainOpenCloseToggle,
    });
  }

  get [template]() {
    const result = super[template];

    // Rely on focus shown on source.
    result.content.append(fragmentFrom.html`
      <style>
        [part~="list"] {
          outline: none;
        }
      </style>
    `);

    return result;
  }
}

export default PlainDropdownList;
