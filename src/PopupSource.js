import './Popup.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import KeyboardMixin from './KeyboardMixin.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';


const Base =
  KeyboardMixin(
  OpenCloseMixin(
    ReactiveElement
  ));


class PopupSource extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    // Desktop popups generally open on mousedown, not click/mouseup. On mobile,
    // mousedown won't fire until the user releases their finger, so it behaves
    // like a click.
    this.$.button.addEventListener('mousedown', event => {
      // Only handle primary button mouse down to avoid interfering with
      // right-click behavior.
      /** @type {any} */
      const cast = event;
      if (cast.button === 0 && !this.opened) {
        setTimeout(() => {
          this[symbols.raiseChangeEvents] = true;
          this.open()
          this[symbols.raiseChangeEvents] = false;
        });
        event.stopPropagation();
        event.preventDefault();
      }
    });
    this.$.popup.addEventListener('opened-changed', event => {
      /** @type {any} */ 
      const cast = event;
      const opened = cast.detail.opened;
      if (opened !== this.opened) {
        this[symbols.raiseChangeEvents] = true;
        this.opened = opened;
        this[symbols.raiseChangeEvents] = false;
      }
    });
  }

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
    if (this.state.opened && !previousState.opened) {
      // Wait a tick to let the newly-opened component actually render.
      setTimeout(() => {
        // See if the rendered component fits above/below/left/right w.r.t. the
        // source.
        const fits = checkPopupFits(this, this.$.popup);
        this.setState(fits);
      });
    }
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      fitsAbove: true,
      fitsBelow: true,
      fitsLeft: true,
      fitsRight: true,
      horizontalAlign: 'left',
      popupPosition: 'below'
    });
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
      // Pressing Enter or Space opens the popup.
      case 'Enter':
      case ' ':
        this.open();
        handled = true;
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

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    if (state.opened && !this.opened &&
        (!state.fitsAbove || !state.fitsBelow || !state.fitsLeft || !state.fitsRight)) {
      // Reset our expectations of whether the opening component will fit above
      // and below. Assume it will fit in either direction.
      Object.assign(state, {
        fitsAbove: true,
        fitsBelow: true,
        fitsLeft: true,
        fitsRight: true
      });
      result = false;
    }
    return result;
  }

  // TODO: Tags for popup and source
  get [symbols.template]() {
    return `
      <style>
        :host {
          display: inline-block;
          position: relative;
        }

        #button {
          background-color: transparent;
          border-style: solid;
          display: block;
          margin: 0;
        }

        #popupContainer {
          height: 0;
          position: absolute;
          width: 100%;
        }

        #popup {
          align-items: initial;
          flex-direction: initial;
          height: initial;
          justify-content: initial;
          left: initial;
          position: absolute;
          top: initial;
          width: initial;
        }
      </style>
      <button id="button" tabindex="-1">
        <slot></slot>
      </button>
      <div id="popupContainer">
        <elix-popup id="popup">
          <slot name="popup"></slot>
        </elix-popup>
      </div>
    `;
  }

  // TODO: Pressed state for button
  get updates() {

    const buttonStyle = {
      'background-color': this.state.opened ? 'highlight' : ''
    };

    const preferPositionBelow = this.state.popupPosition === 'below';
    const { fitsAbove, fitsBelow, fitsLeft, fitsRight } = this.state;

    // If we're requested to position the popup below, we do so if there's room
    // below; if not, we position above if there's room above. If there's no
    // room in either direction, we position below.
    // Same general rule applies if we're requested to position above.
    const positionBelow = preferPositionBelow && (fitsBelow || !fitsAbove) ||
      !preferPositionBelow && !fitsAbove && fitsBelow;

    // Position container.
    const popupContainerStyle = positionBelow ?
      {
        bottom: '',
        position: 'relative',
        top: ''
      } :
      {
        bottom: 0,
        position: 'absolute',
        top: 0
      };

    // Position popup.
    const bottom = positionBelow ? '' : 0;

    let left;
    let right;
    const horizontalAlign = this.state.horizontalAlign;
    if (horizontalAlign === 'stretch') {
      left = 0;
      right = 0;
    } else {
      const preferLeftAlign = horizontalAlign === 'left';
      // The above/below preference rules also apply to left/right positioning.
      const positionLeft = preferLeftAlign && (fitsRight || !fitsLeft) ||
        !preferLeftAlign && !fitsRight && fitsLeft;
      left = positionLeft ? 0 : '';
      right = !positionLeft ? 0 : '';
    }

    const popupStyle = {
      bottom,
      left,
      right
    };

    return merge(super.updates, {
      $: {
        button: {
          style: buttonStyle
        },
        popup: {
          opened: this.state.opened,
          style: popupStyle
        },
        popupContainer: {
          style: popupContainerStyle
        }
      }
    });
  }

}


function checkPopupFits(source, popup) {
  const sourceRect = source.getBoundingClientRect();
  const popupRect = popup.getBoundingClientRect();
  const fitsAbove = sourceRect.top >= popupRect.height;
  const fitsBelow = sourceRect.bottom + popupRect.height <= window.innerHeight;
  const fitsLeft = sourceRect.right >= popupRect.width;
  const fitsRight = sourceRect.left + popupRect.width <= window.innerWidth;
  return {
    fitsAbove,
    fitsBelow,
    fitsLeft,
    fitsRight
  };
}


export default PopupSource;
customElements.define('elix-popup-source', PopupSource);
