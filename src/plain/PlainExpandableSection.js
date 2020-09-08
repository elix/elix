import ExpandableSection from "../base/ExpandableSection.js";
import { defaultState, template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import PlainButton from "./PlainButton.js";
import PlainExpandCollapseToggle from "./PlainExpandCollapseToggle.js";

/**
 * ExpandableSection component in the Plain reference design system
 *
 * @inherits ExpandableSection
 * @part {PlainButton} header
 * @part {PlainExpandCollapseToggle} toggle
 */
class PlainExpandableSection extends ExpandableSection {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      headerPartType: PlainButton,
      togglePartType: PlainExpandCollapseToggle,
    });
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          [part~="toggle"] {
            margin: 0.75em;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainExpandableSection;
