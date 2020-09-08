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
    keydown,
    render,
    setState,
    shadowRoot,
    state
} from "./internal.js";

const wrap = Symbol("wrap");

/**
 * Adds buttons for managing playback of a slideshow, audio, etc.
 *
 * [Play controls let the user go back, pause/resume, or forward](/demos/slideshowWithPlayControls.html)
 *
 * @module PlayControlsMixin
 * @param {Constructor<ReactiveElement>} Base
 * @part {Button} control-button - any of the buttons that control playback
 * @part next-button - the button that navigates to the next item
 * @part play-button - the button that starts or pauses playback
 * @part previous-button - the button that navigates to the previous item
 */
export default function PlayControlsMixin(Base) {
  // The class prototype added by the mixin.
  class PlayControls extends Base {
    /**
     * The class or tag used to create the `control-button` parts –
     * the play control buttons.
     *
     * @type {PartDescriptor}
     * @default Button
     */
    get controlButtonPartType() {
      return this[state].controlButtonPartType;
    }
    set controlButtonPartType(controlButtonPartType) {
      this[setState]({ controlButtonPartType });
    }

    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        controlButtonPartType: Button,
      });
    }

    // Pressing Space is the same as clicking the button.
    [keydown](/** @type {KeyboardEvent} */ event) {
      let handled;

      switch (event.key) {
        case " ":
          this.click();
          handled = true;
          break;
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super[keydown] && super[keydown](event));
    }

    [render](/** @type {ChangedFlags} */ changed) {
      if (changed.arrowButtonPartType) {
        const previousButton = this[ids].previousButton;
        if (previousButton instanceof HTMLElement) {
          // Turn off focus handling for old previous button.
          forwardFocus(previousButton, null);
        }
        const playButton = this[ids].playButton;
        if (playButton instanceof HTMLElement) {
          // Turn off focus handling for old play button.
          forwardFocus(playButton, null);
        }
        const nextButton = this[ids].nextButton;
        if (nextButton instanceof HTMLElement) {
          // Turn off focus handling for old next button.
          forwardFocus(nextButton, null);
        }
      }

      if (super[render]) {
        super[render](changed);
      }

      renderParts(this[shadowRoot], this[state], changed);

      if (changed.controlButtonPartType) {
        const { nextButton, playButton, previousButton } = this[ids];
        previousButton.addEventListener("click", (event) => {
          this[goPrevious]();
          event.stopPropagation();
        });
        playButton.addEventListener("click", (event) => {
          if (!this.playing) {
            this.play();
          } else {
            this.pause();
          }
          event.stopPropagation();
        });
        nextButton.addEventListener("click", (event) => {
          this[goNext]();
          event.stopPropagation();
        });

        // Keep focus on host.
        if (previousButton instanceof HTMLElement) {
          forwardFocus(previousButton, this);
        }
        if (playButton instanceof HTMLElement) {
          forwardFocus(playButton, this);
        }
        if (nextButton instanceof HTMLElement) {
          forwardFocus(nextButton, this);
        }
      }
    }

    /**
     * Destructively wrap a node with elements for play controls.
     *
     * @param {Element} target - the element that should be wrapped by play controls
     */
    [wrap](target) {
      const playControls = fragmentFrom.html`
        <style>
          [part~="button-container"] {
            bottom: 0;
            position: absolute;
            width: 100%;
            z-index: 1;
          }

          #playControlsContainer {
            display: grid;
            flex: 1;
          }
        </style>

        <div part="button-container">
          <div
            part="control-button previous-button"
            id="previousButton"
            aria-hidden="true"
            tabindex="-1"
          >
            <slot name="previousButton"></slot>
          </div>
          <div
            part="control-button play-button"
            id="playButton"
            aria-hidden="true"
            tabindex="-1"
          >
            <slot name="playButton"></slot>
          </div>
          <div
            part="control-button next-button"
            id="nextButton"
            aria-hidden="true"
            tabindex="-1"
          >
            <slot name="nextButton"></slot>
          </div>
        </div>

        <div id="playControlsContainer" role="none"></div>
      `;

      renderParts(playControls, this[state]);

      // Wrap the target with the play controls.
      const container = playControls.getElementById("playControlsContainer");
      if (container) {
        target.replaceWith(playControls);
        container.append(target);
      }
    }
  }

  return PlayControls;
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
  if (!changed || changed.controlButtonPartType) {
    const { controlButtonPartType } = state;
    const controlButtons = root.querySelectorAll("[part~="control-button"]");
    controlButtons.forEach((controlButton) =>
      transmute(controlButton, controlButtonPartType)
    );
  }
}

PlayControlsMixin.wrap = wrap;
