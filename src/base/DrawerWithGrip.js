import { fragmentFrom } from "../core/htmlLiterals.js";
import { transmute } from "../core/template.js";
import Button from "./Button.js";
import Drawer from "./Drawer.js";
import {
  defaultState,
  ids,
  raiseChangeEvents,
  render,
  rendered,
  scrollTarget,
  setState,
  shadowRoot,
  state,
  template,
} from "./internal.js";

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
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      gripPartType: Button,
    });
  }

  /**
   * The class or tag used to create the `grip` part – the grip
   * handle the user can tap/click/swipe to open or close the drawer.
   *
   * @type {PartDescriptor}
   * @default Button
   */
  get gripPartType() {
    return this[state].gripPartType;
  }
  set gripPartType(gripPartType) {
    this[setState]({ gripPartType });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    if (super[render]) {
      super[render](changed);
    }

    renderParts(this[shadowRoot], this[state], changed);

    if (changed.gripPartType) {
      this[ids].grip.addEventListener("click", (event) => {
        // Clicking grip toggles drawer.
        this[raiseChangeEvents] = true;
        this.toggle();
        event.stopPropagation();
        this[raiseChangeEvents] = false;
      });
    }

    if (changed.fromEdge || changed.rightToLeft) {
      // Position the grip so it's at the outer edge of the drawer.
      const { fromEdge, rightToLeft } = this[state];

      const vertical = fromEdge === "top" || fromEdge === "bottom";
      this[ids].frame.style.flexDirection = vertical ? "column" : "row";

      // Determine what grid we'll use to relatively position the content and
      // the grip.
      const mapFromEdgeToGrid = {
        bottom: "auto 1fr / auto",
        left: "auto / 1fr auto",
        right: "auto / auto 1fr",
        top: "1fr auto / auto",
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
        top: "2 / 1",
      };
      mapFromEdgeToGripCell.start = rightToLeft
        ? mapFromEdgeToGripCell.right
        : mapFromEdgeToGripCell.left;
      mapFromEdgeToGripCell.end = rightToLeft
        ? mapFromEdgeToGripCell.left
        : mapFromEdgeToGripCell.right;

      this[ids].gripContainer.style.grid = mapFromEdgeToGrid[fromEdge];
      this[ids].gripWorkaround.style.gridArea = mapFromEdgeToGripCell[fromEdge];
    }
  }

  [rendered](/** @type {ChangedFlags} */ changed) {
    super[rendered](changed);

    if (this[state].gripSize === null) {
      // Use the rendered size of the grip to set the gripSize. This will ensure
      // the grip is visible, peeking out from the edge of the drawer's container.
      const { fromEdge } = this[state];
      const vertical = fromEdge === "top" || fromEdge === "bottom";
      const dimension = vertical ? "offsetHeight" : "offsetWidth";
      const gripSize = this[ids].grip[dimension];
      this[setState]({ gripSize });
    }
  }

  // Tell TrackpadSwipeMixin that the gripped content is the scrollable element
  // the user is going to try to scroll with the trackpad.
  get [scrollTarget]() {
    return this[ids].grippedContent;
  }

  get [template]() {
    const result = super[template];

    // Replace the default slot with one that includes a grip element.
    //
    // The gripWorkaround element exists for Safari, which doesn't correctly
    // measure the grip dimensions when mounted without it. Having a div that's
    // display: block instead of flex appears to be the reason this helps.
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.replaceWith(fragmentFrom.html`
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

    renderParts(result.content, this[state]);

    result.content.append(fragmentFrom.html`
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
      transmute(grip, gripPartType);
    }
  }
}

export default DrawerWithGrip;
