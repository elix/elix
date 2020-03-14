import * as internal from "../base/internal.js";
import html from "../core/html.js";
import ProgressSpinner from "../base/ProgressSpinner.js";

/**
 * ProgressSpinner component in the Plain reference design system
 *
 * @inherits ProgressSpinner
 */
class PlainProgressSpinner extends ProgressSpinner {
  get [internal.defaultState]() {
    // The spinner has 12 discrete steps in its rotation.
    return Object.assign(super[internal.defaultState], {
      rotationsPerSecond: 12
    });
  }

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);
    if (changed.count) {
      const step = 360 / this[internal.state].rotationsPerSecond;
      const angle = (this[internal.state].count * step) % 360;
      this[internal.ids].spinner.style.transform = `rotate(${angle}deg)`;
    }
  }

  get [internal.template]() {
    const result = super[internal.template];

    // Replace default slot with a spinner icon.
    // Spinner SVG created from https://dribbble.com/shots/958711-Free-vector-iOS-spinners.
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.replaceWith(html`
        <style>
          :host {
            height: 1.25em;
            width: 1.25em;
          }
        </style>
        <svg
          id="spinner"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60.02 60.02"
        >
          <defs>
            <style>
              .cls-1 {
                opacity: 0.5;
              }
              .cls-2 {
                opacity: 0.25;
              }
              .cls-3 {
                opacity: 0.65;
              }
              .cls-4 {
                opacity: 0.2;
              }
              .cls-5 {
                opacity: 0.6;
              }
              .cls-6 {
                opacity: 0.8;
              }
              .cls-7 {
                opacity: 0.45;
              }
              .cls-8 {
                opacity: 0.15;
              }
              .cls-9 {
                opacity: 0.55;
              }
              .cls-10 {
                opacity: 0.7;
              }
              .cls-11 {
                opacity: 0.35;
              }
            </style>
          </defs>
          <title>Asset 1</title>
          <g id="Layer_2" data-name="Layer 2">
            <g id="Spinners">
              <path
                class="cls-1"
                d="M33,12a3,3,0,0,1-3,3h0a3,3,0,0,1-3-3V3a3,3,0,0,1,3-3h0a3,3,0,0,1,3,3Z"
              />
              <path
                d="M33,57a3,3,0,0,1-3,3h0a3,3,0,0,1-3-3V48a3,3,0,0,1,3-3h0a3,3,0,0,1,3,3Z"
              />
              <path
                class="cls-2"
                d="M12,27a3,3,0,0,1,3,3h0a3,3,0,0,1-3,3H3a3,3,0,0,1-3-3H0a3,3,0,0,1,3-3Z"
              />
              <path
                class="cls-3"
                d="M57,27a3,3,0,0,1,3,3h0a3,3,0,0,1-3,3H48a3,3,0,0,1-3-3h0a3,3,0,0,1,3-3Z"
              />
              <path
                class="cls-4"
                d="M12.93,36.41a3,3,0,0,1,4.1,1.1h0a3,3,0,0,1-1.1,4.1L8.12,46.12A3,3,0,0,1,4,45H4a3,3,0,0,1,1.1-4.1Z"
              />
              <path
                class="cls-5"
                d="M51.9,13.9A3,3,0,0,1,56,15h0a3,3,0,0,1-1.1,4.1l-7.81,4.51a3,3,0,0,1-4.1-1.1h0a3,3,0,0,1,1.1-4.1Z"
              />
              <path
                class="cls-6"
                d="M36.41,47.09a3,3,0,0,1,1.1-4.1h0a3,3,0,0,1,4.1,1.1l4.51,7.81A3,3,0,0,1,45,56h0a3,3,0,0,1-4.1-1.1Z"
              />
              <path
                class="cls-7"
                d="M13.9,8.12A3,3,0,0,1,15,4h0a3,3,0,0,1,4.1,1.09l4.51,7.81a3,3,0,0,1-1.1,4.1h0a3,3,0,0,1-4.1-1.09Z"
              />
              <path
                class="cls-8"
                d="M18.43,44.1a3,3,0,0,1,4.1-1.1h0a3,3,0,0,1,1.1,4.1l-4.5,7.81A3,3,0,0,1,15,56h0a3,3,0,0,1-1.1-4.09Z"
              />
              <path
                class="cls-9"
                d="M40.89,5.11A3,3,0,0,1,45,4h0a3,3,0,0,1,1.1,4.09l-4.5,7.82a3,3,0,0,1-4.1,1.1h0a3,3,0,0,1-1.1-4.09Z"
              />
              <path
                class="cls-10"
                d="M44.1,41.59a3,3,0,0,1-1.1-4.1h0a3,3,0,0,1,4.1-1.1l7.81,4.51A3,3,0,0,1,56,45h0a3,3,0,0,1-4.09,1.11Z"
              />
              <path
                class="cls-11"
                d="M5.11,19.13A3,3,0,0,1,4,15H4a3,3,0,0,1,4.09-1.1l7.82,4.5a3,3,0,0,1,1.1,4.1h0a3,3,0,0,1-4.1,1.1Z"
              />
            </g>
          </g>
        </svg>
      `);
    }

    return result;
  }
}

export default PlainProgressSpinner;
