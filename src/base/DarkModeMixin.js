import { booleanAttributeValue, setInternalState } from "../core/dom.js";
import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

// Elements listening for changes in prefers-color-scheme.
const colorSchemeElements = new Set();

/**
 * Lets a component automatically or explicitly configure itself for dark backgrounds
 *
 * @module DarkModeMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function DarkModeMixin(Base) {
  return class dark extends Base {
    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      // This element no longer needs to listen to changes in color scheme.
      colorSchemeElements.delete(this);
    }

    /**
     * True if the component should configure itself for display on a dark background;
     * false if the component should assume a light background.
     *
     * The default value of this property is inferred when the component is
     * initially added to the page. The component will look up its hierarchy for
     * an ancestor that has an explicit background color. If the color's
     * lightness value in the HSL cylindrical-coordinate system is below 50%,
     * the background is assumed to be dark and `dark` will default to true.
     * If the color is lighter than that, or no explicit background color can be
     * found, the default value of `dark` will be false.
     *
     * @type {boolean}
     */
    get dark() {
      return this[internal.state].dark;
    }
    set dark(dark) {
      const parsed = booleanAttributeValue("dark", dark);
      this[internal.setState]({
        dark: parsed
      });
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState] || {}, {
        dark: false,
        detectDarkMode: "auto"
      });
    }

    /**
     * Determines whether the component should automatially try to detect
     * whether it should apply dark mode.
     *
     * @type {'auto'|'off'}
     * @default 'auto'
     */
    get detectDarkMode() {
      return this[internal.state].detectDarkMode;
    }
    set detectDarkMode(detectDarkMode) {
      if (detectDarkMode === "auto" || detectDarkMode === "off") {
        this[internal.setState]({ detectDarkMode });
      }
    }

    [internal.render](changed) {
      super[internal.render](changed);

      if (changed.dark) {
        const { dark } = this[internal.state];
        setInternalState(this, "dark", dark);
      }
    }

    [internal.rendered](changed) {
      super[internal.rendered](changed);

      if (changed.detectDarkMode) {
        const { detectDarkMode } = this[internal.state];
        // Add/remove element to/from list of elements listening to color
        // scheme.
        if (detectDarkMode === "auto") {
          colorSchemeElements.add(this);
          setDarkModeFromBackgroundColor(this);
        } else {
          colorSchemeElements.delete(this);
        }
      }
    }
  };
}

// Infer dark mode from effective background color.
function setDarkModeFromBackgroundColor(element) {
  const backgroundColor = findBackgroundColor(element);
  const rgb = parseRgb(backgroundColor);
  if (rgb) {
    const hsl = rgbToHsl(rgb);
    // We consider any lightness below 50% to be dark.
    const dark = hsl.l < 0.5;
    element[internal.setState]({ dark });
  }
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

// Listen to changes in user preference for dark mode.
window.matchMedia("(prefers-color-scheme: dark)").addListener(() => {
  colorSchemeElements.forEach(element => {
    setDarkModeFromBackgroundColor(element);
  });
});
