import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import MenuItem from "../base/MenuItem.js";

class PlainMenuItem extends MenuItem {
  get [internal.template]() {
    /* Variety of system fonts */
    return template.html`
      <style>
        :host([generic]) {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          font-size: 10pt;
          padding-left: 2em !important;
          padding-right: 2em !important;
          white-space: nowrap;
        }
      </style>
      <div id="container">
        <slot></slot>
      </div>
    `;
  }
}

export default PlainMenuItem;
