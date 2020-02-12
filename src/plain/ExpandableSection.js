import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import ExpandableSection from "../base/ExpandableSection.js";
import ExpandCollapseToggle from "./ExpandCollapseToggle.js";
import PlainButton from "./Button.js";

class PlainExpandableSection extends ExpandableSection {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      headerPartType: PlainButton,
      togglePartType: ExpandCollapseToggle
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          #toggle {
            margin: 0.75em;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainExpandableSection;
