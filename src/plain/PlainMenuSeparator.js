import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import MenuSeparator from "../base/MenuSeparator.js";

/**
 * MenuSeparator component in the Plain reference design system
 *
 * @inherits MenuSeparator
 */
class PlainMenuSeparator extends MenuSeparator {
  get [internal.template]() {
    return template.html`
      <style>
        :host {
          padding: 0 !important;
        }

        hr {
          border-bottom-width: 0px;
          border-color: #fff; /* Ends up as light gray */
          border-top-width: 1px;
          margin: 0.25em 0;
        }
      </style>
      <hr>
    `;
  }
}

export default PlainMenuSeparator;
