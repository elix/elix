import * as internal from "./internal.js";
import * as template from "../core/template.js";
import Button from "./Button.js";
import Drawer from "./Drawer.js";
import html from "../core/html.js";

/**
 * A drawer that includes an always-visible grip element
 *
 * This variant of [Drawer](Drawer) includes a grip handle that remains visible
 * in the collapsed state. This both lets the user know the drawer is there, and
 * gives them a way to use a tap, click, or swipe to open or close the drawer.
 *
 * The default icon used to represent the handle can be replaced by slotting an
 * image or other element into the `grip` slot.
 *
 * @inherits Drawer
 * @part {Button} grip - the handle the user can tap, click, or swipe to open or close the drawer
 */
class DrawerWithGrip extends Drawer {
  /**
   * The class or tag used to create the `grip` part – the grip
   * handle the user can tap/click/swipe to open or close the drawer.
   *
   * @type {PartDescriptor}
   * @default Button
   */
  get gripPartType() {
    return this[internal.state].gripPartType;
  }
  set gripPartType(gripPartType) {
    this[internal.setState]({ gripPartType });
  }

  [internal.render](/** @type {ChangedFlags} */ changed) {
    if (super[internal.render]) {
      super[internal.render](changed);
    }

    renderParts(this[internal.shadowRoot], this[internal.state], changed);

    if (changed.gripPartType) {
      this[internal.ids].grip.addEventListener("click", event => {
        // Clicking grip toggles drawer.
        this[internal.raiseChangeEvents] = true;
        this.toggle();
        event.stopPropagation();
        this[internal.raiseChangeEvents] = false;
      });
    }

    if (changed.fromEdge || changed.rightToLeft) {
      // Position the grip so it's at the outer edge of the drawer.
      const { fromEdge, rightToLeft } = this[internal.state];

      const vertical = fromEdge === "top" || fromEdge === "bottom";
      this[internal.ids].frame.style.flexDirection = vertical
        ? "column"
        : "row";

      // Determine what grid we'll use to relatively position the content and
      // the grip.
      const mapFromEdgeToGrid = {
        bottom: "auto 1fr / auto",
        left: "auto / 1fr auto",
        right: "auto / auto 1fr",
        top: "1fr auto / auto"
      };
      mapFromEdgeToGrid.start = rightToLeft
        ? mapFromEdgeToGrid.right
        : mapFromEdgeToGrid.left;
      mapFromEdgeToGrid.end = rightToLeft
        ? mapFromEdgeToGrid.left
        : mapFromEdgeToGrid.right;

      // Determine what cell the grip will go in.
      const mapFromEdgeToGripCell = {
        bottom: "1 / 1",
        left: "1 / 2",
        right: "1 / 1",
        top: "2 / 1"
      };
      mapFromEdgeToGripCell.start = rightToLeft
        ? mapFromEdgeToGripCell.right
        : mapFromEdgeToGripCell.left;
      mapFromEdgeToGripCell.end = rightToLeft
        ? mapFromEdgeToGripCell.left
        : mapFromEdgeToGripCell.right;

      this[internal.ids].gripContainer.style.grid = mapFromEdgeToGrid[fromEdge];
      this[internal.ids].gripWorkaround.style.gridArea =
        mapFromEdgeToGripCell[fromEdge];
    }
  }

  [internal.rendered](/** @type {ChangedFlags} */ changed) {
    super[internal.rendered](changed);

    if (this[internal.state].gripSize === null) {
      // Use the rendered size of the grip to set the gripSize. This will ensure
      // the grip is visible, peeking out from the edge of the drawer's container.
      const { fromEdge } = this[internal.state];
      const vertical = fromEdge === "top" || fromEdge === "bottom";
      const dimension = vertical ? "offsetHeight" : "offsetWidth";
      const gripSize = this[internal.ids].grip[dimension];
      this[internal.setState]({ gripSize });
    }
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      gripPartType: Button
    });
  }

  // Tell TrackpadSwipeMixin that the gripped content is the scrollable element
  // the user is going to try to scroll with the trackpad.
  get [internal.scrollTarget]() {
    return this[internal.ids].grippedContent;
  }

  get [internal.template]() {
    const result = super[internal.template];

    // Replace the default slot with one that includes a grip element.
    //
    // The gripWorkaround element exists for Safari, which doesn't correctly
    // measure the grip dimensions when mounted without it. Having a div that's
    // display: block instead of flex appears to be the reason this helps.
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.replaceWith(html`
        <div id="gripContainer">
          <div id="grippedContent">
            <slot></slot>
          </div>
          <div id="gripWorkaround">
            <div id="grip" part="grip" aria-label="Toggle drawer">
              <slot name="grip"></slot>
            </div>
          </div>
        </div>
      `);
    }

    renderParts(result.content, this[internal.state]);

    result.content.append(html`
      <style>
        [part~="frame"] {
          display: flex;
          overflow: hidden;
        }

        #gripContainer {
          display: grid;
          height: 100%;
          width: 100%;
        }

        #grippedContent {
          overflow: auto;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
        }
        :host(:not([opened])) #grippedContent {
          overflow: hidden;
        }

        #gripWorkaround {
          display: grid;
        }

        [part~="grip"] {
          align-items: center;
          display: grid;
          justify-items: center;
        }
      </style>
    `);

    return result;
  }
}

/**
 * Render parts for the template or an instance.
 *
 * @private
 * @param {DocumentFragment} root
 * @param {PlainObject} state
 * @param {ChangedFlags} [changed]
 */
function renderParts(root, state, changed) {
  if (!changed || changed.gripPartType) {
    const { gripPartType } = state;
    const grip = root.getElementById("grip");
    if (grip) {
      template.transmute(grip, gripPartType);
    }
  }
}

export default DrawerWithGrip;
