import { fragmentFrom } from "../core/htmlLiterals.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import Hidden from "./Hidden.js";
import {
  defaultState,
  firstRender,
  ids,
  raiseChangeEvents,
  render,
  rendered,
  state,
  template,
} from "./internal.js";
import PopupButton from "./PopupButton.js";

// A reference to the most recently opened tooltip source.
let mostRecentTooltipSource = null;

const documentKeydownListenerKey = Symbol("documentKeydownListener");

const Base = FocusVisibleMixin(PopupButton);

/**
 * Button with a non-interactive tooltip that appears on hover
 */
class TooltipSource extends Base {
  connectedCallback() {
    super.connectedCallback();
    // Handle edge case where component is opened, removed, then added back.
    listenIfOpenAndConnected(this);
  }

  get [defaultState]() {
    return Object.assign(super[defaultState], {
      role: "none",
    });
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    listenIfOpenAndConnected(this);
  }

  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      // Close the tooltip if we lose focus. A typical popup using
      // PopupModalityMixin will have its own logic to close on blur -- but here
      // we're not giving focus to the popup, so that logic won't apply.
      this.addEventListener("blur", () => {
        this[raiseChangeEvents] = true;
        this.close();
        this[raiseChangeEvents] = false;
      });
    }

    // Open tooltip on focus/mouseenter, close on mouseleave.
    // PopupButton will already close the tooltip on blur.
    if (changed.sourcePartType) {
      const source = this[ids].source;
      source.addEventListener("focus", () => {
        this[raiseChangeEvents] = true;
        this.open();
        this[raiseChangeEvents] = false;
      });
      source.addEventListener("mouseenter", () => {
        this[raiseChangeEvents] = true;
        this.open();
        this[raiseChangeEvents] = false;
      });
      source.addEventListener("mouseleave", () => {
        this[raiseChangeEvents] = true;
        this.close();
        this[raiseChangeEvents] = false;
      });
    }

    // Suppress popup's backdrop, which would interfere with tracking
    // mouseenter/mouseleave on the source element. Additionally, don't try to
    // focus on the popup when it opens.
    if (changed.popupPartType) {
      const popup = this[ids].popup;
      if ("backdropPartType" in popup) {
        /** @type {any} */ (popup).backdropPartType = Hidden;
      }

      if ("autoFocus" in popup) {
        /** @type {any} */ (popup).autoFocus = false;
      }

      // Even if the popup declares itself focusable, we want to keep focus on
      // the source.
      popup.tabIndex = -1;
    }
  }

  [rendered](/** @type {ChangedFlags} */ changed) {
    super[rendered](changed);

    if (changed.opened) {
      listenIfOpenAndConnected(this);

      if (this[state].opened) {
        // If some other tooltip source is open, close it.
        if (mostRecentTooltipSource && mostRecentTooltipSource.close) {
          mostRecentTooltipSource.close();
        }

        // Make this the most recently-opened tooltip source.
        mostRecentTooltipSource = this;
      } else if (this === mostRecentTooltipSource && !this[state].opened) {
        // This tooltip source was the most recent, but is now closed.
        mostRecentTooltipSource = null;
      }
    }
  }

  get [template]() {
    const result = super[template];

    // visually-hidden class from
    // https://inclusive-components.design/tooltips-toggletips/
    result.content.append(fragmentFrom.html`
      <style>
        #popup:not([opened]) {
          clip-path: inset(100%);
          clip: rect(1px, 1px, 1px, 1px);
          display: inherit;
          height: 1px;
          overflow: hidden;
          position: absolute;
          white-space: nowrap;
          width: 1px;
        }
      </style>
    `);

    // Indicate that the button is described by the popup.
    const source = result.content.getElementById("source");
    if (source) {
      source.setAttribute("aria-describedby", "popup");
    }

    // Indicate that the popup is a tooltip.
    const popup = result.content.getElementById("popup");
    if (popup) {
      popup.setAttribute("role", "tooltip");
    }

    return result;
  }
}

// The user can invoke the tooltip on mouse hover, in which case the tooltip
// will be shown even if the tooltip source does not have the focus. In that
// situation, we still want the Esc key to close the tooltip. If the user
// happened to intend for something else to happen a result, we'll still let
// that happen -- but if the Esc key wasn't meant for the tooltip, it seems
// safer to close the tooltip.
async function handleKeydown(/** @type {KeyboardEvent} */ event) {
  // @ts-ignore
  const element = this;

  switch (event.key) {
    case "Escape":
      if (element.opened) {
        element[raiseChangeEvents] = true;
        element.close();
        element[raiseChangeEvents] = false;
      }
      break;
  }
}

function listenIfOpenAndConnected(element) {
  if (element[state].opened && element.isConnected) {
    if (!element[documentKeydownListenerKey]) {
      // Not listening yet; start.
      element[documentKeydownListenerKey] = handleKeydown.bind(element);
      document.addEventListener("keydown", element[documentKeydownListenerKey]);
    }
  } else if (element[documentKeydownListenerKey]) {
    // Currently listening; stop.
    document.removeEventListener(
      "keydown",
      element[documentKeydownListenerKey]
    );
    element[documentKeydownListenerKey] = null;
  }
}

export default TooltipSource;
