import * as internal from "./internal.js";
import * as template from "../core/template.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import Button from "./Button.js";

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
     * The class, tag, or template used to create the `control-button` parts –
     * the play control buttons.
     *
     * @type {PartDescriptor}
     * @default Button
     */
    get controlButtonPartType() {
      return this[internal.state].controlButtonPartType;
    }
    set controlButtonPartType(controlButtonPartType) {
      this[internal.setState]({ controlButtonPartType });
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        controlButtonPartType: Button
      });
    }

    // Pressing Space is the same as clicking the button.
    [internal.keydown](/** @type {KeyboardEvent} */ event) {
      let handled;

      switch (event.key) {
        case " ":
          this.click();
          handled = true;
          break;
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return (
        handled || (super[internal.keydown] && super[internal.keydown](event))
      );
    }

    [internal.render](/** @type {PlainObject} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }
      if (changed.controlButtonPartType) {
        const controlButtons = this[internal.shadowRoot].querySelectorAll(
          ".controlButton"
        );
        template.transmute(
          controlButtons,
          this[internal.state].controlButtonPartType
        );
        this[internal.ids].previousButton.addEventListener("click", event => {
          this.selectPrevious();
          event.stopPropagation();
        });
        this[internal.ids].playButton.addEventListener("click", event => {
          if (!this.playing) {
            this.play();
          } else {
            this.pause();
          }
          event.stopPropagation();
        });
        this[internal.ids].nextButton.addEventListener("click", event => {
          this.selectNext();
          event.stopPropagation();
        });
      }
    }

    /**
     * Destructively wrap a node with elements for play controls.
     *
     * @param {Node} original - the element that should be wrapped by play controls
     */
    [wrap](original) {
      const playControlsTemplate = template.html`
        <style>
          [part~="button-container"] {
            bottom: 0;
            position: absolute;
            width: 100%;
            z-index: 1;
          }

          #playControlsContainer {
            display: flex;
            flex: 1;
          }

          #playControlsContainer ::slotted(*) {
            flex: 1;
          }
        </style>

        <div part="button-container">
          <div class="controlButton" part="control-button previous-button" id="previousButton" aria-hidden="true" tabindex="-1">
            <slot name="previousButton"></slot>
          </div>
          <div class="controlButton" part="control-button play-button" id="playButton" aria-hidden="true" tabindex="-1">
            <slot name="playButton"></slot>
          </div>
          <div class="controlButton" part="control-button next-button" id="nextButton" aria-hidden="true" tabindex="-1">
            <slot name="nextButton"></slot>
          </div>
        </div>

        <div id="playControlsContainer" role="none"></div>
      `;
      template.wrap(
        original,
        playControlsTemplate.content,
        "#playControlsContainer"
      );
    }
  }

  return PlayControls;
}

PlayControlsMixin.wrap = wrap;
