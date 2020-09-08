import { ids, render, state, template } from "../base/internal.js";
import TabButton from "../base/TabButton.js";
import { fragmentFrom } from "../core/htmlLiterals.js";

/**
 * TabButton component in the Plain reference design system
 *
 * @inherits TabButton
 */
class PlainTabButton extends TabButton {
  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    if (changed.position) {
      // Adjust margins.
      const { position } = this[state];

      Object.assign(this.style, {
        marginBottom: position === "top" ? "-1px" : null,
        marginLeft: position === "right" ? "-1px" : null,
        marginRight: position === "left" ? "-1px" : null,
        marginTop: position === "bottom" ? "-1px" : null,
      });

      // Adjust which corners are rounded.
      /** @type {IndexedObject<string>} */
      const borderRadiusForPosition = {
        bottom: "0 0 0.25em 0.25em",
        left: "0.25em 0 0 0.25em",
        right: "0 0.25em 0.25em 0",
        top: "0.25em 0.25em 0 0",
      };
      this[ids].inner.style.borderRadius = borderRadiusForPosition[position];
    }
    if (changed.position || changed.selected) {
      // Adjust selected appearance.
      const { position, selected } = this[state];
      /** @type {IndexedObject<string|null>} */
      const buttonStyle = {
        borderBottomColor: null,
        borderLeftColor: null,
        borderRightColor: null,
        borderTopColor: null,
        zIndex: selected ? "1" : "",
      };
      if (selected) {
        // We style the border opposite the button's position: if the button is
        // on the left, we style the right border, and so on.
        /** @type {IndexedObject<string>} */
        const borderColorSideForPosition = {
          bottom: "borderTopColor",
          left: "borderRightColor",
          right: "borderLeftColor",
          top: "borderBottomColor",
        };
        const borderSide = borderColorSideForPosition[position];
        buttonStyle[borderSide] = "transparent";
      }
      Object.assign(this.inner.style, buttonStyle);
    }
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          [part~="button"] {
            background: white;
            border-color: #ccc;
            border-style: solid;
            border-width: 1px;
            padding: 0.5em 0.75em;
            white-space: nowrap;
          }

          :host([selected]) [part~="button"] {
            z-index: 1;
          }

          [part~="button"]:disabled {
            color: #888;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainTabButton;
