import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import UpDownToggle from "../base/UpDownToggle.js";

/**
 * OpenCloseToggle component in the Plain reference design system
 *
 * @inherits OpenCloseToggle
 */
class PlainOpenCloseToggle extends UpDownToggle {
  get [internal.template]() {
    const result = super[internal.template];

    // Replace the icons with our up/down glyphs.
    const downIcon = result.content.getElementById("downIcon");
    const downIconGlyph = template.html`
      <svg id="downIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 5">
        <path d="M 0 0 l5 5 5 -5 z"/>
      </svg>
    `.content.children[0];
    if (downIcon && downIconGlyph) {
      template.replace(downIcon, downIconGlyph);
    }
    const upIcon = result.content.getElementById("upIcon");
    const upIconGlyph = template.html`
      <svg id="upIcon" part="up-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 5">
        <path d="M 0 5 l5 -5 5 5 z"/>
      </svg>
    `.content.children[0];
    if (upIcon && upIconGlyph) {
      template.replace(upIcon, upIconGlyph);
    }

    result.content.append(
      template.html`
        <style>
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
            height: 10px;
            margin: 0.25em;
            width: 10px;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainOpenCloseToggle;
