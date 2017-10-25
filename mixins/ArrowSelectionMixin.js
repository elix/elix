import ArrowSelectionButton from '../elements/ArrowSelectionButton.js';
import * as props from './props.js';
import symbols from './symbols.js';


export default function ArrowSelectionMixin(Base) {

  // The class prototype added by the mixin.
  class ArrowSelection extends Base {

    get arrowIconProps() {
      return props.merge(super.arrowIconProps, {
        style: {
          'height': '48px',
          'width': '48px'
        }
      });
    }

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      this.$.arrowButtonLeft.addEventListener('click', event => {
        this.rightToLeft ?
          this.selectNext() :
          this.selectPrevious();
        event.stopPropagation();
      });
      this.$.arrowButtonRight.addEventListener('click', event => {
        this.rightToLeft ?
          this.selectPrevious() :
          this.selectNext();
        event.stopPropagation();
      });
      assumeButtonFocus(this, this.$.arrowButtonLeft);
      assumeButtonFocus(this, this.$.arrowButtonRight);
    }

    get props() {
      const buttonProps = {
        style: {
          'bottom': 0,
          'position': 'absolute',
          'top': 0,
          'z-index': 1
        }
      };

      const canGoLeft = this.rightToLeft ?
        this.canSelectNext :
        this.canSelectPrevious;
      const arrowButtonLeftProps = props.merge(buttonProps, {
        attributes: {
          disabled: !canGoLeft,
          hidden: supportsTouch()
        },
        style: {
          left: 0
        }
      });
        
      const canGoRight = this.rightToLeft ?
        this.canSelectPrevious :
        this.canSelectNext;
      const arrowButtonRightProps = props.merge(buttonProps, {
        attributes: {
          disabled: !canGoRight,
          hidden: supportsTouch()
        },
        style: {
          right: 0
        }
      });

      const arrowIconProps = this.arrowIconProps;

      return props.merge(super.props, {
        $: {
          arrowButtonLeft: arrowButtonLeftProps,
          arrowButtonRight: arrowButtonRightProps,
          arrowIconLeft: arrowIconProps,
          arrowIconRight: arrowIconProps,
          arrowSelection: {
            style: {
              'flex-direction': this.rightToLeft ? 'row-reverse' : 'row'
            }
          }
        }
      });
    }

    wrapWithArrowSelection(template) {
      return `
        <div id="arrowSelection" role="none" style="display: flex; flex: 1;">
          <elix-arrow-selection-button
            aria-hidden="true"
            id="arrowButtonLeft"
            tabIndex="-1"
            >
            <svg id="arrowIconLeft" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
              <g>
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </g>
            </svg>
          </elix-arrow-selection-button>
          <div role="none" style="display: flex; flex: 1; position: relative;">
            ${template}
          </div>
          <elix-arrow-selection-button
            aria-hidden="true"
            id="arrowButtonRight"
            tabIndex="-1"
            >
            <svg id="arrowIconRight" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
              <g>
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </g>
            </svg>
          </elix-arrow-selection-button>
        </div>
      `;
    }

  }

  return ArrowSelection;
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
