import './ArrowDirectionButton.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';


const arrowButtonTagKey = Symbol('arrowButtonTag');
const inject = Symbol('inject');


/**
 * Mixin which adds left and right arrow buttons to a carousel-like component.
 * 
 * @module ArrowDirectionMixin
 */
function ArrowDirectionMixin(Base) {

  // The class prototype added by the mixin.
  class ArrowDirection extends Base {

    get arrowButtonTag() {
      return this[arrowButtonTagKey];
    }
    set arrowButtonTag(arrowButtonTag) {
      this[symbols.hasDynamicTemplate] = true;
      this[arrowButtonTagKey] = arrowButtonTag;
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
    }

    get defaults() {
      const base = super.defaults || {};
      return Object.assign({}, base, {
        tags: Object.assign({}, base.tags, {
          arrowButton: base.tags && base.tags.arrowButton || 'elix-arrow-direction-button'
        })
      });
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
      const arrowButtonTag = this.arrowButtonTag || this.defaults.tags.arrowButton;
      return `
        <div id="arrowDirection" role="none" style="display: flex; flex: 1; overflow: hidden; position: relative;">
          <${arrowButtonTag}
            aria-hidden="true"
            id="arrowButtonLeft"
            tabIndex=""
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
            tabIndex=""
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


export default ArrowDirectionMixin;
