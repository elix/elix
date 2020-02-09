import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Lets a component automatically or explicitly configure itself for dark backgrounds
 *
 * @module DarkModeMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function DarkModeMixin(Base) {
  return class DarkMode extends Base {
    // Once connected, check background color. We set state before calling super
    // so the new state will be included when ReactiveMixin calls render.
    connectedCallback() {
      if (this[internal.state].darkMode === null) {
        // Infer dark mode from effective background color.
        const backgroundColor = findBackgroundColor(this);
        const rgb = parseRgb(backgroundColor);
        if (rgb) {
          const hsl = rgbToHsl(rgb);
          // We consider any lightness below 50% to be dark.
          const darkMode = hsl.l < 0.5;
          this[internal.setState]({ darkMode });
        }
      }
      if (super.connectedCallback) {
        super.connectedCallback();
      }
    }

    /**
     * True if the component should configure itself for display on a dark background;
     * false if the component should assume a light background.
     *
     * The default value of this property is inferred when the component is
     * initially added to the page. The component will look up its hierarchy for
     * an ancestor that has an explicit background color. If the color's
     * lightness value in the HSL cylindrical-coordinate system is below 50%,
     * the background is assumed to be dark and `darkMode` will default to true.
     * If the color is lighter than that, or no explicit background color can be
     * found, the default value of `darkMode` will be false.
     *
     * @type {boolean}
     */
    get darkMode() {
      return this[internal.state].darkMode;
    }
    set darkMode(darkMode) {
      const parsed = String(darkMode) === "true";
      this[internal.setState]({
        darkMode: parsed
      });
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        darkMode: null
      });
    }
  };
}

/**
 * Return the background color of the given element. If the color is
 * "transparent" (the default in Mozilla) or "rgba(0, 0, 0, 0)" (the default
 * transparent value in Blink and Webkit), walk up the parent chain until a
 * non-transparent color is found.
 *
 * @private
 * @param {Element} element
 * @returns {string}
 */
function findBackgroundColor(element) {
  const defaultBackgroundColor = "rgb(255,255,255)";
  if (element instanceof Document) {
    // This element has no background, assume white.
    return defaultBackgroundColor;
  }
  const backgroundColor = getComputedStyle(element).backgroundColor;
  const hasColor =
    backgroundColor !== "transparent" && backgroundColor !== "rgba(0, 0, 0, 0)";
  if (backgroundColor && hasColor) {
    return backgroundColor;
  }
  if (element.assignedSlot) {
    return findBackgroundColor(element.assignedSlot);
  }
  const parent = element.parentNode;
  if (parent instanceof ShadowRoot) {
    return findBackgroundColor(parent.host);
  } else if (parent instanceof Element) {
    return findBackgroundColor(parent);
  } else {
    return defaultBackgroundColor;
  }
}

// Return the individual RGB values from a CSS RGB/RGBA color string.
function parseRgb(/** @type {string} */ rgbString) {
  const rgbRegex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)/;
  const match = rgbRegex.exec(rgbString);
  if (match) {
    const r = match[1];
    const g = match[2];
    const b = match[3];
    return { r, g, b };
  } else {
    return null;
  }
}

// Convert an RGB color to an HSL color.
// From https://stackoverflow.com/a/3732187/76472.
function rgbToHsl(/** @type {PlainObject} */ rgb) {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0; // achromatic
  let s = 0;
  let l = (max + min) / 2;

  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - d) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
}
