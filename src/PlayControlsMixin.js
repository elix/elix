import { elementFromDescriptor, html, substituteElement } from './templates.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import SeamlessButton from './SeamlessButton.js';


const patch = Symbol('patch');


/**
 * Template mixin which adds buttons for managing playback of a slideshow, audio
 * playlist, etc.
 * 
 * [Play controls let the user go back, pause/resume, or forward](/demos/slideshowWithPlayControls.html)
 * 
 * @module PlayControlsMixin
 * @elementtag {SeamlessButton} controlButton
 */
export default function PlayControlsMixin(Base) {

  // The class prototype added by the mixin.
  class PlayControls extends Base {

    constructor() {
      super();
      this[symbols.descriptors] = {
        controlButton: SeamlessButton
      };
    }
  
    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      this.$.previousButton.addEventListener('click', event => {
        this.selectPrevious();
        event.stopPropagation();
      });
      this.$.playButton.addEventListener('click', event => {
        if (!this.playing) {
          this.play();
        } else {
          this.pause();
        }
        event.stopPropagation();
      });
      this.$.nextButton.addEventListener('click', event => {
        this.selectNext();
        event.stopPropagation();
      });
      assumeButtonFocus(this, this.$.previousButton);
      assumeButtonFocus(this, this.$.playButton);
      assumeButtonFocus(this, this.$.nextButton);
    }

    /**
     * The tag used to create the play control buttons.
     * 
     * @type {function|string|Node}
     * @default 'elix-seamless-button'
     */
    get controlButtonDescriptor() {
      return this[symbols.descriptors].controlButton;
    }
    set controlButtonDescriptor(controlButtonDescriptor) {
      this[symbols.hasDynamicTemplate] = true;
      this[symbols.descriptors].controlButton = controlButtonDescriptor;
    }

    // Pressing Space is the same as clicking the button.
    [symbols.keydown](event) {
      let handled;

      switch (event.key) {
        case ' ':
          this.click();
          handled = true;
          break;
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super[symbols.keydown] && super[symbols.keydown](event));
    }
    
    /**
     * Add the play controls to a template.
     * 
     * @param {Node} original - the element that should be wrapped by play controls
     */
    [patch](original) {
      const playControlsTemplate = html`
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

          #container {
            display: flex;
            flex: 1;
          }
          display: flex; flex: 1; overflow: hidden; position: relative;
          #container ::slotted(*) {
            flex: 1;
          }
        </style>

        <div id="buttons">
          <div class="controlButton" id="previousButton" aria-hidden="true" tabindex="-1">
            <slot name="previousButton">
              <svg id="previousIcon" class="icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                <g id="skip-previous">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </g>
              </svg>
            </slot>
          </div>
          <div class="controlButton" id="playButton" aria-hidden="true" tabindex="-1">
            <slot name="playButton">
              <svg id="playingIcon" class="icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                <g id="pause-circle-outline">
                  <path d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z"></path>
                </g>
              </svg>
              <svg id="pausedIcon" class="icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                <g id="play-circle-outline">
                  <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                </g>
              </svg>
            </slot>
          </div>
          <div class="controlButton" id="nextButton" aria-hidden="true" tabindex="-1">
            <slot name="nextButton">
              <svg id="nextIcon" class="icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                <g id="skip-next">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </g>
              </svg>
            </slot>
          </div>
        </div>

        <div id="container" role="none"></div>
      `;
      const playControls = playControlsTemplate.content;
      const buttons = playControls.querySelectorAll('.controlButton');
      buttons.forEach(button => {
        substituteElement(
          button,
          elementFromDescriptor(this.controlButtonDescriptor)
        );  
      });
      const container = playControls.querySelector('#container');
      original.parentNode.replaceChild(playControls, original);
      container.appendChild(original);
    }

    get updates() {
      const playing = this.playing;

      const rightToLeft = this[symbols.rightToLeft];
      const transform = rightToLeft ?
        'rotate(180deg)' :
        '';

      return merge(super.updates, {
        $: {
          nextIcon: {
            style: {
              transform
            }
          },
          pausedIcon: {
            style: {
              display: playing ? 'none' : ''
            }
          },
          playingIcon: {
            style: {
              display: playing ? '' : 'none'
            }
          },
          previousIcon: {
            style: {
              transform
            }
          },
        }
      })
    }

  }

  return PlayControls;
}


PlayControlsMixin.patch = patch;


/*
 * By default, a button will always take focus on mousedown. For this component,
 * we want to override that behavior, such that a mousedown on a button keeps
 * the focus on the outer component.
 */
function assumeButtonFocus(element, button) {
  button.addEventListener('mousedown', event => {
    // Given the main element the focus if it doesn't already have it.
    element.focus();
    // Prevent the default focus-on-mousedown behavior.
    event.preventDefault();
  });
}
