/**
  * @module DarkModeMixin
  */
export default function DarkModeMixin(Base) {
  return class DarkMode extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      if (this.state.darkMode === null) {
        // Infer dark mode from effective background color.
        const backgroundColor = findBackgroundColor(this);
        const rgb = parseRgb(backgroundColor);
        if (rgb) {
          const hsl = rgbToHsl(rgb);
          // We consider any lightness below 50% to be dark.
          const darkMode = hsl.l < 0.5;
          this.setState({
            darkMode
          });
        }
      }
    }

    get darkMode() {
      return this.state.darkMode;
    }
    set darkMode(darkMode) {
      this.setState({
        darkMode
      });
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        darkMode: null
      });
    }

  }
}


// Return the background color of the given element. If the color is
// "transparent" (the default in Mozilla) or "rgba(0, 0, 0, 0)" (the default
// transparent value in Blink and Webkit), walk up the parent chain until a
// non-transparent color is found.
function findBackgroundColor(element) {
  if (element == null || typeof element.style === 'undefined') {
    // This element has no background, assume white.
    return 'rgb(255,255,255)';
  }
  const backgroundColor = getComputedStyle(element).backgroundColor;
  if (backgroundColor === 'transparent' || backgroundColor === 'rgba(0, 0, 0, 0)') {
    const parent = element.assignedSlot || element.parentNode || element.host;
    return findBackgroundColor(parent);
  } else {
    return backgroundColor;
  }
}


// Return the individual RGB values from a CSS color string.
function parseRgb(rgbString) {
  const rgbRegex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d\.]+\s*)?\)/;
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
function rgbToHsl(rgb) {

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
