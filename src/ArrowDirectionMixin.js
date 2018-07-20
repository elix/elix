import { elementFromDescriptor, html, substituteElement } from './templates.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import ArrowDirectionButton from './ArrowDirectionButton.js';


const patch = Symbol('patch');


/**
 * Mixin which adds left and right arrow buttons to a carousel-like component.
 * 
 * @module ArrowDirectionMixin
 * @elementtag {ArrowDirectionButton} arrowButton
 */
function ArrowDirectionMixin(Base) {

  // The class prototype added by the mixin.
  class ArrowDirection extends Base {

    constructor() {
      super();
      Object.assign(this[symbols.descriptors], {
        arrowButton: ArrowDirectionButton
      });
    }

    /**
     * The tag used to create the left and right arrow buttons.
     * 
     * @type {function|string|Node}
     * @default {ArrowDirectionButton}
     */
    get arrowButtonDescriptor() {
      return this[symbols.descriptors].arrowButton;
    }
    set arrowButtonDescriptor(arrowButtonDescriptor) {
      this[symbols.hasDynamicTemplate] = true;
      this[symbols.descriptors].arrowButton;
    }
  
    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      this.$.arrowButtonLeft.addEventListener('click', async (event) => {
        this[symbols.raiseChangeEvents] = true;
        const handled = this[symbols.goLeft]();
        if (handled) {
          event.stopPropagation();
        }
        await Promise.resolve();
        this[symbols.raiseChangeEvents] = false;
      });
      this.$.arrowButtonRight.addEventListener('click', async (event) => {
        this[symbols.raiseChangeEvents] = true;
        const handled = this[symbols.goRight]();
        if (handled) {
          event.stopPropagation();
        }
        await Promise.resolve();
        this[symbols.raiseChangeEvents] = false;
      });
      assumeButtonFocus(this, this.$.arrowButtonLeft);
      assumeButtonFocus(this, this.$.arrowButtonRight);
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        showArrowButtons: true,
        orientation: 'horizontal',
        overlayArrowButtons: true
      });
    }

    /**
     * Add the arrow buttons to a template.
     * 
     * @param {Node} original - the element that should be wrapped by buttons
     */
    [patch](original) {
      const arrowDirectionTemplate = html`
        <div id="arrowDirection" role="none" style="display: flex; flex: 1; overflow: hidden; position: relative;">
          <div
            id="arrowButtonLeft"
            aria-hidden="true"
            >
            <slot name="arrowButtonLeft">
              <svg id="arrowIconLeft" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                <g>
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                </g>
              </svg>
            </slot>
          </div>
          <div id="arrowDirectionContainer" role="none" style="display: flex; flex: 1; overflow: hidden; position: relative;"></div>
          <div
            id="arrowButtonRight"
            aria-hidden="true"
            >
            <slot name="arrowButtonRight">
              <svg id="arrowIconRight" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                <g>
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                </g>
              </svg>
            </slot>
          </div>
        </div>
      `;
      substituteElement(
        arrowDirectionTemplate.content.querySelector('#arrowButtonLeft'),
        elementFromDescriptor(this.arrowButtonDescriptor)
      );
      substituteElement(
        arrowDirectionTemplate.content.querySelector('#arrowButtonRight'),
        elementFromDescriptor(this.arrowButtonDescriptor)
      );
      const arrowDirection = arrowDirectionTemplate.content.querySelector('#arrowDirection');
      original.parentNode.replaceChild(arrowDirection, original);
      const container = arrowDirection.querySelector('#arrowDirectionContainer');
      container.appendChild(original);
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

    get updates() {
      const base = super.updates;

      const overlayArrowButtons = this.state.overlayArrowButtons;
      const buttonUpdates = overlayArrowButtons ?
        {
          style: {
            'bottom': 0,
            'position': 'absolute',
            'top': 0,
            'z-index': 1
          }
        } :
        {};

      const canGoLeft = this[symbols.canGoLeft];
      const canGoRight = this[symbols.canGoRight];

      const arrowDisplay = this.state.showArrowButtons ?
        base.style && base.style.display || '' :
        'none';

      const arrowButtonLeftUpdates = merge(buttonUpdates, {
        attributes: {
          disabled: !canGoLeft
        },
        style: {
          display: arrowDisplay,
          left: overlayArrowButtons ? 0 : ''
        }
      });
        
      const arrowButtonRightUpdates = merge(buttonUpdates, {
        attributes: {
          disabled: !canGoRight
        },
        style: {
          display: arrowDisplay,
          right: overlayArrowButtons ? 0 : ''
        }
      });

      const arrowIconProps = {
        style: {
          'height': '48px',
          'width': '48px'
        }
      };

      return merge(base, {
        $: {
          arrowButtonLeft: arrowButtonLeftUpdates,
          arrowButtonRight: arrowButtonRightUpdates,
          arrowIconLeft: arrowIconProps,
          arrowIconRight: arrowIconProps,
          arrowDirection: {
            style: {
              'flex-direction': this[symbols.rightToLeft] ? 'row-reverse' : 'row'
            }
          }
        }
      });
    }

  }

  return ArrowDirection;
}


ArrowDirectionMixin.patch = patch;


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


export default ArrowDirectionMixin;
