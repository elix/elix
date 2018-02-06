import './ArrowDirectionButton.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';


const inject = Symbol('inject');


/**
 * Mixin which adds left and right arrow buttons to a carousel-like component.
 * 
 * @module ArrowDirectionMixin
 */
function ArrowDirectionMixin(Base) {

  // The class prototype added by the mixin.
  class ArrowDirection extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      this.$.arrowButtonLeft.addEventListener('click', event => {
        const handled = this[symbols.goLeft]();
        if (handled) {
          event.stopPropagation();
        }
      });
      this.$.arrowButtonRight.addEventListener('click', event => {
        const handled = this[symbols.goRight]();
        if (handled) {
          event.stopPropagation();
        }
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

    get showArrowButtons() {
      return this.state.showArrowButtons;
    }
    set showArrowButtons(showArrowButtons) {
      const parsed = String(showArrowButtons) === 'true';
      this.setState({
        showArrowButtons: parsed
      });
    }

    [inject](template) {
      const arrowButtonTag = this.tags.arrowButton;
      return `
        <div id="arrowDirection" role="none" style="display: flex; flex: 1; overflow: hidden; position: relative;">
          <${arrowButtonTag}
            aria-hidden="true"
            id="arrowButtonLeft"
            tabIndex="-1"
            >
            <slot name="arrowButtonLeft">
              <svg id="arrowIconLeft" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                <g>
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </g>
              </svg>
            </slot>
          </${arrowButtonTag}>
          <div role="none" style="display: flex; flex: 1; overflow: hidden; position: relative;">
            ${template}
          </div>
          <${arrowButtonTag}
            aria-hidden="true"
            id="arrowButtonRight"
            tabIndex="-1"
            >
            <slot name="arrowButtonRight">
              <svg id="arrowIconRight" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                <g>
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </g>
              </svg>
            </slot>
          </${arrowButtonTag}>
        </div>
      `;
    }

    get tags() {
      const base = super.tags || {};
      return Object.assign({}, super.tags, {
        arrowButton: base.arrowButton || 'elix-arrow-direction-button'
      });
    }
    set tags(tags) {
      super.tags = tags;
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


ArrowDirectionMixin.inject = inject;


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
