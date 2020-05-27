import { fragmentFrom } from "../core/htmlLiterals.js";
import AriaRoleMixin from "./AriaRoleMixin.js";
import ComposedFocusMixin from "./ComposedFocusMixin.js";
import DelegateInputLabelMixin from "./DelegateInputLabelMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import {
  defaultState,
  ids,
  inputDelegate,
  keydown,
  state,
  tap,
  template,
} from "./internal.js";
import KeyboardMixin from "./KeyboardMixin.js";
import WrappedStandardElement from "./WrappedStandardElement.js";

const Base = AriaRoleMixin(
  ComposedFocusMixin(
    DelegateInputLabelMixin(
      FocusVisibleMixin(KeyboardMixin(WrappedStandardElement.wrap("button")))
    )
  )
);

// Do we need to explicitly map Space/Enter keys to a button click?
//
// As of February 2019, Firefox automatically translates a Space/Enter key on a
// button into a click event that bubbles to its host. Chrome/Safari do not do
// this automatically, so we have to do it ourselves.
//
// It's gross to look for a specific browser (Firefox), but it seems extremely
// hard to feature-detect this. Even if we try to create a button in a shadow at
// runtime and send a key event to it, Chrome/Safari don't seem to do their
// normal mapping of Space/Enter to a click for synthetic keyboard events.
//
// Firefox detection adapted from https://stackoverflow.com/a/9851769/76472
// and adjusted to pass type checks.
const firefox = "InstallTrigger" in window;
const mapKeysToClick = !firefox;

/**
 * Base class for custom buttons.
 *
 * `Button` wraps a standard HTML `button` element, allowing for custom styling
 * and behavior while ensuring standard keyboard and focus behavior.
 *
 * @inherits WrappedStandardElement
 * @mixes AriaRoleMixin
 * @mixes ComposedFocusMixin
 * @mixes DelegateInputLabelMixin
 * @mixes FocusVisibleMixin
 * @mixes KeyboardMixin
 */
class Button extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      role: "button",
      treatEnterAsClick: true,
      treatSpaceAsClick: true,
    });
  }

  // TODO: Since this isn't really an input, we should probably rename this.
  get [inputDelegate]() {
    return this[ids].inner;
  }

  // Pressing Enter or Space raises a click event, as if the user had clicked
  // the inner button.
  // TODO: Space should raise the click on *keyup*.
  [keydown](/** @type {KeyboardEvent} */ event) {
    let handled;
    if (mapKeysToClick) {
      switch (event.key) {
        case " ":
          if (this[state].treatSpaceAsClick) {
            this[tap]();
            handled = true;
          }
          break;

        case "Enter":
          if (this[state].treatEnterAsClick) {
            this[tap]();
            handled = true;
          }
          break;
      }
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[keydown] && super[keydown](event));
  }

  // Respond to a simulated click.
  [tap]() {
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    this.dispatchEvent(clickEvent);
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          :host {
            display: inline-flex;
            outline: none;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }

          [part~="inner"] {
            align-items: center;
            background: none;
            border: none;
            color: inherit;
            flex: 1;
            font: inherit;
            outline: none;
            padding: 0;
          }
        </style>
      `
    );
    return result;
  }
}

export default Button;
