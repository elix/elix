import { fragmentFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import { transmute } from "../core/template.js";
import DisabledMixin from "./DisabledMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import {
  defaultState,
  firstRender,
  ids,
  inputDelegate,
  raiseChangeEvents,
  render,
  rendered,
  setState,
  shadowRoot,
  state,
  stateEffects,
  template,
} from "./internal.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import layoutPopup from "./layoutPopup.js";
import OpenCloseMixin from "./OpenCloseMixin.js";
import Popup from "./Popup.js";

const resizeListenerKey = Symbol("resizeListener");

const Base = DisabledMixin(
  FocusVisibleMixin(LanguageDirectionMixin(OpenCloseMixin(ReactiveElement)))
);

/**
 * Positions a popup with respect to a source element
 *
 * @inherits ReactiveElement
 * @mixes DisabledMixin
 * @mixes FocusVisibleMixin
 * @mixes OpenCloseMixin
 * @part {Popup} popup - the popup element
 * @part {button} source - the element used as the reference point for positioning the popup, generally the element that invokes the popup
 */
class PopupSource extends Base {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      ariaHasPopup: "true",
      popupAlign: "start",
      popupDirection: "column",
      popupLayout: null,
      popupPartType: Popup,
      sourcePartType: "div",
    });
  }

  // By default, assume that the source part is an input-like element that will
  // get the foucs.
  get [inputDelegate]() {
    return this[ids].source;
  }

  get frame() {
    return /** @type {any} */ (this[ids].popup).frame;
  }

  // TODO: Remove this deprecated property.
  get horizontalAlign() {
    return this[state].popupAlign;
  }
  set horizontalAlign(horizontalAlign) {
    console.warn(
      `The "horizontalAlign" property has been renamed to "popupAlign"; the "horizontal-align" attribute is now "popup-align".`
    );
    this[setState]({ popupAlign: horizontalAlign });
  }

  /**
   * The alignment of the popup with respect to the source button.
   *
   * * `bottom`: popup and source are bottom-aligned
   * * `end`: popup and source are aligned on the trailing edge according to the
   *   text direction
   * * `left`: popup and source are left-aligned
   * * `right`: popup and source are right-aligned
   * * `start`: popup and source are aligned on the leading edge according to
   *   the text direction
   * * `stretch`: both left and right edges are aligned
   * * `top`: popup and source are top-aligned
   *
   * @type {('bottom'|'end'|'left'|'right'|'start'|'stretch'|'top')}
   * @default 'start'
   */
  get popupAlign() {
    return this[state].popupAlign;
  }
  set popupAlign(popupAlign) {
    this[setState]({ popupAlign });
  }

  /**
   * The preferred direction for the popup.
   *
   * * `above`: popup appears above the source
   * * `below`: popup appears below the source
   * * `column-reverse`: popup appears before the source in the block axis
   * * `column`: popup appears after the source in the block axis
   * * `left`: popup appears to the left of the source
   * * `right`: popup appears to the right of the source
   * * `row-reverse`: popup appears before the source in the inline axis
   * * `row`: popup appears after the source in the inline axis
   *
   * @type {('above'|'below'|'column-reverse'|'column'|'left'|'right'|'row-reverse'|'row')}
   * @default 'column'
   */
  get popupDirection() {
    return this[state].popupDirection;
  }
  set popupDirection(popupDirection) {
    this[setState]({ popupDirection });
  }

  // TODO: Remove this deprecated property.
  get popupPosition() {
    return this[state].popupPosition;
  }
  set popupPosition(popupPosition) {
    console.warn(
      `The "popupPosition" property has been renamed to "popupDirection"; the "popup-position" attribute is now "popup-direction".`
    );
    this[setState]({ popupPosition });
  }

  /**
   * The class or tag used to create the `popup` part – the element
   * responsible for displaying the popup and handling overlay behavior.
   *
   * @type {PartDescriptor}
   * @default Popup
   */
  get popupPartType() {
    return this[state].popupPartType;
  }
  set popupPartType(popupPartType) {
    this[setState]({ popupPartType });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    renderParts(this[shadowRoot], this[state], changed);

    if (this[firstRender] || changed.ariaHasPopup) {
      const { ariaHasPopup } = this[state];
      if (ariaHasPopup === null) {
        this[inputDelegate].removeAttribute("aria-haspopup");
      } else {
        this[inputDelegate].setAttribute(
          "aria-haspopup",
          this[state].ariaHasPopup
        );
      }
    }

    if (changed.popupPartType) {
      // Popup's opened state becomes our own opened state.
      this[ids].popup.addEventListener("open", () => {
        if (!this.opened) {
          this[raiseChangeEvents] = true;
          this.open();
          this[raiseChangeEvents] = false;
        }
      });

      // Popup's closed state becomes our own closed state.
      this[ids].popup.addEventListener("close", (event) => {
        if (!this.closed) {
          this[raiseChangeEvents] = true;
          /** @type {any} */

          const cast = event;
          const closeResult = cast.detail.closeResult;
          this.close(closeResult);
          this[raiseChangeEvents] = false;
        }
      });
    }

    if (changed.opened || changed.popupLayout) {
      const { opened, popupLayout } = this[state];

      // By default, we reset the styles used to position the popup.
      /** @type {any} */
      const styling = {
        height: "",
        left: "",
        opacity: "",
        top: "",
        width: "",
      };
      if (!opened) {
        // Popup closed. Use the reset above.
      } else if (!popupLayout) {
        // Popup opened but not yet laid out.
        //
        // Render the component invisibly so we can measure it before showing
        // it. We hide it by giving it zero opacity. If we use `visibility:
        // hidden` for this purpose, the popup won't be able to receive the
        // focus, which would complicate our overlay focus handling.
        //
        // In case the popup is being relayed out because a layout-affecting
        // property changed while the popup is open, we reset the positiong
        // styles too.
        styling.opacity = 0;
      } else {
        // Popup opened and laid out. Position the popup using only the edges
        // implicated in the layout.
        const { align, direction, rect } = popupLayout;
        const stretch = align === "stretch";
        const vertical = direction === "above" || direction === "below";
        const gridTemplateRows = !vertical && stretch ? "minmax(0, 1fr)" : "";
        const gridTemplateColumns = vertical && stretch ? "minmax(0, 1fr)" : "";
        Object.assign(styling, {
          gridTemplateColumns,
          gridTemplateRows,
          height: `${rect.height}px`,
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          width: `${rect.width}px`,
        });
      }
      Object.assign(this[ids].popup.style, styling);
    }

    if (changed.opened) {
      const { opened } = this[state];
      /** @type {any} */ (this[ids].popup).opened = opened;
    }

    if (changed.disabled) {
      if ("disabled" in this[ids].source) {
        const { disabled } = this[state];
        /** @type {any} */ (this[ids].source).disabled = disabled;
      }
    }

    // Let the popup know its position relative to the source.
    if (changed.popupLayout) {
      const { popupLayout } = this[state];
      if (popupLayout) {
        const { align, direction } = popupLayout;
        /** @type {any} */ const popup = this[ids].popup;
        if ("position" in popup) {
          popup.position = direction;
        }
        if ("align" in popup) {
          popup.align = align;
        }
      }
    }
  }

  [rendered](/** @type {ChangedFlags} */ changed) {
    super[rendered](changed);
    const { opened } = this[state];
    if (changed.opened) {
      if (opened) {
        // Worth noting that's possible (but unusual) for a popup to render
        // opened on first render.
        waitThenRenderOpened(this);
      } else {
        removeEventListeners(this);
      }
    } else if (
      changed.popupLayout &&
      this[state].opened &&
      !this[state].popupLayout
    ) {
      // A layout-affecting property changed while the popup is open; do layout
      // again.
      choosePopupLayout(this);
    }
  }

  /**
   * The class or tag used to create the `source` part - the button
   * (or other element) the user can tap/click to invoke the popup.
   *
   * @type {PartDescriptor}
   * @default 'button'
   */
  get sourcePartType() {
    return this[state].sourcePartType;
  }
  set sourcePartType(sourcePartType) {
    this[setState]({ sourcePartType });
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // We reset our popup calculations when the popup closes, or if it's open
    // and state that affects positioning has changed.
    if (
      (changed.opened && !state.opened) ||
      (state.opened &&
        (changed.popupAlign || changed.popupDirection || changed.rightToLeft))
    ) {
      Object.assign(effects, {
        popupLayout: null,
      });
    }

    return effects;
  }

  get [template]() {
    const result = super[template];
    result.content.append(fragmentFrom.html`
      <style>
        :host {
          display: inline-block;
          position: relative;
        }

        [part~="source"] {
          height: 100%;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          width: 100%;
        }

        [part~="popup"] {
          outline: none;
          position: fixed;
        }
      </style>
      <div id="source" part="source">
        <slot name="source"></slot>
      </div>
      <div id="popup" part="popup" exportparts="backdrop, frame" role="none">
        <slot></slot>
      </div>
    `);

    renderParts(result.content, this[state]);

    return result;
  }
}

