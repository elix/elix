import './Popup.js';
import './PopupFrame.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';

const backdropTagKey = Symbol('backdropTag');
const frameTagKey = Symbol('frameTag');
const sourceTagKey = Symbol('popupButtonTag');
const popupTagKey = Symbol('popupTag');


const Base =
  FocusVisibleMixin(
  KeyboardMixin(
  OpenCloseMixin(
    ReactiveElement
  )));


/**
 * @inherits ReactiveElement
 * @mixes FocusVisibleMixin
 * @mixes KeyboardMixin
 * @mixes OpenCloseMixin
 * @elementtag {Backdrop} backdrop
 * @elementtag {OverlayFrame} frame
 * @elementtag {Popup} popup
 * @elementtag {HTMLButtonElement} source
 */
class PopupSource extends Base {

  get backdropTag() {
    return this[backdropTagKey];
  }
  set backdropTag(backdropTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[backdropTagKey] = backdropTag;
  }

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }

    // If the top-level element gets the focus while the popup is open, the most
    // likely expanation is that the user hit Shift+Tab to back up out of the
    // popup. In that case, we should close.
    this.addEventListener('focus', async () => {
      if (this.opened) {
        this[symbols.raiseChangeEvents] = true;
        await this.close();
        this[symbols.raiseChangeEvents] = false;
      }
    });

    // Desktop popups generally open on mousedown, not click/mouseup. On mobile,
    // mousedown won't fire until the user releases their finger, so it behaves
    // like a click.
    this.$.source.addEventListener('mousedown', event => {
      // Only handle primary button mouse down to avoid interfering with
      // right-click behavior.
      /** @type {any} */
      const cast = event;
      if (cast.button === 0 && !this.opened) {
        setTimeout(() => {
          this[symbols.raiseChangeEvents] = true;
          this.open();
          this[symbols.raiseChangeEvents] = false;
        });
      }
    });

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
    
    if (this.state.opened) {
      // Popup is opened initially, which is somewhat unusual.
      setTimeout(() => {
        measurePopup(this)
      });
    }
  }

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
    if (this.state.opened && !previousState.opened) {
      // Wait a tick to let the newly-opened component actually render.
      setTimeout(() => {
        measurePopup(this);
      });
    }
  }

  get defaults() {
    return {
      tags: {
        backdrop: 'elix-backdrop',
        frame: 'elix-popup-frame', // TODO: Move to Popup
        popup: 'elix-popup',
        source: 'button'
      }
    };
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      horizontalAlign: 'left',
      popupPosition: 'below',
      role: 'button',
      popupWidth: null,
      popupHeight: null,
      roomAbove: null,
      roomBelow: null,
      roomLeft: null,
      roomRight: null
    });
  }

  get frameTag() {
    return this[frameTagKey];
  }
  set frameTag(frameTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[frameTagKey] = frameTag;
  }

  // TODO: 'start', 'end'
  get horizontalAlign() {
    return this.state.horizontalAlign;
  }
  set horizontalAlign(horizontalAlign) {
    this.setState({
      horizontalAlign
    });
  }

  [symbols.keydown](event) {
    let handled;

    switch (event.key) {

      // Space or Up/Down arrow keys open the popup.
      case ' ':
      case 'ArrowDown':
      case 'ArrowUp':
        if (this.closed) {
          this.open();
          handled = true;
        }
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
  }

  get popupPosition() {
    return this.state.popupPosition;
  }
  set popupPosition(popupPosition) {
    this.setState({
      popupPosition
    });
  }

  get popupTag() {
    return this[popupTagKey];
  }
  set popupTag(popupTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[popupTagKey] = popupTag;
  }

  get popupTemplate() {
    const backdropTag = this.backdropTag || this.defaults.tags.backdrop;
    const frameTag = this.frameTag || this.defaults.tags.frame;
    const popupTag = this.popupTag || this.defaults.tags.popup;
    return `
      <${popupTag} id="popup" backdrop-tag="${backdropTag}" frame-tag="${frameTag}" role="none">
        <slot></slot>
      </${popupTag}>
    `;
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    const closing = !state.opened && this.opened;
    if (closing && state.popupHeight !== null) {
      // Reset our calculations of popup dimensions and room around the source.
      Object.assign(state, {
        popupHeight: null,
        popupWidth: null,
        roomAbove: null,
        roomBelow: null,
        roomLeft: null,
        roomRight: null
      });
      result = false;
    }
    return result;
  }

  get sourceTag() {
    return this[sourceTagKey];
  }
  set sourceTag(sourceTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[sourceTagKey] = sourceTag;
  }

  get sourceSlotContent() {
    return '';
  }

  get sourceTemplate() {
    const sourceTag = this.sourceTag || this.defaults.tags.source;
    return `
      <${sourceTag} id="source" tabindex="-1">
        <slot name="source">${this.sourceSlotContent}</slot>
      </${sourceTag}>
    `;
  }

  // TODO: Tags for popup and source
  get [symbols.template]() {
    const sourceTemplate = this.sourceTemplate;
    const popupTemplate = this.popupTemplate;
    return `
      <style>
        :host {
          display: inline-block;
          position: relative;
        }

        #source {
          background: buttonface;
          border-style: solid;
          color: inherit;
          display: block;
          font-size: inherit;
          font-family: inherit;
          font-style: inherit;
          margin: 0;
          outline: none;
          padding: 0.25em 0.5em;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
          user-select: none;
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
      ${sourceTemplate}
      <div id="popupContainer" role="none">
        ${popupTemplate}
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
      popupHeight,
      popupWidth,
      roomAbove,
      roomBelow,
      roomLeft,
      roomRight
    } = this.state;
    const measured = popupHeight !== null;
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
      const preferLeftAlign = horizontalAlign === 'left';
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


    // Until we've measured the rendered position of the popup, keep it in the
    // layout but don't make it visible yet. If we use `visibility: hidden` for
    // this purpose, the popup won't be able to receive the focus. Instead, we
    // use zero opacity as a way to make the popup temporarily invisible until
    // we have checked where it fits.
    const opacity = measured ? null : 0;

    const popupStyle = {
      bottom,
      left,
      'max-height': maxFrameHeight ? `${maxFrameHeight}px` : null,
      'max-width': maxFrameWidth ? `${maxFrameWidth}px` : null,
      opacity,
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
            opened: this.state.opened,
            style: popupStyle
          },
          'maxFrameHeight' in this.$.popup && {
            maxFrameHeight
          },
          'maxFrameWidth' in this.$.popup && {
            maxFrameWidth
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


// If we haven't already measured the popup since it was opened, measure its
// dimensions and the relevant distances in which the popup might be opened.
function measurePopup(element) {
  if (element.state.roomAbove !== null) {
    return;
  }
  const sourceRect = element.getBoundingClientRect();
  const popupRect = element.$.popup.getBoundingClientRect();
  element.setState({
    popupHeight: popupRect.height,
    popupWidth: popupRect.width,
    roomAbove: sourceRect.top,
    roomBelow: Math.ceil(window.innerHeight - sourceRect.bottom),
    roomLeft: sourceRect.right,
    roomRight: Math.ceil(window.innerWidth - sourceRect.left)
  });
}


export default PopupSource;
customElements.define('elix-popup-source', PopupSource);
