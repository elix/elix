import { closestFocusableNode } from "../core/dom.js";
import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

// Quick detection of whether we'll need to handle focus.
// As of February 2019, we don't need to handle this in Chrome, perhaps because
// they already support delegatesFocus (which handles related focus issues).
const focusTest = document.createElement("div");
focusTest.attachShadow({ mode: "open", delegatesFocus: true });
/** @type {any} */
const shadowRoot = focusTest.shadowRoot;
const nativeDelegatesFocus = shadowRoot.delegatesFocus;

/**
 * Normalizes focus treatment for custom elements with Shadow DOM
 *
 * This mixin exists because the default behavior for mousedown should set the
 * focus to the closest ancestor of the clicked element that can take the focus.
 * As of Nov 2018, Chrome and Safari don't handle this as expected when the
 * clicked element is reassigned across more than one slot to end up inside a
 * focusable element. In such cases, the focus will end up on the body. Firefox
 * exhibits the behavior we want. See
 * https://github.com/w3c/webcomponents/issues/773.
 *
 * This mixin normalizes behavior to provide what Firefox does. When the user
 * mouses down inside anywhere inside the component's light DOM or Shadow DOM,
 * we walk up the composed tree to find the first element that can take the
 * focus and put the focus on it.
 *
 * @module ComposedFocusMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function ComposedFocusMixin(Base) {
  // The class prototype added by the mixin.
  class ComposedFocus extends Base {
    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        composeFocus: !nativeDelegatesFocus
      });
    }

    [internal.render](/** @type {ChangedFlags} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }
      if (this[internal.firstRender]) {
        this.addEventListener("mousedown", event => {
          if (!this[internal.state].composeFocus) {
            return;
          }
          // Only process events for the main (usually left) button.
          if (event.button !== 0) {
            return;
          }
          if (event.target instanceof Element) {
            const target = closestFocusableNode(event.target);
            if (target) {
              target.focus();
              event.preventDefault();
            }
          }
        });
      }
    }
  }

  return ComposedFocus;
}
