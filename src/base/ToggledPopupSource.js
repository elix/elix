import {
  defaultState,
  ids,
  raiseChangeEvents,
  rendered,
  setState,
  shadowRoot,
  state,
  stateEffects,
} from "./internal.js";
import KeyboardMixin from "./KeyboardMixin.js";
import PopupSource from "./PopupSource.js";
import PopupToggleMixin from "./PopupToggleMixin.js";

const documentMouseupListenerKey = Symbol("documentMouseupListener");

const Base = KeyboardMixin(PopupToggleMixin(PopupSource));

/**
 * An element that can toggle open a popup.
 *
 * @inherits PopupSource
 * @mixes KeyboardMixin
 * @mixes PopupToggleMixin
 */
class ToggledPopupSource extends Base {
  connectedCallback() {
    super.connectedCallback();
    // Handle edge case where component is opened, removed, then added back.
    listenIfOpenAndConnected(this);
  }

  get [defaultState]() {
    return Object.assign(super[defaultState], {
      dragSelect: true,
    });
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    listenIfOpenAndConnected(this);
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
}

async function handleMouseup(/** @type {MouseEvent} */ event) {
  // @ts-ignore
  const element = this;
  const hitTargets = element[shadowRoot].elementsFromPoint(
    event.clientX,
    event.clientY
  );
  if (element.opened) {
    // Was mouseup over source part?
    const overSource = hitTargets.indexOf(element[ids].source) >= 0;

    // Was mouseup over the popup frame (or, if no frame is defined, the popup)?
    const popup = element[ids].popup;
    const popupFrame = popup.frame || popup;
    const overPopupFrame = hitTargets.indexOf(popupFrame) >= 0;

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
    } else if (!overPopupFrame) {
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

export default ToggledPopupSource;
