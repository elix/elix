import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import UpDownButton from "../base/UpDownButton.js";

class ComboBoxToggleButton extends UpDownButton {
  get [internal.template]() {
    const result = super[internal.template];

    // Replace the icons with our up/down glyphs.
    const downIcon = result.content.getElementById("downIcon");
    const downIconGlyph = template.html`
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5">
        <path d="M 0 0 l5 5 5 -5 z"/>
      </svg>
    `.content.children[0];
    if (downIcon && downIconGlyph) {
      template.replace(downIcon, downIconGlyph);
    }
    const upIcon = result.content.getElementById("upIcon");
    const upIconGlyph = template.html`
      <svg id="upIcon" part="up-icon" xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5">
        <path d="M 0 5 l5 -5 5 5 z"/>
      </svg>
  `.content.children[0];
    if (upIcon && upIconGlyph) {
      template.replace(upIcon, upIconGlyph);
    }

    result.content.append(
      template.html`
        <style>
          :host {
            width: 1.5em;
          }

          :host([disabled]) {
            opacity: 0.5;
          }

          :host(:not([disabled])):hover {
            background: #eee;
          }

          #inner {
            display: inline-flex;
            justify-content: center;
            margin: 0;
            position: relative;
            white-space: nowrap;
          }

          #downIcon,
          #upIcon {
            fill: currentColor;
            margin: 0.25em;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default ComboBoxToggleButton;
