import { merge } from './updates.js';
// @ts-ignore
import ArrowDirectionButton from './ArrowDirectionButton.js'; // eslint-disable-line no-unused-vars
import symbols from './symbols.js';


export default function ArrowDirectionMixin(Base) {

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

    get updates() {
      const buttonUpdates = {
        style: {
          'bottom': 0,
          'position': 'absolute',
          'top': 0,
          'z-index': 1
        }
      };

      const canGoLeft = this[symbols.canGoLeft];
      const canGoRight = this[symbols.canGoRight];

      const arrowButtonLeftUpdates = merge(buttonUpdates, {
        attributes: {
          disabled: !canGoLeft,
          hidden: supportsTouch()
        },
        style: {
          left: 0
        }
      });
        
      const arrowButtonRightUpdates = merge(buttonUpdates, {
        attributes: {
          disabled: !canGoRight,
          hidden: supportsTouch()
        },
        style: {
          right: 0
        }
      });

      const arrowIconProps = {
        style: {
          'height': '48px',
          'width': '48px'
        }
      };

      return merge(super.updates, {
        $: {
          arrowButtonLeft: arrowButtonLeftUpdates,
          arrowButtonRight: arrowButtonRightUpdates,
          arrowIconLeft: arrowIconProps,
          arrowIconRight: arrowIconProps,
          arrowDirection: {
            style: {
              'flex-direction': this.rightToLeft ? 'row-reverse' : 'row'
            }
          }
        }
      });
    }

    wrapWithArrowDirection(template) {
      return `
        <div id="arrowDirection" role="none" style="display: flex; flex: 1;">
          <elix-arrow-direction-button
            aria-hidden="true"
            id="arrowButtonLeft"
            tabIndex="-1"
            >
            <svg id="arrowIconLeft" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
              <g>
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </g>
            </svg>
          </elix-arrow-direction-button>
          <div role="none" style="display: flex; flex: 1; position: relative;">
            ${template}
          </div>
          <elix-arrow-direction-button
            aria-hidden="true"
            id="arrowButtonRight"
            tabIndex="-1"
            >
            <svg id="arrowIconRight" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
              <g>
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </g>
            </svg>
          </elix-arrow-direction-button>
        </div>
      `;
    }

  }

  return ArrowDirection;
}


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


// Simplistic detection of touch support.
function supportsTouch() {
  return 'ontouchstart' in window;
}
