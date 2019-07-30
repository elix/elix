import * as symbols from "./symbols.js";
import * as template from "./template.js";
import Drawer from "./Drawer.js";


/**
 * A drawer that includes an always-visible grip element
 * 
 * This variant of [Drawer](Drawer) includes a grip handle that remains visible
 * in the collapsed state. This both lets the user know the drawer is there, and
 * gives them a way to use a tap/click or swipe to open the drawer.
 * 
 * The default icon used to represent the handle can be replaced by slotting an
 * image or other element into the `grip` slot.
 * 
 * @inherits ReactiveElement
 */
class DrawerWithGrip extends Drawer {

  componentDidMount() {
    super.componentDidMount();

    this.$.grip.addEventListener('click', event => {
      // If user taps/clicks grip when opened, close drawer.
      this[symbols.raiseChangeEvents] = true;
      if (this.opened) {
        this.close();
        event.stopPropagation();
      }
      this[symbols.raiseChangeEvents] = false;
    });

    if (this.state.gripSize === null) {
      // Use the rendered size of the grip to set the gripSize. This will ensure
      // the grip is visible, peeking out from the edge of the drawer's container.
      const { fromEdge } = this.state;
      const vertical = fromEdge === 'top' || fromEdge === 'bottom';
      const dimension = vertical ? 'offsetHeight' : 'offsetWidth';
      const gripSize = this.$.grip[dimension];
      this.setState({ gripSize });
    }
  }

  [symbols.render](changed) {
    if (super[symbols.render]) { super[symbols.render](changed); }

    if (changed.fromEdge || changed.rightToLeft) {
      // Position the grip so it's at the outer edge of the drawer.
      const { fromEdge, rightToLeft } = this.state;
      let flexDirection;
      if (fromEdge === 'bottom') {
        flexDirection = 'column-reverse';
      } else if (fromEdge === 'end') {
        flexDirection = 'row-reverse';
      } else if (fromEdge === 'left') {
        flexDirection = rightToLeft ? 'row-reverse' : 'row';
      } else if (fromEdge === 'top') {
        flexDirection = 'column'
      } else if (fromEdge === 'right') {
        flexDirection = rightToLeft ? 'row' : 'row-reverse';
      } else {
        // 'start'
        flexDirection = 'row';
      }
      this.$.frame.style.flexDirection = flexDirection;
      this.$.gripContainer.style.flexDirection = flexDirection;
      this.$.grip.style.flexDirection = flexDirection;
    }

    if (changed.swipeAxis) {
      // Rotate the default grip icon to reflect the swipe axis.
      const transform = this.state.swipeAxis === 'horizontal' ?
        'rotate(90deg)' :
        null;
      this.$.gripIcon.style.transform = transform;
    }
  }

  get [symbols.template]() {
    const result = super[symbols.template];

    // Replace the default slot with one that includes a grip element.
    // Default grip icon from Material Design icons "drag handle".
    const gripTemplate = template.html`
      <style>
        #frame {
          display: flex;
        }

        #gripContainer {
          display: flex;
          flex: 1;
        }

        #gripContent {
          flex: 1;
        }

        #grip {
          align-items: center;
          display: flex;
          justify-self: center;
        }
      </style>
      <div id="gripContainer">
        <div id="gripContent">
          <slot></slot>
        </div>
        <div id="grip">
          <slot name="grip">
            <svg id="gripIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
              <defs>
                <path id="a" d="M0 0h24v24H0V0z"/>
              </defs>
              <clipPath id="b">
                <use xlink:href="#a" overflow="visible"/>
              </clipPath>
              <path clip-path="url(#b)" d="M20 9H4v2h16V9zM4 15h16v-2H4v2z"/>
            </svg>
          </slot>
        </div>
      </div>
    `;
    const defaultSlot = template.defaultSlot(result.content);
    if (defaultSlot) {
      template.transmute(defaultSlot, gripTemplate);
    }

    return result;
  }

}


customElements.define('elix-drawer-with-grip', DrawerWithGrip);
export default DrawerWithGrip;
