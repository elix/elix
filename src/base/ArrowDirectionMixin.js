import { forwardFocus } from "../core/dom.js";
import * as internal from "./internal.js";
import * as template from "../core/template.js";
import Button from "./Button.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

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
      return this[internal.state].arrowButtonOverlap;
    }
    set arrowButtonOverlap(arrowButtonOverlap) {
      const parsed = String(arrowButtonOverlap) === "true";
      this[internal.setState]({
        arrowButtonOverlap: parsed
      });
    }

    /**
     * The class, tag, or template used to create the `arrow-button` parts – the
     * previous/next arrow buttons.
     *
     * @type {PartDescriptor}
     */
    get arrowButtonPartType() {
      return this[internal.state].arrowButtonPartType;
    }
    set arrowButtonPartType(arrowButtonPartType) {
      this[internal.setState]({ arrowButtonPartType });
    }

    // TODO: Symbols
    arrowButtonPrevious() {
      if (super.arrowButtonPrevious) {
        return super.arrowButtonPrevious();
      } else {
        return this[internal.goPrevious]();
      }
    }

    arrowButtonNext() {
      if (super.arrowButtonNext) {
        return super.arrowButtonNext();
      } else {
        return this[internal.goNext]();
      }
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        arrowButtonOverlap: true,
        arrowButtonPartType: Button,
        orientation: "horizontal",
        showArrowButtons: true
      });
    }

    [internal.render](/** @type {PlainObject} */ changed) {
      if (changed.arrowButtonPartType) {
        const arrowButtonPrevious = this[internal.ids].arrowButtonPrevious;
        if (arrowButtonPrevious instanceof HTMLElement) {
          // Turn off focus handling for old previous button.
          forwardFocus(arrowButtonPrevious, null);
        }
        const arrowButtonNext = this[internal.ids].arrowButtonNext;
        if (arrowButtonNext instanceof HTMLElement) {
          // Turn off focus handling for old next button.
          forwardFocus(arrowButtonNext, null);
        }
      }

      if (super[internal.render]) {
        super[internal.render](changed);
      }

      if (changed.arrowButtonPartType) {
        /** @type {any} */
        const cast = this;

        template.transmute(
          this[internal.ids].arrowButtonPrevious,
          this[internal.state].arrowButtonPartType
        );
        const arrowButtonPrevious = this[internal.ids].arrowButtonPrevious;
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

        template.transmute(
          this[internal.ids].arrowButtonNext,
          this[internal.state].arrowButtonPartType
        );
        const arrowButtonNext = this[internal.ids].arrowButtonNext;
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
        darkMode,
        orientation,
        rightToLeft
      } = this[internal.state];
      const vertical = orientation === "vertical";
      /** @type {any} */ const arrowButtonPrevious = this[internal.ids]
        .arrowButtonPrevious;
      /** @type {any} */ const arrowButtonNext = this[internal.ids]
        .arrowButtonNext;

      // Position the buttons.
      if (
        changed.arrowButtonOverlap ||
        changed.orientation ||
        changed.rightToLeft
      ) {
        this[internal.ids].arrowDirection.style.flexDirection = vertical
          ? "column"
          : "row";

        const buttonStyle = {
          bottom: null,
          left: null,
          right: null,
          top: null
        };
        if (arrowButtonOverlap) {
          Object.assign(buttonStyle, {
            position: "absolute",
            "z-index": 1
          });
        } else {
          Object.assign(buttonStyle, {
            position: null,
            "z-index": null
          });
        }
        let previousButtonStyle;
        let nextButtonStyle;
        if (arrowButtonOverlap) {
          if (vertical) {
            // Vertical
            Object.assign(buttonStyle, {
              left: 0,
              right: 0
            });
            previousButtonStyle = {
              top: 0
            };
            nextButtonStyle = {
              bottom: 0
            };
          } else {
            // Horizontal
            Object.assign(buttonStyle, {
              bottom: 0,
              top: 0
            });
            if (rightToLeft) {
              previousButtonStyle = {
                right: 0
              };
              nextButtonStyle = {
                left: 0
              };
            } else {
              // Typical condition: horizontal, left-to-right
              previousButtonStyle = {
                left: 0
              };
              nextButtonStyle = {
                right: 0
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
      // Wait for knowledge of dark mode
      if (changed.darkMode && darkMode !== null) {
        // Apply dark mode to buttons.
        if ("darkMode" in arrowButtonPrevious) {
          /** @type {any} */ (arrowButtonPrevious).darkMode = darkMode;
        }
        if ("darkMode" in arrowButtonNext) {
          /** @type {any} */ (arrowButtonNext).darkMode = darkMode;
        }
      }

      if (changed.showArrowButtons) {
        const display = this[internal.state].showArrowButtons ? null : "none";
        arrowButtonPrevious.style.display = display;
        arrowButtonNext.style.display = display;
      }
    }

    get showArrowButtons() {
      return this[internal.state].showArrowButtons;
    }
    set showArrowButtons(showArrowButtons) {
      const parsed = String(showArrowButtons) === "true";
      this[internal.setState]({
        showArrowButtons: parsed
      });
    }

    /**
     * Destructively wrap a node with elements to show arrow buttons.
     *
     * @param {Node} original - the node that should be wrapped by buttons
     */
    [wrap](original) {
      const arrowDirectionTemplate = template.html`
        <div id="arrowDirection" role="none" style="display: flex; flex: 1; overflow: hidden; position: relative;">
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
          <div id="arrowDirectionContainer" role="none" style="flex: 1; overflow: hidden; position: relative;"></div>
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
      template.wrap(
        original,
        arrowDirectionTemplate.content,
        "#arrowDirectionContainer"
      );
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
    element[internal.raiseChangeEvents] = true;
    const handled = callback();
    if (handled) {
      event.stopPropagation();
    }
    await Promise.resolve();
    element[internal.raiseChangeEvents] = false;
  };
}

ArrowDirectionMixin.wrap = wrap;

export default ArrowDirectionMixin;
