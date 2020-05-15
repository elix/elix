import { template } from "../base/internal.js";
import UpDownToggle from "../base/UpDownToggle.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import { replace } from "../core/template.js";

/**
 * OpenCloseToggle component in the Plain reference design system
 *
 * @inherits OpenCloseToggle
 */
class PlainOpenCloseToggle extends UpDownToggle {
  get [template]() {
    const result = super[template];

    // Replace the icons with our up/down glyphs.
    const downIcon = result.content.getElementById("downIcon");
    const downIconGlyph = fragmentFrom.html`
      <svg
        id="downIcon"
        part="toggle-icon down-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 5"
      >
        <path d="M 0 0 l5 5 5 -5 z" />
      </svg>
    `.firstElementChild;
    if (downIcon && downIconGlyph) {
      replace(downIcon, downIconGlyph);
    }
    const upIcon = result.content.getElementById("upIcon");
    const upIconGlyph = fragmentFrom.html`
      <svg
        id="upIcon"
        part="toggle-icon up-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 5"
      >
        <path d="M 0 5 l5 -5 5 5 z" />
      </svg>
    `.firstElementChild;
    if (upIcon && upIconGlyph) {
      replace(upIcon, upIconGlyph);
    }

    result.content.append(
      fragmentFrom.html`
        <style>
          :host {
            align-items: center;
            display: inline-flex;
            padding: 2px;
          }

          :host(:not([disabled])):hover {
            background: #eee;
          }

          [part~="toggle-icon"] {
            fill: currentColor;
            height: 10px;
            margin: 0.25em;
            width: 10px;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainOpenCloseToggle;
