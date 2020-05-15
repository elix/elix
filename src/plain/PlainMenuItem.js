import { template } from "../base/internal.js";
import MenuItem from "../base/MenuItem.js";
import { templateFrom } from "../core/htmlLiterals.js";

/**
 * MenuItem component in the Plain reference design system
 *
 * @inherits MenuItem
 */
class PlainMenuItem extends MenuItem {
  get [template]() {
    /* Variety of system fonts */
    return templateFrom.html`
      <style>
        :host {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          font-size: 10pt;
          padding-left: 2em !important;
          padding-right: 2em !important;
          white-space: nowrap;
        }
      </style>
      <slot></slot>
    `;
  }
}

export default PlainMenuItem;
