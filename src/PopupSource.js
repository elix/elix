import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import Backdrop from './Backdrop.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import OverlayFrame from './OverlayFrame.js';
import Popup from './Popup.js';
import ReactiveElement from './ReactiveElement.js';

const resizeListenerKey = Symbol('resizeListener');


const Base =
  FocusVisibleMixin(
  LanguageDirectionMixin(
  OpenCloseMixin(
    ReactiveElement
  )));


/**
 * Positions a popup with respect to a source element
 * 
 * @inherits ReactiveElement
 * @mixes FocusVisibleMixin
 * @mixes KeyboardMixin
 * @mixes OpenCloseMixin
 * @elementrole {Backdrop} backdrop
 * @elementrole {OverlayFrame} frame
 * @elementrole {Popup} popup
 * @elementrole {'button'} source
 */
class PopupSource extends Base {

  constructor() {
    super();
    this[symbols.renderedRoles] = {};
  }

  /**
   * The class, tag, or template used for the optional backdrop element behind
   * the overlay.
   * 
   * This can help focus the user's attention on the overlay content.
   * Additionally, a backdrop can be used to absorb clicks on background page
   * elements. For example, [Dialog](Dialog) uses [ModalBackdrop](ModalBackdrop)
   * as an overlay backdrop in such a way.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default Backdrop
   */
  get backdropRole() {
    return this.state.backdropRole;
  }
  set backdropRole(backdropRole) {
    this.setState({ backdropRole });
  }

