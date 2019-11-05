import * as internal from './internal.js';
import * as template from './template.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars
import SeamlessButton from './SeamlessButton.js';

const wrap = Symbol('wrap');

/**
 * Adds buttons for managing playback of a slideshow, audio, etc.
 *
 * [Play controls let the user go back, pause/resume, or forward](/demos/slideshowWithPlayControls.html)
 *
 * @module PlayControlsMixin
 * @param {Constructor<ReactiveElement>} Base
 * @part {SeamlessButton} control-button - any of the buttons that control playback
 * @part control-icon - any of the icons shown in the control buttons
 * @part next-button - the button that navigates to the next item
 * @part next-icon - icon for the next button
 * @part paused-icon - icon shown when the element is paused
 * @part playing-icon - icon shown when the element is playing
 * @part previous-button - the button that navigates to the previous item
 * @part previous-icon - icon for the previous button
 */
export default function PlayControlsMixin(Base) {
  // The class prototype added by the mixin.
  class PlayControls extends Base {
    /**
     * The class, tag, or template used to create the `control-button` parts –
     * the play control buttons.
     *
     * @type {PartDescriptor}
     * @default SeamlessButton
     */
    get controlButtonPartType() {
      return this[internal.state].controlButtonPartType;
    }
    set controlButtonPartType(controlButtonPartType) {
      this[internal.setState]({ controlButtonPartType });
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        controlButtonPartType: SeamlessButton
      });
    }

    // Pressing Space is the same as clicking the button.
    [internal.keydown](/** @type {KeyboardEvent} */ event) {
      let handled;

      switch (event.key) {
        case ' ':
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
        const controlButtons = this.shadowRoot.querySelectorAll(
          '.controlButton'
        );
        template.transmute(
          controlButtons,
          this[internal.state].controlButtonPartType
        );
        this[internal.ids].previousButton.addEventListener('click', event => {
          this.selectPrevious();
          event.stopPropagation();
        });
        this[internal.ids].playButton.addEventListener('click', event => {
          if (!this.playing) {
            this.play();
          } else {
            this.pause();
          }
          event.stopPropagation();
        });
        this[internal.ids].nextButton.addEventListener('click', event => {
          this.selectNext();
          event.stopPropagation();
        });
      }
      if (changed.playing) {
        const { playing } = this[internal.state];
        this[internal.ids].pausedIcon.style.display = playing ? 'none' : '';
        this[internal.ids].playingIcon.style.display = playing ? '' : 'none';
      }
      if (changed.rightToLeft) {
        const rightToLeft = this[internal.state].rightToLeft;
        const transform = rightToLeft ? 'rotate(180deg)' : '';
        this[internal.ids].nextIcon.style.transform = transform;
        this[internal.ids].previousIcon.style.transform = transform;
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
          #buttons {
            bottom: 0;
            box-sizing: border-box;
            padding: 0.5em;
            position: absolute;
            text-align: center;
            width: 100%;
            z-index: 1;
          }

          .controlButton {
            fill: rgba(255, 255, 255, 0.5);
            transition: fill 0.5s;
            vertical-align: middle;
          }
          :host(:hover) .controlButton {
            fill: rgba(255, 255, 255, 0.7);
          }
          .controlButton:hover {
            fill: rgba(255, 255, 255, 0.85);
          }
          .controlButton:active {
            fill: white;
          }

          .icon {
            height: 30px;
            width: 30px;
          }
          #playButton .icon {
            height: 40px;
            width: 40px;
          }

          #playControlsContainer {
            display: flex;
            flex: 1;
          }

          #playControlsContainer ::slotted(*) {
            flex: 1;
          }
        </style>

        <div id="buttons">
          <div class="controlButton" part="control-button previous-button" id="previousButton" aria-hidden="true" tabindex="-1">
            <slot name="previousButton">
              <svg id="previousIcon" part="control-icon previous-icon" class="icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                <g id="skip-previous">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </g>
              </svg>
            </slot>
          </div>
          <div class="controlButton" part="control-button play-button" id="playButton" aria-hidden="true" tabindex="-1">
            <slot name="playButton">
              <svg id="playingIcon" part="control-icon playing-icon" class="icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                <g id="pause-circle-outline">
                  <path d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z"></path>
                </g>
              </svg>
              <svg id="pausedIcon" part="control-icon paused-icon" class="icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                <g id="play-circle-outline">
                  <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                </g>
              </svg>
            </slot>
          </div>
          <div class="controlButton" part="control-button next-button" id="nextButton" aria-hidden="true" tabindex="-1">
            <slot name="nextButton">
              <svg id="nextIcon" part="control-icon next-icon" class="icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                <g id="skip-next">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </g>
              </svg>
            </slot>
          </div>
        </div>

        <div id="playControlsContainer" role="none"></div>
      `;
      template.wrap(
        original,
        playControlsTemplate.content,
        '#playControlsContainer'
      );
    }
  }

  return PlayControls;
}

PlayControlsMixin.wrap = wrap;
