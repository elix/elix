import { forwardFocus } from './utilities.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import ArrowDirectionButton from './ArrowDirectionButton.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars


const wrap = Symbol('wrap');


/**
 * Adds previous/next arrow buttons to a carousel-like component.
 * 
 * @module ArrowDirectionMixin
 * @elementrole {ArrowDirectionButton} arrowButton
 * @param {Constructor<ReactiveElement>} Base
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
      return this.state.arrowButtonOverlap;
    }
    set arrowButtonOverlap(arrowButtonOverlap) {
      const parsed = String(arrowButtonOverlap) === 'true';
      this.setState({
        arrowButtonOverlap: parsed
      });
    }
  
    /**
     * The class, tag, or template used to create the previous/next arrow
     * buttons.
     * 
     * @type {Role}
     * @default ArrowDirectionButton
     */
    get arrowButtonRole() {
      return this.state.arrowButtonRole;
    }
    set arrowButtonRole(arrowButtonRole) {
      this.setState({ arrowButtonRole });
    }

    // TODO: Symbols
    arrowButtonPrevious() {
      if (super.arrowButtonPrevious) {
        return super.arrowButtonPrevious();
      } else {
        return this[symbols.goPrevious]();
      }
    }

    arrowButtonNext() {
      if (super.arrowButtonNext) {
        return super.arrowButtonNext();
      } else {
        return this[symbols.goNext]();
      }
    }
  
    get defaultState() {
      return Object.assign(super.defaultState, {
        arrowButtonOverlap: true,
        arrowButtonRole: ArrowDirectionButton,
        orientation: 'horizontal',
        showArrowButtons: true
      });
    }

    [symbols.render](/** @type {PlainObject} */ changed) {

      if (changed.arrowButtonRole) {
        if (this.$.arrowButtonPrevious instanceof HTMLElement) {
          // Turn off focus handling for old previous button.
          forwardFocus(this.$.arrowButtonPrevious, null);
        }
        if (this.$.arrowButtonNext instanceof HTMLElement) {
          // Turn off focus handling for old next button.
          forwardFocus(this.$.arrowButtonNext, null);
        }
      }

      if (super[symbols.render]) { super[symbols.render](changed); }

      if (changed.arrowButtonRole) {
        /** @type {any} */
        const cast = this;

        template.transmute(this.$.arrowButtonPrevious, this.state.arrowButtonRole);
        if (this.$.arrowButtonPrevious instanceof HTMLElement) {
          forwardFocus(this.$.arrowButtonPrevious, cast);
        }
        const previousButtonHandler = createButtonHandler(this, () => this.arrowButtonPrevious());
        this.$.arrowButtonPrevious.addEventListener('mousedown', previousButtonHandler);
        
        template.transmute(this.$.arrowButtonNext, this.state.arrowButtonRole);
        if (this.$.arrowButtonNext instanceof HTMLElement) {
          forwardFocus(this.$.arrowButtonNext, cast);
        }
        const nextButtonHandler = createButtonHandler(this, () => this.arrowButtonNext());
        this.$.arrowButtonNext.addEventListener('mousedown', nextButtonHandler);
      }

      const {
        arrowButtonOverlap,
        canGoNext,
        canGoPrevious,
        darkMode,
        orientation,
        rightToLeft
      } = this.state;
      const vertical = orientation === 'vertical';
      /** @type {any} */ const arrowButtonPrevious = this.$.arrowButtonPrevious;
      /** @type {any} */ const arrowButtonNext = this.$.arrowButtonNext;

      // Position the buttons.
      if (changed.arrowButtonOverlap || changed.orientation || changed.rightToLeft) {

        this.$.arrowDirection.style.flexDirection = vertical ?
          'column' :
          'row';

        const buttonStyle = {
          bottom: null,
          left: null,
          right: null,
          top: null
        };
        if (arrowButtonOverlap) {
          Object.assign(buttonStyle, {
            position: 'absolute',
            'z-index': 1
          });
        } else {
          Object.assign(buttonStyle, {
            position: null,
            'z-index': null
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
        Object.assign(arrowButtonPrevious.style, buttonStyle, previousButtonStyle);
        Object.assign(arrowButtonNext.style, buttonStyle, nextButtonStyle);
      }

      // Rotate the default icons for vertical orientation, flip the default
      // icons for right-to-left.
      if (changed.orientation || changed.rightToLeft) {
        const transform = vertical ?
          'rotate(90deg)' :
          rightToLeft ?
            'rotateZ(180deg)' :
            null;
        this.$.arrowIconPrevious.style.transform = transform;
        this.$.arrowIconNext.style.transform = transform;
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
        if ('darkMode' in arrowButtonPrevious) {
          /** @type {any} */ (arrowButtonPrevious).darkMode = darkMode;
        }
        if ('darkMode' in arrowButtonNext) {
          /** @type {any} */ (arrowButtonNext).darkMode = darkMode;
        }
      }

      if (changed.showArrowButtons) {
        const display = this.state.showArrowButtons ? null : 'none';
        arrowButtonPrevious.style.display = display;
        arrowButtonNext.style.display = display;
      }
    }

    get showArrowButtons() {
      return this.state.showArrowButtons;
    }
    set showArrowButtons(showArrowButtons) {
      const parsed = String(showArrowButtons) === 'true';
      this.setState({
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
            class="arrowButton"
            aria-hidden="true"
            tabindex="-1"
            >
            <slot name="arrowButtonPrevious">
              <svg id="arrowIconPrevious" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="height: 1em; width: 1em;">
                <g>
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                </g>
              </svg>
            </slot>
          </div>
          <div id="arrowDirectionContainer" role="none" style="flex: 1; overflow: hidden; position: relative;"></div>
          <div
            id="arrowButtonNext"
            class="arrowButton"
            aria-hidden="true"
            tabindex="-1"
            >
            <slot name="arrowButtonNext">
              <svg id="arrowIconNext" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="height: 1em; width: 1em;">
                <g>
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                </g>
              </svg>
            </slot>
          </div>
        </div>
      `;
      template.wrap(original, arrowDirectionTemplate.content, '#arrowDirectionContainer');
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
    /** @type {any} */const cast = event;
    if (cast.button !== 0) {
      return;
    }
    element[symbols.raiseChangeEvents] = true;
    const handled = callback();
    if (handled) {
      event.stopPropagation();
    }
    await Promise.resolve();
    element[symbols.raiseChangeEvents] = false;
  }
}


ArrowDirectionMixin.wrap = wrap;


export default ArrowDirectionMixin;
