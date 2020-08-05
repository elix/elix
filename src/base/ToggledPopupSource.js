import { fragmentFrom } from "../core/htmlLiterals.js";
import { transmute } from "../core/template.js";
import {
  defaultState,
  ids,
  keydown,
  raiseChangeEvents,
  render,
  rendered,
  setState,
  shadowRoot,
  state,
  stateEffects,
  template,
} from "./internal.js";
import KeyboardMixin from "./KeyboardMixin.js";
import PopupSource from "./PopupSource.js";
import UpDownToggle from "./UpDownToggle.js";

const documentMouseupListenerKey = Symbol("documentMouseupListener");

const Base = KeyboardMixin(PopupSource);

/**
 * An element that can toggle open a popup.
 *
 * @inherits PopupSource
 * @mixes KeyboardMixin
 * @part {UpDownToggle} popup-toggle - the element that lets the user know they can open the popup
 * @part down-icon - the icon shown in the toggle if the popup will open or close in the down direction
 * @part up-icon - the icon shown in the toggle if the popup will open or close in the up direction
 */
class MenuButton extends Base {
  connectedCallback() {
    super.connectedCallback();
    // Handle edge case where component is opened, removed, then added back.
    listenIfOpenAndConnected(this);
  }

  get [defaultState]() {
    return Object.assign(super[defaultState], {
      dragSelect: true,
      popupTogglePartType: UpDownToggle,
    });
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    listenIfOpenAndConnected(this);
  }

  [keydown](/** @type {KeyboardEvent} */ event) {
    let handled;

    switch (event.key) {
      // Enter opens popup.
      case "Enter":
        if (!this.opened) {
          this.open();
          handled = true;
        }
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[keydown] && super[keydown](event));
  }

  /**
   * The class or tag used to create the `popup-toggle` part – the
   * element that lets the user know they can open the popup.
   *
   * @type {PartDescriptor}
   * @default UpDownToggle
   */
  get popupTogglePartType() {
    return this[state].popupTogglePartType;
  }
  set popupTogglePartType(popupTogglePartType) {
    this[setState]({ popupTogglePartType });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    renderParts(this[shadowRoot], this[state], changed);

    if (changed.popupPartType) {
      this[ids].popup.tabIndex = -1;
    }

    // Tell the toggle which direction it should point to depending on which
    // direction the popup will open.
    if (changed.popupPosition || changed.popupTogglePartType) {
      const { popupPosition } = this[state];
      const direction = popupPosition === "below" ? "down" : "up";
      /** @type {any} */ const popupToggle = this[ids].popupToggle;
      if ("direction" in popupToggle) {
        popupToggle.direction = direction;
      }
    }

    if (changed.disabled) {
      const { disabled } = this[state];
      /** @type {any} */ (this[ids].popupToggle).disabled = disabled;
    }
  }

  [rendered](/** @type {ChangedFlags} */ changed) {
    super[rendered](changed);

    if (changed.opened) {
      listenIfOpenAndConnected(this);
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // Set things when opening, or reset things when closing.
    if (changed.opened) {
      if (state.opened) {
        // Opening
        Object.assign(effects, {
          // Until we get a mouseup, we're doing a drag-select.
          dragSelect: true,
        });
      }
    }

    return effects;
  }

  get [template]() {
    const result = super[template];

    // Inject a toggle button into the source slot.
    const sourceSlot = result.content.querySelector('slot[name="source"]');
    if (sourceSlot) {
      sourceSlot.append(fragmentFrom.html`
        <div
          id="popupToggle"
          part="popup-toggle"
          exportparts="down-icon up-icon"
          tabindex="-1"
        >
          <slot name="toggle-icon"></slot>
        </div>
      `);
    }

    renderParts(result.content, this[state]);

    result.content.append(fragmentFrom.html`
      <style>
        [part~="popup-toggle"] {
          outline: none;
        }

        [part~="source"] {
          align-items: center;
          display: flex;
        }
      </style>
    `);

    return result;
  }
}

async function handleMouseup(/** @type {MouseEvent} */ event) {
  // @ts-ignore
  const element = this;
  const hitTargets = element[shadowRoot].elementsFromPoint(
    event.clientX,
    event.clientY
  );
  if (element.opened) {
    const overSource = hitTargets.indexOf(element[ids].source) >= 0;
    const overPopup = hitTargets.indexOf(element[ids].popup) >= 0;
    if (overSource) {
      // User released the mouse over the source button (behind the
      // backdrop), so we're no longer doing a drag-select.
      if (element[state].dragSelect) {
        element[raiseChangeEvents] = true;
        element[setState]({
          dragSelect: false,
        });
        element[raiseChangeEvents] = false;
      }
    } else if (!overPopup) {
      // If we get to this point, the user released over the backdrop with
      // the popup open, so close.
      element[raiseChangeEvents] = true;
      await element.close();
      element[raiseChangeEvents] = false;
    }
  }
}

function listenIfOpenAndConnected(element) {
  if (element[state].opened && element.isConnected) {
    // If the popup is open and user releases the mouse over the backdrop, close
    // the popup. We need to listen to mouseup on the document, not this
    // element. If the user mouses down on the source, then moves the mouse off
    // the document before releasing the mouse, the element itself won't get the
    // mouseup. The document will, however, so it's a more reliable source of
    // mouse state.
    //
    // Coincidentally, we *also* need to listen to mouseup on the document to
    // tell whether the user released the mouse over the source button. When the
    // user mouses down, the backdrop will appear and cover the source, so from
    // that point on the source won't receive a mouseup event. Again, we can
    // listen to mouseup on the document and do our own hit-testing to see if
    // the user released the mouse over the source.
    if (!element[documentMouseupListenerKey]) {
      // Not listening yet; start.
      element[documentMouseupListenerKey] = handleMouseup.bind(element);
      document.addEventListener("mouseup", element[documentMouseupListenerKey]);
    }
  } else if (element[documentMouseupListenerKey]) {
    // Currently listening; stop.
    document.removeEventListener(
      "mouseup",
      element[documentMouseupListenerKey]
    );
    element[documentMouseupListenerKey] = null;
  }
}

/**
 * Render parts for the template or an instance.
 *
 * @private
 * @param {DocumentFragment} root
 * @param {PlainObject} state
 * @param {ChangedFlags} [changed]
 */
function renderParts(root, state, changed) {
  if (!changed || changed.popupTogglePartType) {
    const { popupTogglePartType } = state;
    const popupToggle = root.getElementById("popupToggle");
    if (popupToggle) {
      transmute(popupToggle, popupTogglePartType);
    }
  }
}

export default MenuButton;