  [symbols.beforeUpdate]() {
    if (super[symbols.beforeUpdate]) { super[symbols.beforeUpdate](); }

    if (this[symbols.renderedRoles].sourceRole !== this.state.sourceRole) {
      template.transmute(this.$.source, this.state.sourceRole);
      this[symbols.renderedRoles].sourceRole = this.state.sourceRole;
    }
    
    if (this[symbols.renderedRoles].popupRole !== this.state.popupRole) {
      template.transmute(this.$.popup, this.state.popupRole);

      // Popup's opened state becomes our own opened state.
      this.$.popup.addEventListener('opened', () => {
        if (!this.opened) {
          this[symbols.raiseChangeEvents] = true;
          this.open();
          this[symbols.raiseChangeEvents] = false;
        }
      });

      // Popup's closed state becomes our own closed state.
      this.$.popup.addEventListener('closed', event => {
        if (!this.closed) {
          this[symbols.raiseChangeEvents] = true;
          /** @type {any} */ 
          const cast = event;
          const closeResult = cast.detail.closeResult;
          this.close(closeResult);
          this[symbols.raiseChangeEvents] = false;
        }
      });

      this[symbols.renderedRoles].popupRole = this.state.popupRole;
    }
  }

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }    
    if (this.state.opened) {
      // Popup is opened initially, which is somewhat unusual.
      waitThenRenderOpened(this);
    }
  }

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
    const openedChanged = this.state.opened !== previousState.opened;
    if (openedChanged) {
      if (this.opened && !previousState.opened) {
        waitThenRenderOpened(this);
      } else {
        removeEventListeners(this);
      }
    }
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      backdropRole: Backdrop,
      frameRole: OverlayFrame,
      horizontalAlign: 'start',
      popupPosition: 'below',
      popupMeasured: false,
      popupRole: Popup,
      role: 'none',
      sourceRole: 'div'      
    });
  }

  /**
   * The class, tag, or template used to contain the popup content.
   * 
   * The frame element can be used to provide a border around the popup content,
   * and to provide visual effects such as a drop-shadow to help distinguish
   * popup content from background page elements.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default OverlayFrame
   */
  get frameRole() {
    return this.state.frameRole;
  }
  set frameRole(frameRole) {
    this.setState({ frameRole });
  }

  /**
   * The alignment of the popup with respect to the source button.
   * 
   * * `start`: popup and source are aligned on the leading edge according to
   *   the text direction
   * * `end`: popup and source are aligned on the trailing edge according to the
   *   text direction
   * * `left`: popup and source are left-aligned
   * * `right`: popup and source are right-aligned
   * * `stretch: both left and right edges are aligned
   * 
   * @type {('start'|'end'|'left'|'right'|'stretch')}
   * @default 'start'
   */
  get horizontalAlign() {
    return this.state.horizontalAlign;
  }
  set horizontalAlign(horizontalAlign) {
    this.setState({
      horizontalAlign
    });
  }

  /**
   * The preferred direction for the popup.
   * 
   * * `above`: popup should appear above the source
   * * `below`: popup should appear below the source
   * 
   * @type {('above'|'below')}
   * @default 'below'
   */
  get popupPosition() {
    return this.state.popupPosition;
  }
  set popupPosition(popupPosition) {
    this.setState({
      popupPosition
    });
  }

  /**
   * The class, tag, or template used to define the popup.
   * 
   * The popup element is responsible for handling overlay behavior.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default Popup
   */
  get popupRole() {
    return this.state.popupRole;
  }
  set popupRole(popupRole) {
    this.setState({ popupRole });
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    const closing = !state.opened && this.opened;
    if (closing && state.popupMeasured) {
      // Reset our calculations of popup dimensions and room around the source.
      Object.assign(state, {
        popupMeasured: false
      });
      result = false;
    }
    return result;
  }

  /**
   * The class, tag, or template used for the button (or other element) that
   * will invoke the popup.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default 'button'
   */
  get sourceRole() {
    return this.state.sourceRole;
  }
  set sourceRole(sourceRole) {
    this.setState({ sourceRole });
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
          position: relative;
        }

        #source {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          width: 100%;
        }

        #popupContainer {
          height: 0;
          outline: none;
          position: absolute;
          width: 100%;
        }

        #popup {
          align-items: initial;
          flex-direction: initial;
          height: initial;
          justify-content: initial;
          left: initial;
          outline: none;
          position: absolute;
          top: initial;
          width: initial;
        }
      </style>
      <div id="source">
        <slot name="source"></slot>
      </div>
      <div id="popupContainer" role="none">
        <div id="popup" role="none">
          <slot></slot>
        </div>
      </div>
    `;
  }

  get updates() {

    const base = super.updates;

    const role = this.state.original && this.state.original.attributes.role ||
      base.attributes && base.attributes.role ||
      this.state.role;

    const opened = this.state.opened;
    const sourceStyle = {
      'background-color': opened ? 'highlight' : '',
      color: opened ? 'highlighttext' : ''
    };

    const {
      popupMeasured,
      windowHeight,
      windowWidth
    } = this.state;

    const popupRect = this.$.popup.getBoundingClientRect();
    const popupHeight = popupRect.height;
    const popupWidth = popupRect.width;
    
    const sourceRect = this.getBoundingClientRect();
    const roomAbove = sourceRect.top;
    const roomBelow = Math.ceil(windowHeight - sourceRect.bottom);
    const roomLeft = sourceRect.right;
    const roomRight = Math.ceil(windowWidth - sourceRect.left);
    
    const fitsAbove = popupHeight <= roomAbove;
    const fitsBelow = popupHeight <= roomBelow;
    const canLeftAlign = popupWidth <= roomRight;
    const canRightAlign = popupWidth <= roomLeft;

    const preferPositionBelow = this.state.popupPosition === 'below';

    // We respect each position popup preference (above/below/right/right) if
    // there's room in that direction. Otherwise, we use the horizontal/vertical
    // position that maximizes the popup width/height.
    const positionBelow =
      (preferPositionBelow && (fitsBelow || roomBelow >= roomAbove)) ||
      (!preferPositionBelow && !fitsAbove && roomBelow >= roomAbove);
    const fitsVertically = positionBelow && fitsBelow ||
      !positionBelow && fitsAbove;
    const maxFrameHeight = fitsVertically ?
      null :
      positionBelow ?
        roomBelow :
        roomAbove;

    // Position container.
    const popupContainerStyle = {
      top: positionBelow ? '' : 0
    };

    // Position popup.
    const bottom = positionBelow ? '' : 0;

    let left;
    let right;
    let maxFrameWidth;
    const horizontalAlign = this.state.horizontalAlign;
    if (horizontalAlign === 'stretch') {
      left = 0;
      right = 0;
      maxFrameWidth = null;
    } else {
      const preferLeftAlign = horizontalAlign === 'left' ||
        (this[symbols.rightToLeft] ?
          horizontalAlign === 'end' :
          horizontalAlign === 'start');
      // The above/below preference rules also apply to left/right alignment.
      const alignLeft =
        (preferLeftAlign && (canLeftAlign || roomRight >= roomLeft)) ||
        (!preferLeftAlign && !canRightAlign && roomRight >= roomLeft);
      left = alignLeft ? 0 : '';
      right = !alignLeft ? 0 : '';
  
      const fitsHorizontally = alignLeft && roomRight ||
        !alignLeft && roomLeft;
      maxFrameWidth = fitsHorizontally ?
        null :
        alignLeft ?
          roomRight :
          roomLeft;
    }

    // Until we've measured the rendered position of the popup, render it in
    // fixed position (so it doesn't affect page layout or scrolling), and don't
    // make it visible yet. If we use `visibility: hidden` for this purpose, the
    // popup won't be able to receive the focus. Instead, we use zero opacity as
    // a way to make the popup temporarily invisible until we have checked where
    // it fits.
    const opacity = popupMeasured ? null : 0;
    const position = popupMeasured ? 'absolute' : 'fixed';

    const popupStyle = {
      bottom,
      left,
      opacity,
      position,
      right
    };

    return merge(base, {
      attributes: {
        'aria-expanded': opened,
        'aria-haspopup': true,
        role
      },
      $: {
        popup: Object.assign(
          {
            frame: {
              style: {
                'max-height': maxFrameHeight ? `${maxFrameHeight}px` : null,
                'max-width': maxFrameWidth ? `${maxFrameWidth}px` : null
              }
            },
            opened: this.state.opened,
            style: popupStyle,
          },
          'backdropRole' in this.$.popup && {
            backdropRole: this.backdropRole
          },
          'frameRole' in this.$.popup && {
            frameRole: this.frameRole
          }
        ),
        popupContainer: {
          style: popupContainerStyle
        },
        source: {
          style: sourceStyle
        }
      }
    });
  }

}


function addEventListeners(element) {
  element[resizeListenerKey] = event => {
    measureWindow(element);
  }
  window.addEventListener('resize', element[resizeListenerKey]);
}


function removeEventListeners(element) {
  if (element[resizeListenerKey]) {
    window.removeEventListener('resize', element[resizeListenerKey]);
    element[resizeListenerKey] = null;
  }
}


// If we haven't already measured the popup since it was opened, measure its
// dimensions and the relevant distances in which the popup might be opened.
function measureWindow(element) {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  element.setState({
    windowHeight,
    windowWidth
  });
}

//
// When a popup is first rendered, we let it render invisibly so that it doesn't
// affect the page layout.
//
// We then wait, for two reasons:
// 
// 1) We need to give the popup time to render invisibly. That lets us get the
//    true size of the popup content.
//
// 2) Wire up events that can dismiss the popup. If the popup was opened because
//    the user clicked something, that opening click event may still be bubbling
//    up, and we only want to start listening after it's been processed.
//    Along the same lines, if the popup caused the page to scroll, we don't
//    want to immediately close because the page scrolled (only if the user
//    scrolls).
//
// After waiting, we can take care of both of the above tasks.
//
function waitThenRenderOpened(element) {
  // Wait a tick to let the newly-opened component actually render.
  const callback = 'requestIdleCallback' in window ?
    window['requestIdleCallback'] :
    setTimeout;
  callback(() => {
    // It's conceivable the popup was closed before the timeout completed,
    // so double-check that it's still opened before listening to events.
    if (element.opened) {
      measureWindow(element);
      element.setState({
        popupMeasured: true
      });
      addEventListeners(element);
    }
  });
}


export default PopupSource;
customElements.define('elix-popup-source', PopupSource);
