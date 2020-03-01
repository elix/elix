import * as internal from "../base/internal.js";
import ExpandableSection from "../base/ExpandableSection.js";
import html from "../core/html.js";
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
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      headerPartType: PlainButton,
      togglePartType: PlainExpandCollapseToggle
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
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
