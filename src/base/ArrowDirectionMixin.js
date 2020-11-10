import { forwardFocus } from "../core/dom.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { transmute } from "../core/template.js";
import Button from "./Button.js";
import {
  defaultState,
  goNext,
  goPrevious,
  ids,
  raiseChangeEvents,
  render,
  setState,
  shadowRoot,
  state,
} from "./internal.js";

const wrap = Symbol("wrap");

/**
 * Adds previous/next arrow buttons to a carousel-like component.
 *
 * @module ArrowDirectionMixin
 * @param {Constructor<ReactiveElement>} Base
 * @part {Button} arrow-button - both of the arrow buttons
 * @part arrow-button-next - the arrow button that navigates to the next item
 * @part arrow-button-previous - the arrow button that navigates to the previous item
 */
function ArrowDirectionMixin(Base) {
  // The class prototype added by the mixin.
  class ArrowDirection extends Base {
    /**
     * True if the arrow buttons should overlap the component contents;
     * false if they should appear to the side of the contents.
     *
     * @type {boolean}
     * @default true
     */
    get arrowButtonOverlap() {
      return this[state].arrowButtonOverlap;
    }
    set arrowButtonOverlap(arrowButtonOverlap) {
      this[setState]({ arrowButtonOverlap });
    }

    /**
     * The class or tag used to create the `arrow-button` parts – the
     * previous/next arrow buttons.
     *
     * @type {PartDescriptor}
     */
    get arrowButtonPartType() {
      return this[state].arrowButtonPartType;
    }
    set arrowButtonPartType(arrowButtonPartType) {
      this[setState]({ arrowButtonPartType });
    }

    // TODO: Symbols
    arrowButtonPrevious() {
      if (super.arrowButtonPrevious) {
        return super.arrowButtonPrevious();
      } else {
        return this[goPrevious]();
      }
    }

    arrowButtonNext() {
      if (super.arrowButtonNext) {
        return super.arrowButtonNext();
      } else {
        return this[goNext]();
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "arrow-button-overlap") {
        this.arrowButtonOverlap = String(newValue) === "true";
      } else if (name === "show-arrow-buttons") {
        this.showArrowButtons = String(newValue) === "true";
      } else {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        arrowButtonOverlap: true,
        arrowButtonPartType: Button,
        orientation: "horizontal",
        showArrowButtons: true,
      });
    }

    [render](/** @type {ChangedFlags} */ changed) {
      if (changed.arrowButtonPartType) {
        const arrowButtonPrevious = this[ids].arrowButtonPrevious;
        if (arrowButtonPrevious instanceof HTMLElement) {
          // Turn off focus handling for old previous button.
          forwardFocus(arrowButtonPrevious, null);
        }
        const arrowButtonNext = this[ids].arrowButtonNext;
        if (arrowButtonNext instanceof HTMLElement) {
          // Turn off focus handling for old next button.
          forwardFocus(arrowButtonNext, null);
        }
      }

      if (super[render]) {
        super[render](changed);
      }

      renderParts(this[shadowRoot], this[state], changed);

      if (changed.arrowButtonPartType) {
        /** @type {any} */
        const cast = this;

        const arrowButtonPrevious = this[ids].arrowButtonPrevious;
        if (arrowButtonPrevious instanceof HTMLElement) {
          forwardFocus(arrowButtonPrevious, cast);
        }
        const previousButtonHandler = createButtonHandler(this, () =>
          this.arrowButtonPrevious()
        );
        arrowButtonPrevious.addEventListener(
          "mousedown",
          previousButtonHandler
        );

        const arrowButtonNext = this[ids].arrowButtonNext;
        if (arrowButtonNext instanceof HTMLElement) {
          forwardFocus(arrowButtonNext, cast);
        }
        const nextButtonHandler = createButtonHandler(this, () =>
          this.arrowButtonNext()
        );
        arrowButtonNext.addEventListener("mousedown", nextButtonHandler);
      }

      const {
        arrowButtonOverlap,
        canGoNext,
        canGoPrevious,
        orientation,
        rightToLeft,
      } = this[state];
      const vertical = orientation === "vertical";
      /** @type {any} */ const arrowButtonPrevious = this[ids]
        .arrowButtonPrevious;
      /** @type {any} */ const arrowButtonNext = this[ids].arrowButtonNext;

      // Position the buttons.
      if (
        changed.arrowButtonOverlap ||
        changed.orientation ||
        changed.rightToLeft
      ) {
        this[ids].arrowDirection.style.flexDirection = vertical
          ? "column"
          : "row";

        const buttonStyle = {
          bottom: null,
          left: null,
          right: null,
          top: null,
        };
        if (arrowButtonOverlap) {
          Object.assign(buttonStyle, {
            position: "absolute",
            "z-index": 1,
          });
        } else {
          Object.assign(buttonStyle, {
            position: null,
            "z-index": null,
          });
        }
        let previousButtonStyle;
        let nextButtonStyle;
        if (arrowButtonOverlap) {
          if (vertical) {
            // Vertical
            Object.assign(buttonStyle, {
              left: 0,
              right: 0,
            });
            previousButtonStyle = {
              top: 0,
            };
            nextButtonStyle = {
              bottom: 0,
            };
          } else {
            // Horizontal
            Object.assign(buttonStyle, {
              bottom: 0,
              top: 0,
            });
            if (rightToLeft) {
              previousButtonStyle = {
                right: 0,
              };
              nextButtonStyle = {
                left: 0,
              };
            } else {
              // Typical condition: horizontal, left-to-right
              previousButtonStyle = {
                left: 0,
              };
              nextButtonStyle = {
                right: 0,
              };
            }
          }
        }
        Object.assign(
          arrowButtonPrevious.style,
          buttonStyle,
          previousButtonStyle
        );
        Object.assign(arrowButtonNext.style, buttonStyle, nextButtonStyle);
      }

      // Disable the previous/next buttons if we can't go in those directions.
      // WORKAROUND: We check to makes sure that can go previous/next state is
      // defined (which happens once the component has items). Without that
      // check, as of May 2019, a Chrome bug prevents the use of this mixin:
      // multiple carousel instances on a page will have their next button
      // initially disabled even when it should be enabled. Safari/Firefox do
      // not exhibit that issue. Since identifying the root cause proved too
      // difficult, this check was added.
      if (changed.canGoNext && canGoNext !== null) {
        arrowButtonNext.disabled = !canGoNext;
      }
      // See note for canGoNext above.
      if (changed.canGoPrevious && canGoPrevious !== null) {
        arrowButtonPrevious.disabled = !canGoPrevious;
      }

      if (changed.showArrowButtons) {
        const display = this[state].showArrowButtons ? null : "none";
        arrowButtonPrevious.style.display = display;
        arrowButtonNext.style.display = display;
      }
    }

    get showArrowButtons() {
      return this[state].showArrowButtons;
    }
    set showArrowButtons(showArrowButtons) {
      this[setState]({ showArrowButtons });
    }

    /**
     * Destructively wrap a node with elements to show arrow buttons.
     *
     * @param {Element} target - the node that should be wrapped by buttons
     */
    [wrap](target) {
      const arrowControls = fragmentFrom.html`
        <div
          id="arrowDirection"
          role="none"
          style="display: flex; flex: 1; overflow: hidden; position: relative;"
        >
          <div
            id="arrowButtonPrevious"
            part="arrow-button arrow-button-previous"
            exportparts="inner:arrow-button-inner"
            class="arrowButton"
            aria-hidden="true"
            tabindex="-1"
          >
            <slot name="arrowButtonPrevious"></slot>
          </div>
          <div
            id="arrowDirectionContainer"
            role="none"
            style="flex: 1; overflow: hidden; position: relative;"
          ></div>
          <div
            id="arrowButtonNext"
            part="arrow-button arrow-button-next"
            exportparts="inner:arrow-button-inner"
            class="arrowButton"
            aria-hidden="true"
            tabindex="-1"
          >
            <slot name="arrowButtonNext"></slot>
          </div>
        </div>
      `;

      renderParts(arrowControls, this[state]);

      // Wrap the target with the arrow controls.
      const container = arrowControls.getElementById("arrowDirectionContainer");
      if (container) {
        target.replaceWith(arrowControls);
        container.append(target);
      }
    }
  }

  return ArrowDirection;
}

/**
 * @private
 * @param {ReactiveElement} element
 * @param {function} callback
 * @returns {EventListener}
 */
function createButtonHandler(element, callback) {
  return async function mousedown(/** @type {Event} */ event) {
    // Only process events for the main (usually left) button.
    /** @type {any} */ const cast = event;
    if (cast.button !== 0) {
      return;
    }
    element[raiseChangeEvents] = true;
    const handled = callback();
    if (handled) {
      event.stopPropagation();
    }
    await Promise.resolve();
    element[raiseChangeEvents] = false;
  };
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
  if (!changed || changed.arrowButtonPartType) {
    const { arrowButtonPartType } = state;
    const arrowButtonPrevious = root.getElementById("arrowButtonPrevious");
    if (arrowButtonPrevious) {
      transmute(arrowButtonPrevious, arrowButtonPartType);
    }
    const arrowButtonNext = root.getElementById("arrowButtonNext");
    if (arrowButtonNext) {
      transmute(arrowButtonNext, arrowButtonPartType);
    }
  }
}

ArrowDirectionMixin.wrap = wrap;

export default ArrowDirectionMixin;
