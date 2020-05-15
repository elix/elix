import { template } from "../base/internal.js";
import MenuSeparator from "../base/MenuSeparator.js";
import { templateFrom } from "../core/htmlLiterals.js";

/**
 * MenuSeparator component in the Plain reference design system
 *
 * @inherits MenuSeparator
 */
class PlainMenuSeparator extends MenuSeparator {
  get [template]() {
    return templateFrom.html`
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
