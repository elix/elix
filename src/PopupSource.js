import './Popup.js';
import { merge } from './updates.js';
import { ownEvent } from './utilities.js';
import * as symbols from './symbols.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';

const backdropTagKey = Symbol('backdropTag');
const frameTagKey = Symbol('frameTag');
const sourceTagKey = Symbol('popupButtonTag');
const popupTagKey = Symbol('popupTag');


const Base =
  FocusVisibleMixin(
  KeyboardMixin(
  LanguageDirectionMixin(
  OpenCloseMixin(
    ReactiveElement
  ))));


/**
 * Positions a [Popup](Popup) with respect to a source element, usually a button.
 * 
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

  /**
   * The tag used to create the optional backdrop element behind the overlay.
   * 
   * This can help focus the user's attention on the overlay content.
   * Additionally, a backdrop can be used to absorb clicks on background page
   * elements. For example, [Dialog](Dialog) uses [ModalBackdrop](ModalBackdrop)
   * as an overlay backdrop in such a way.
   * 
   * @type {string}
   * @default 'elix-backdrop'
   */
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
    this.addEventListener('focus', async (event) => {
      const hostFocused = !ownEvent(this.$.popup, event);
      // It's possible to get a focus event in the initial mousedown on the
      // source button before the popup is even rendered. We don't want to close
      // in that case, so we check to see if we've already measured the popup
      // dimensions (which will be true if the popup fully completed rendering).
      const measured = this.state.popupHeight !== null;
      if (hostFocused && this.opened && measured) {
        this[symbols.raiseChangeEvents] = true;
        await this.close();
        this[symbols.raiseChangeEvents] = false;
      }
    });

    // Desktop popups generally open on mousedown, not click/mouseup. On mobile,
    // mousedown won't fire until the user releases their finger, so it behaves
    // like a click.
    const mousedownHandler = (event => {
      // Only handle primary button mouse down to avoid interfering with
      // right-click behavior.
      if (event.button && event.button !== 0) {
        return;
      }
      // We give the default focus behavior time to run before opening the
      // popup. See note below.
      setTimeout(() => {
        if (!this.opened) {
          this[symbols.raiseChangeEvents] = true;
          this.open();
          this[symbols.raiseChangeEvents] = false;
        }
      });
      event.stopPropagation();
      // We don't prevent the default behavior for mousedown. Among other
      // things, it sets the focus to the element the user moused down on.
      // That's important for us, because OverlayMixin will remember that
      // focused element (i.e., this element) when opening, and restore focus to
      // it when the popup closes.
    }).bind(this);
    this.$.source.addEventListener('mousedown', mousedownHandler);

    if (!('PointerEvent' in window)) {
      // For faster handling on Mobile Safari.
      this.$.source.addEventListener('touchend', mousedownHandler);
    }

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
        frame: 'elix-overlay-frame',
        popup: 'elix-popup',
        source: 'button'
      }
    };
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      horizontalAlign: 'start',
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

  /**
   * The tag used to contain the popup content.
   * 
   * The frame element can be used to provide a border around the popup content,
   * and to provide visual effects such as a drop-shadow to help distinguish
   * popup content from background page elements.
   * 
   * @type {string}
   * @default 'elix-overlay-frame'
   */
  get frameTag() {
    return this[frameTagKey];
  }
  set frameTag(frameTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[frameTagKey] = frameTag;
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
   * The tag used to define the popup.
   * 
   * The popup element is responsible for handling overlay behavior.
   * 
   * @type {string}
   * @default 'elix-popup'
   */
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

  // Provide internal aliases for the inner backdrop and frame elements so that
  // we can update them via `updates`.
  // TODO: Find a better way to support updates of exposed subelements.
  get $() {
    const base = super.$;
    /** @type {any} */
    const cast = base.popup;
    return Object.assign({}, base, {
      backdrop: cast.backdrop,
      frame: cast.frame
    });
  }

  /**
   * The tag used to define the source button (or other element) that the
   * popup will be positioned in relation to.
   * 
   * @type {string}
   * @default 'button'
   */
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
          white-space: nowrap;
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
    const opacity = measured ? null : 0;
    const position = measured ? 'absolute' : 'fixed';

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
        frame: {
          style: {
            'max-height': maxFrameHeight ? `${maxFrameHeight}px` : null,
            'max-width': maxFrameWidth ? `${maxFrameWidth}px` : null
          }
        },
        popup: {
          opened: this.state.opened,
          style: popupStyle
        },
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