function addEventListeners(/** @type {PopupSource} */ element) {
  /** @type {any} */ const cast = element;
  cast[resizeListenerKey] = () => {
    // If viewport resizes while the popup is open, we may want to change which
    // layout we're using for the popup.
    choosePopupLayout(element);
  };
  const viewport = window.visualViewport || window;
  viewport.addEventListener("resize", cast[resizeListenerKey]);
}

/**
 * Based on the current size of the source, popup, and viewport, determine which
 * layout we'll use for the popup.
 *
 * @private
 * @param {PopupSource} element
 */
function choosePopupLayout(element) {
  const { popupAlign, popupDirection, rightToLeft } = element[state];
  const sourceRect = element[ids].source.getBoundingClientRect();
  const popupRect = element[ids].popup.getBoundingClientRect();

  // If the popup defines a frame, ask the frame for its intrinsic size by
  // inspecting the scrollHeight/Width properties. These will report the correct
  // size even if the popup is currently constraining the frame.
  const frame = /** @type {any} */ (element[ids].popup).frame;
  if (frame) {
    popupRect.height = element[ids].popup[ids].frame.scrollHeight;
    popupRect.width = element[ids].popup[ids].frame.scrollWidth;
  }

  const boundsRect = viewportBounds();

  const popupLayout = layoutPopup(sourceRect, popupRect, boundsRect, {
    align: popupAlign,
    direction: popupDirection,
    rightToLeft,
  });

  element[setState]({ popupLayout });
}

