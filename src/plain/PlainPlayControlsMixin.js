import * as internal from "../base/internal.js";
import html from "../core/html.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * PlayControlsMixin design in the Plain reference design system
 *
 * @module PlainPlayControlsMixin
 * @param {Constructor<ReactiveElement>} Base
 * @part control-icon - any of the icons shown in the control buttons
 * @part next-icon - icon for the next button
 * @part paused-icon - icon shown when the element is paused
 * @part playing-icon - icon shown when the element is playing
 * @part previous-icon - icon for the previous button
 */
export default function PlainPlayControlsMixin(Base) {
  return class PlainPlayControls extends Base {
    [internal.render](changed) {
      super[internal.render](changed);

      // Show playing icon if paused; paused icon if playing.
      if (changed.playing) {
        const { playing } = this[internal.state];
        this[internal.ids].pausedIcon.style.display = playing ? "none" : "";
        this[internal.ids].playingIcon.style.display = playing ? "" : "none";
      }

      // Flip the icons for right-to-left.
      if (changed.rightToLeft) {
        const rightToLeft = this[internal.state].rightToLeft;
        const transform = rightToLeft ? "rotate(180deg)" : "";
        this[internal.ids].nextIcon.style.transform = transform;
        this[internal.ids].previousIcon.style.transform = transform;
      }
    }

    get [internal.template]() {
      const result = super[internal.template];

      // Insert our icons into the button slots.
      const previousButton = result.content.querySelector(
        'slot[name="previousButton"]'
      );
      if (previousButton) {
        previousButton.append(
          html`
            <svg
              id="previousIcon"
              part="control-icon previous-icon"
              class="icon"
              viewBox="0 0 24 24"
              preserveAspectRatio="xMidYMid meet"
            >
              <g id="skip-previous">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </g>
            </svg>
          `
        );
      }
      const playButton = result.content.querySelector(
        'slot[name="playButton"]'
      );
      if (playButton) {
        playButton.append(
          html`
            <svg
              id="playingIcon"
              part="control-icon playing-icon"
              class="icon"
              viewBox="0 0 24 24"
              preserveAspectRatio="xMidYMid meet"
            >
              <g id="pause-circle-outline">
                <path
                  d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z"
                ></path>
              </g>
            </svg>
            <svg
              id="pausedIcon"
              part="control-icon paused-icon"
              class="icon"
              viewBox="0 0 24 24"
              preserveAspectRatio="xMidYMid meet"
            >
              <g id="play-circle-outline">
                <path
                  d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                ></path>
              </g>
            </svg>
          `
        );
      }
      const nextButton = result.content.querySelector(
        'slot[name="nextButton"]'
      );
      if (nextButton) {
        nextButton.append(
          html`
            <svg
              id="nextIcon"
              part="control-icon next-icon"
              class="icon"
              viewBox="0 0 24 24"
              preserveAspectRatio="xMidYMid meet"
            >
              <g id="skip-next">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </g>
            </svg>
          `
        );
      }

      result.content.append(
        html`
          <style>
            [part~="button-container"] {
              box-sizing: border-box;
              padding: 0.5em;
              text-align: center;
            }

            [part~="control-button"] {
              fill: rgba(255, 255, 255, 0.5);
              transition: fill 0.5s;
              vertical-align: middle;
            }
            :host(:hover) [part~="control-button"] {
              fill: rgba(255, 255, 255, 0.7);
            }
            [part~="control-button"]:hover {
              fill: rgba(255, 255, 255, 0.85);
            }
            [part~="control-button"]:active {
              fill: white;
            }

            [part~="control-icon"] {
              height: 30px;
              width: 30px;
            }

            [part~="playing-icon"],
            [part~="paused-icon"] {
              height: 40px;
              width: 40px;
            }
          </style>
        `
      );

      return result;
    }
  };
}
