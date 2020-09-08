import { template } from "../base/internal.js";
import UpDownToggle from "../base/UpDownToggle.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import { replace } from "../core/template.js";

/**
 * An expand/collapse toggle in the Plain reference design system
 *
 * @inherits UpDownToggle
 */
class PlainExpandCollapseToggle extends UpDownToggle {
  get [template]() {
    const result = super[template];

    // Replace the icons with our up/down glyphs.
    const downIcon = result.content.getElementById("downIcon");
    const downIconGlyph = fragmentFrom.html`
      <svg
        id="downIcon"
        part="toggle-icon down-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
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
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
      </svg>
    `.children[0];
    if (upIcon && upIconGlyph) {
      replace(upIcon, upIconGlyph);
    }

    result.content.append(
      fragmentFrom.html`
        <style>
          :host([disabled]) {
            opacity: 0.5;
          }

          :host(:not([disabled])):hover {
            background: #eee;
          }

          [part~=toggle-icon] {
            fill: currentColor;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainExpandCollapseToggle;