function removeEventListeners(/** @type {PopupSource} */ element) {
  /** @type {any} */ const cast = element;
  if (cast[resizeListenerKey]) {
    const viewport = window.visualViewport || window;
    viewport.removeEventListener("resize", cast[resizeListenerKey]);
    cast[resizeListenerKey] = null;
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
  if (!changed || changed.popupPartType) {
    const { popupPartType } = state;
    const popup = root.getElementById("popup");
    if (popup) {
      transmute(popup, popupPartType);
    }
  }
  if (!changed || changed.sourcePartType) {
    const { sourcePartType } = state;
    const source = root.getElementById("source");
    if (source) {
      transmute(source, sourcePartType);
    }
  }
}

// Determine the bounding rectangle of the viewport. We prefer the
// VisualViewport API where that's available, as that handles a pinch-zoomed
// viewport on mobile. If not availble (as of October 2020, Firefox), we fall
// back to using the window as the viewport.
function viewportBounds() {
  // @ts-ignore
  const viewport = window.visualViewport;
  const boundsRect = viewport
    ? new DOMRect(
        viewport.offsetLeft,
        viewport.offsetTop,
        viewport.width,
        viewport.height
      )
    : new DOMRect(0, 0, window.innerWidth, window.innerHeight);
  return boundsRect;
}

/**
 *
 * When a popup is first rendered, we let it render invisibly so that it doesn't
 * affect the page layout.
 *
 * We then wait, for two reasons:
 *
 * 1) We need to give the popup time to render invisibly. That lets us get the
 *    true size of the popup content.
 *
 * 2) Wire up events that can dismiss the popup. If the popup was opened because
 *    the user clicked something, that opening click event may still be bubbling
 *    up, and we only want to start listening after it's been processed.
 *    Along the same lines, if the popup caused the page to scroll, we don't
 *    want to immediately close because the page scrolled (only if the user
 *    scrolls).
 *
 * After waiting, we can take care of both of the above tasks.
 *
 * @private
 * @param {PopupSource} element
 */
function waitThenRenderOpened(element) {
  // Wait a tick to let the newly-opened component actually render.
  setTimeout(() => {
    // It's conceivable the popup was closed before the timeout completed,
    // so double-check that it's still opened before listening to events.
    if (element[state].opened) {
      choosePopupLayout(element);
      addEventListeners(element);
    }
  });
}

export default PopupSource;
